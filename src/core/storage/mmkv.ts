import { createMMKV, type MMKV } from 'react-native-mmkv';

export const storage: MMKV = createMMKV({ id: 'taskmeter-storage' });

/** Helpers for typed access */
export const mmkvStorage = {
  getString: (key: string): string | undefined => storage.getString(key),
  setString: (key: string, value: string) => storage.set(key, value),
  getBoolean: (key: string): boolean | undefined => storage.getBoolean(key),
  setBoolean: (key: string, value: boolean) => storage.set(key, value),
  getNumber: (key: string): number | undefined => storage.getNumber(key),
  setNumber: (key: string, value: number) => storage.set(key, value),
  delete: (key: string) => storage.remove(key),
  clearAll: () => storage.clearAll(),
};

/** Redux-persist compatible storage adapter */
export const mmkvReduxStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string) => {
    storage.remove(key);
    return Promise.resolve();
  },
};
