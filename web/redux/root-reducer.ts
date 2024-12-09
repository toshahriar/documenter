import { combineReducers } from '@reduxjs/toolkit';
import { loginReducer } from '@/app/(auth)/login/_store/slice';
import { registerReducer } from '@/app/(auth)/register/_store/slice';
import { toastReducer } from '@/redux/toast-slice';
import { forgotPasswordReducer } from '@/app/(auth)/forgot-password/_store/slice';
import { resetPasswordReducer } from '@/app/(auth)/reset-password/_store/slice';
import { logoutReducer } from '@/app/admin/_store/slices/logout-slice';
import { meReducer } from '@/app/admin/_store/slices/me-slice';
import { profileReducer } from '@/app/admin/profile/_store/slice';
import { documentReducer } from '@/app/admin/document/_store/slice';
import { dashboardReducer } from '@/app/admin/dashboard/_store/slice';

export const rootReducer = combineReducers({
  toast: toastReducer,
  login: loginReducer,
  register: registerReducer,
  forgotPassword: forgotPasswordReducer,
  resetPassword: resetPasswordReducer,
  me: meReducer,
  logout: logoutReducer,
  profile: profileReducer,
  document: documentReducer,
  dashboard: dashboardReducer,
});
