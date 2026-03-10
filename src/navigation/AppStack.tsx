import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@themes/ThemeContext';
import type { AppStackParamList, AppTabParamList } from '@core/types/navigation';

const TaskListScreen = React.lazy(
  () => import('@modules/tasks/screens/TaskListScreen'),
);
const AddEditTaskScreen = React.lazy(
  () => import('@modules/tasks/screens/AddEditTaskScreen'),
);
const SettingsScreen = React.lazy(
  () => import('@modules/settings/screens/SettingsScreen'),
);

const Tab = createBottomTabNavigator<AppTabParamList>();
const Stack = createNativeStackNavigator<AppStackParamList>();

const HomeTabs = () => {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}>
      <Tab.Screen
        name="Tasks"
        component={TaskListScreen}
        options={{
          title: 'My Tasks',
          tabBarLabel: 'Tasks',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppStack = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        contentStyle: { backgroundColor: theme.colors.background },
      }}>
      <Stack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddEditTask"
        component={AddEditTaskScreen}
        options={{ title: 'Task' }}
      />
    </Stack.Navigator>
  );
};
