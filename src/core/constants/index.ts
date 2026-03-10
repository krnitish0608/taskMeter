export const STORAGE_KEYS = {
  THEME: 'app_theme',
  AUTH_USER: 'auth_user',
  ONBOARDED: 'app_onboarded',
} as const;

export const SYNC_STATUS = {
  SYNCED: 'synced',
  PENDING_CREATE: 'pending_create',
  PENDING_UPDATE: 'pending_update',
  PENDING_DELETE: 'pending_delete',
} as const;

export type SyncStatus = (typeof SYNC_STATUS)[keyof typeof SYNC_STATUS];
