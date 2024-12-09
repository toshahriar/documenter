import { apiSlice } from '@/redux/api-slice';

const {
  reducer: forgotPasswordReducer,
  actions: {
    init: forgotPasswordInit,
    success: forgotPasswordSuccess,
    error: forgotPasswordError,
    clear: forgotPasswordClear,
  },
} = apiSlice('forgotPassword');

export {
  forgotPasswordReducer,
  forgotPasswordInit,
  forgotPasswordSuccess,
  forgotPasswordError,
  forgotPasswordClear,
};
