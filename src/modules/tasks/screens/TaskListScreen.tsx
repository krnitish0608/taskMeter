import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch } from '@core/hooks/useAppDispatch';
import { useAppSelector } from '@core/hooks/useAppSelector';
import { useNetworkStatus } from '@core/hooks/useNetworkStatus';
import { useTheme } from '@themes/ThemeContext';
import type { Theme } from '@themes/index';
import {
  loadTasks,
  toggleTaskComplete,
  deleteTask,
  syncTasks,
} from '@modules/tasks/slices/taskSlice';
import TaskItem from '@modules/tasks/components/TaskItem';
import type { TaskRecord } from '@modules/tasks/services/taskDbService';
import type { AppStackParamList } from '@core/types/navigation';

type TaskListNavProp = NativeStackNavigationProp<AppStackParamList>;

const ITEM_HEIGHT = 85; // approximate height for getItemLayout

/** Animated sync banner shown at the top of the screen */
const SyncBanner = React.memo(
  ({ syncing, primaryColor }: { syncing: boolean; primaryColor: string }) => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
      if (syncing) {
        spinValue.setValue(0);
        animationRef.current = Animated.loop(
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        );
        animationRef.current.start();
      } else {
        animationRef.current?.stop();
        spinValue.setValue(0);
      }
      return () => {
        animationRef.current?.stop();
      };
    }, [syncing, spinValue]);

    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    if (!syncing) {
      return null;
    }

    return (
      <View style={[bannerStyles.syncBanner, { backgroundColor: primaryColor }]}>
        <Animated.Text
          style={[bannerStyles.syncIcon, { transform: [{ rotate: spin }] }]}>
          ⟳
        </Animated.Text>
        <Text style={bannerStyles.syncText}>Syncing with cloud...</Text>
      </View>
    );
  },
);

const bannerStyles = StyleSheet.create({
  syncBanner: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncIcon: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
    color: '#FFFFFF',
  },
  syncText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

const TaskListScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<TaskListNavProp>();
  const { theme } = useTheme();
  const styles = makeStyles(theme);
  const { tasks, syncing } = useAppSelector(state => state.tasks);
  const isConnected = useNetworkStatus();

  useEffect(() => {
    dispatch(loadTasks());
  }, [dispatch]);

  // Auto-sync when connectivity is restored
  useEffect(() => {
    if (isConnected) {
      dispatch(syncTasks());
    }
  }, [isConnected, dispatch]);

  const handleToggle = useCallback(
    (id: string, isCompleted: boolean) => {
      dispatch(toggleTaskComplete({ id, isCompleted }));
    },
    [dispatch],
  );

  const handlePress = useCallback(
    (taskId: string) => {
      navigation.navigate('AddEditTask', { taskId });
    },
    [navigation],
  );

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(deleteTask(id));
    },
    [dispatch],
  );

  const handleRefresh = useCallback(() => {
    if (isConnected) {
      dispatch(syncTasks());
    } else {
      dispatch(loadTasks());
    }
  }, [dispatch, isConnected]);

  const handleAddTask = useCallback(() => {
    navigation.navigate('AddEditTask', {});
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: TaskRecord }) => (
      <TaskItem
        task={item}
        onToggle={handleToggle}
        onPress={handlePress}
        onDelete={handleDelete}
      />
    ),
    [handleToggle, handlePress, handleDelete],
  );

  const keyExtractor = useCallback((item: TaskRecord) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No tasks yet</Text>
        <Text style={styles.emptySubtext}>Tap + to add your first task</Text>
      </View>
    ),
    [styles],
  );

  return (
    <View style={styles.container}>
      {!isConnected && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline – changes will sync when connected</Text>
        </View>
      )}

      <SyncBanner syncing={syncing} primaryColor={theme.colors.primary} />

      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={tasks.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
        removeClippedSubviews
        maxToRenderPerBatch={15}
        windowSize={10}
        initialNumToRender={10}
      />

      <TouchableOpacity style={styles.fab} onPress={handleAddTask} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    list: {
      paddingTop: theme.spacing.small,
      paddingBottom: 100,
    },
    emptyList: {
      flex: 1,
    },
    offlineBanner: {
      backgroundColor: '#FF9500',
      paddingVertical: 8,
      paddingHorizontal: theme.spacing.medium,
      alignItems: 'center',
    },
    offlineText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    emptySubtext: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
    },
    fab: {
      position: 'absolute',
      right: theme.spacing.large,
      bottom: theme.spacing.large,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    fabText: {
      color: '#FFFFFF',
      fontSize: 28,
      lineHeight: 30,
      fontWeight: '400',
    },
  });

export default TaskListScreen;
