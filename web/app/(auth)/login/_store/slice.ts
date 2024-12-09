import { apiSlice } from '@/redux/api-slice';

const {
  reducer: loginReducer,
  actions: { init: loginInit, success: loginSuccess, error: loginError, clear: loginClear },
} = apiSlice('login');

export { loginReducer, loginInit, loginSuccess, loginError, loginClear };
