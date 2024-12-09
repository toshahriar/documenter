import { apiSlice } from '@/redux/api-slice';

const {
  reducer: profileReducer,
  actions: { init: profileInit, success: profileSuccess, error: profileError, clear: profileClear },
} = apiSlice('profile');

export { profileReducer, profileInit, profileSuccess, profileError, profileClear };
