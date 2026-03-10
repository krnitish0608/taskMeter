import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '@themes/ThemeContext';
import type { Theme } from '@themes/index';
import type { TaskRecord } from '@modules/tasks/services/taskDbService';

interface TaskItemProps {
  task: TaskRecord;
  onToggle: (id: string, isCompleted: boolean) => void;
  onPress: (taskId: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onPress, onDelete }) => {
  const { theme } = useTheme();
  const styles = makeStyles(theme);

  const handleToggle = useCallback(() => {
    onToggle(task.id, !task.isCompleted);
  }, [task.id, task.isCompleted, onToggle]);

  const handlePress = useCallback(() => {
    onPress(task.id);
  }, [task.id, onPress]);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
    ]);
  }, [task.id, onDelete]);

  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      onLongPress={handleDelete}
      activeOpacity={0.7}>
      <TouchableOpacity
        style={[styles.checkbox, task.isCompleted && styles.checkboxChecked]}
        onPress={handleToggle}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.content}>
        <Text
          style={[styles.title, task.isCompleted && styles.titleCompleted]}
          numberOfLines={1}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}
        {formattedDate ? (
          <Text style={styles.dueDate}>Due: {formattedDate}</Text>
        ) : null}
      </View>
      {task.syncStatus !== 'synced' ? (
        <View style={styles.syncBadge}>
          <Text style={styles.syncText}>●</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.small,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    checkboxChecked: {
      backgroundColor: theme.colors.success,
      borderColor: theme.colors.success,
    },
    checkmark: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    titleCompleted: {
      textDecorationLine: 'line-through',
      color: theme.colors.textSecondary,
    },
    description: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    dueDate: {
      fontSize: 12,
      color: theme.colors.primary,
      marginTop: 4,
    },
    syncBadge: {
      marginLeft: 8,
    },
    syncText: {
      color: '#FF9500',
      fontSize: 10,
    },
  });

export default memo(TaskItem);
