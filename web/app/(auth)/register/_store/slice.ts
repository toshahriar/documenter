import { apiSlice } from '@/redux/api-slice';

const {
  reducer: registerReducer,
  actions: {
    init: registerInit,
    success: registerSuccess,
    error: registerError,
    clear: registerClear,
  },
} = apiSlice('register');

export { registerReducer, registerInit, registerSuccess, registerError, registerClear };
