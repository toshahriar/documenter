import { all } from 'redux-saga/effects';
import { loginSaga } from '@/app/(auth)/login/_store/saga';
import { registerSaga } from '@/app/(auth)/register/_store/saga';
import { forgotPasswordSaga } from '@/app/(auth)/forgot-password/_store/saga';
import { resetPasswordSaga } from '@/app/(auth)/reset-password/_store/saga';
import { meSaga } from '@/app/admin/_store/sagas/me-saga';
import { logoutSaga } from '@/app/admin/_store/sagas/logout-saga';
import { profileSaga } from '@/app/admin/profile/_store/saga';
import { documentSaga } from '@/app/admin/document/_store/saga';
import { dashboardSaga } from '@/app/admin/dashboard/_store/saga';

export function* rootSaga() {
  yield all([
    loginSaga(),
    registerSaga(),
    forgotPasswordSaga(),
    resetPasswordSaga(),
    meSaga(),
    logoutSaga(),
    profileSaga(),
    documentSaga(),
    dashboardSaga(),
  ]);
}
