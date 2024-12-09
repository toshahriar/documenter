import persistStorage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import { rootReducer } from '@/redux/root-reducer';

export const createInMemoryStorage = () => ({
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

export const storage = typeof window !== 'undefined' ? persistStorage : createInMemoryStorage();

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['login', 'register', 'forgotPassword', 'resetPassword'],
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);
