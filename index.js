/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

/**
 * CRITICAL: Initialize Firebase before rendering the app.
 * This ensures the google-services.json configuration is loaded
 * before any Firebase service (Auth, Firestore, etc.) is used.
 */
import './src/core/firebase/init';

import App from './App';
import { name as appName } from './app.json';

// Handle background FCM messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background FCM message received:', remoteMessage);
  
  // Display notification using Notifee
  await notifee.displayNotification({
    title: remoteMessage.notification?.title || 'New Notification',
    body: remoteMessage.notification?.body || '',
    android: {
      channelId: 'task-reminders',
      importance: 4, // HIGH
      pressAction: { id: 'default' },
    },
    ios: {
      sound: 'default',
    },
    data: remoteMessage.data,
  });
});

AppRegistry.registerComponent(appName, () => App);
