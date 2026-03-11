import React, { Suspense, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAppDispatch } from '@core/hooks/useAppDispatch';
import { useAppSelector } from '@core/hooks/useAppSelector';
import { setUser } from '@modules/auth/slices/authSlice';
import { authService } from '@modules/auth/services/authService';
import { notificationService } from '@modules/notifications/services/notificationService';
import { useTheme } from '@themes/ThemeContext';
import { AuthStack } from '@navigation/AuthStack';
import { AppStack } from '@navigation/AppStack';

const LoadingFallback = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.fallback, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.auth);
  const { theme, isDark } = useTheme();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(user => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          }),
        );
      } else {
        dispatch(setUser(null));
      }
    });
    return unsubscribe;
  }, [dispatch]);

  useEffect(() => {
    // Initialize notifications and FCM
    const setup = async () => {
      await notificationService.initialize();
      
      const fcmToken = await notificationService.registerForFCM();
      if (fcmToken) {
        console.log('FCM registered successfully');
      }
    };
    
    setup();

    // Listen for foreground messages
    const unsubscribeForeground = notificationService.onForegroundMessage(
      message => {
        console.log('Foreground notification received:', message);
      },
    );

    // Listen for notification press
    const unsubscribePress = notificationService.onNotificationPress(
      notification => {
        console.log('Notification tapped:', notification);
      },
    );

    // Check if app was opened from a notification
    notificationService.getInitialNotification().then(notification => {
      if (notification) {
        console.log('App opened from notification:', notification);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribePress();
    };
  }, []);

  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.error,
    },
    fonts: {
      regular: { fontFamily: 'System', fontWeight: '400' as const },
      medium: { fontFamily: 'System', fontWeight: '500' as const },
      bold: { fontFamily: 'System', fontWeight: '700' as const },
      heavy: { fontFamily: 'System', fontWeight: '800' as const },
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Suspense fallback={<LoadingFallback />}>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </Suspense>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
