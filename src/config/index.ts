import Config from 'react-native-config';

export type Environment = 'development' | 'staging' | 'production';

export const appConfig = {
  env: (Config.APP_ENV || 'development') as Environment,
  apiBaseUrl: Config.API_BASE_URL || 'https://dev-api.taskmeter.app',
  firestoreCollectionPrefix: Config.FIRESTORE_COLLECTION_PREFIX || 'dev_',
  enableLogging: Config.ENABLE_LOGGING === 'true',
} as const;

export const getTasksCollection = () =>
  `${appConfig.firestoreCollectionPrefix}tasks`;