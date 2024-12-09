import { apiSlice } from '@/redux/api-slice';

const {
  reducer: resetPasswordReducer,
  actions: {
    init: resetPasswordInit,
    success: resetPasswordSuccess,
    error: resetPasswordError,
    clear: resetPasswordClear,
  },
} = apiSlice('resetPassword');

export {
  resetPasswordReducer,
  resetPasswordInit,
  resetPasswordSuccess,
  resetPasswordError,
  resetPasswordClear,
};
