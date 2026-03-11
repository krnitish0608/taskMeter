import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

const CHANNEL_ID = 'task-reminders';

export const notificationService = {
  /**
   * Request notification permissions and create the Android channel.
   */
  initialize: async (): Promise<void> => {
    // Create Android notification channel
    await notifee.createChannel({
      id: CHANNEL_ID,
      name: 'Task Reminders',
      importance: AndroidImportance.HIGH,
    });

    // Request permissions
    await notifee.requestPermission();
  },

  /**
   * Schedule a local push notification for a task reminder.
   */
  scheduleTaskReminder: async (
    taskId: string,
    title: string,
    body: string,
    triggerDate: Date,
  ): Promise<string> => {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
    };

    const notificationId = await notifee.createTriggerNotification(
      {
        id: `task_${taskId}`,
        title,
        body,
        android: {
          channelId: CHANNEL_ID,
          pressAction: { id: 'default' },
          importance: AndroidImportance.HIGH,
        },
        ios: {
          sound: 'default',
        },
      },
      trigger,
    );

    return notificationId;
  },

  /**
   * Cancel a previously scheduled notification.
   */
  cancelTaskReminder: async (taskId: string): Promise<void> => {
    await notifee.cancelNotification(`task_${taskId}`);
  },

  /**
   * Display an immediate local notification.
   */
  displayLocalNotification: async (
    title: string,
    body: string,
  ): Promise<void> => {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        pressAction: { id: 'default' },
      },
      ios: {
        sound: 'default',
      },
    });
  },

  /**
   * Register for Firebase Cloud Messaging and return the token.
   * Save this token to your backend to send targeted push notifications.
   */
  registerForFCM: async (): Promise<string | null> => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.log('FCM permission not granted');
        return null;
      }

      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      // TODO: Send this token to your backend server to store for the user
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  },

  /**
   * Listen for foreground FCM messages and display them.
   */
  onForegroundMessage: (callback: (message: any) => void) => {
    return messaging().onMessage(async remoteMessage => {
      console.log('Foreground FCM message received:', remoteMessage);
      
      // Display notification in foreground
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'New Notification',
        body: remoteMessage.notification?.body || '',
        android: {
          channelId: CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          pressAction: { id: 'default' },
        },
        ios: {
          sound: 'default',
        },
        data: remoteMessage.data,
      });
      
      // Call the callback
      callback(remoteMessage);
    });
  },

  /**
   * Handle notification press/interaction.
   */
  onNotificationPress: (callback: (notification: any) => void) => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === 1) { // PRESS event
        console.log('Notification pressed:', detail.notification);
        callback(detail.notification);
      }
    });
  },

  /**
   * Check for initial notification (app opened from notification).
   */
  getInitialNotification: async () => {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      console.log('App opened from notification:', initialNotification);
      return initialNotification;
    }
    return null;
  },
};
