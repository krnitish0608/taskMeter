/**
 * Firebase Initialization Module
 * Initializes React Native Firebase with default app configuration.
 * This must be imported before any Firebase services are used.
 */


import auth from '@react-native-firebase/auth';

/**
 * Initialize Firebase
 * The google-services.json file (Android) and GoogleService-Info.plist (iOS)
 * are automatically picked up by React Native Firebase during native initialization.
 */
export const initializeFirebase = () => {
  try {
    // React Native Firebase v6+ auto-initializes the default app
    // but we explicitly ensure auth is initialized
    const authInstance = auth();
    console.log('✓ Firebase initialized successfully');
    return authInstance;
  } catch (error) {
    console.error('✗ Firebase initialization failed:', error);
    throw error;
  }
};

export default initializeFirebase;
