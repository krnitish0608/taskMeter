import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTheme } from '@themes/ThemeContext';
import type { Theme } from '@themes/index';
import { useAppDispatch } from '@core/hooks/useAppDispatch';
import { useAppSelector } from '@core/hooks/useAppSelector';
import { logout } from '@modules/auth/slices/authSlice';
import { resetTasks } from '@modules/tasks/slices/taskSlice';
import { appConfig } from '@config/index';

const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const styles = makeStyles(theme);
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          dispatch(resetTasks());
          dispatch(logout());
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email ?? 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <TouchableOpacity style={styles.row} onPress={toggleTheme} activeOpacity={0.7}>
          <Text style={styles.label}>Theme</Text>
          <Text style={styles.value}>{isDark ? 'Dark' : 'Light'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Environment</Text>
          <Text style={styles.value}>{appConfig.env}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingTop: theme.spacing.medium,
    },
    section: {
      marginBottom: theme.spacing.large,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      paddingHorizontal: theme.spacing.large,
      marginBottom: theme.spacing.small,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.large,
      paddingVertical: 14,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
    },
    value: {
      fontSize: 16,
      color: theme.colors.textSecondary,
    },
    logoutButton: {
      marginHorizontal: theme.spacing.large,
      marginTop: theme.spacing.large,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      paddingVertical: 16,
      alignItems: 'center',
    },
    logoutText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default SettingsScreen;
