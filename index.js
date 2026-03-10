/**
 * @format
 */

import { AppRegistry } from 'react-native';

/**
 * CRITICAL: Initialize Firebase before rendering the app.
 * This ensures the google-services.json configuration is loaded
 * before any Firebase service (Auth, Firestore, etc.) is used.
 */
import './src/core/firebase/init';

import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
