import { apiSlice } from '@/redux/api-slice';

const {
  reducer: meReducer,
  actions: { init: meInit, success: meSuccess, error: meError, clear: meClear },
} = apiSlice('me');

export { meReducer, meInit, meSuccess, meError, meClear };
