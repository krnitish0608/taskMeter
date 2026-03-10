import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { mmkvReduxStorage } from '@core/storage/mmkv';
import authReducer from '@modules/auth/slices/authSlice';
import taskReducer from '@modules/tasks/slices/taskSlice';

const persistConfig = {
  key: 'root',
  storage: mmkvReduxStorage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
