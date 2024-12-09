import { apiSlice } from '@/redux/api-slice';

const {
  reducer: logoutReducer,
  actions: { init: logoutInit, success: logoutSuccess, error: logoutError, clear: logoutClear },
} = apiSlice('logout');

export { logoutReducer, logoutInit, logoutSuccess, logoutError, logoutClear };
