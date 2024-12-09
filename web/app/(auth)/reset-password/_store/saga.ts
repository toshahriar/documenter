import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
  resetPasswordError,
  resetPasswordInit,
  resetPasswordSuccess,
} from '@/app/(auth)/reset-password/_store/slice';
import axiosClient from '@/lib/utils/api-client';
import { showToast } from '@/redux/toast-slice';

function* handleLogin(data: any): any {
  try {
    const response: any = yield call(axiosClient.post, 'v1/auth/reset-password', data.payload);
    yield put(resetPasswordSuccess(response));
    const notify = yield select((state: any) => state.resetPassword.notify);
    if (notify) {
      yield put(
        showToast({
          title: response.status === 'success' ? 'Success' : 'Error',
          description: response.message ?? 'Operation successfully completed.',
          status: response.status === 'success' ? 'default' : 'destructive',
        })
      );
    }
  } catch (err: any) {
    yield put(resetPasswordError(err));
    yield put(
      showToast({
        title: 'Error',
        description: err.message ?? err.error ?? 'An error occurred.',
        status: 'destructive',
      })
    );
  }
}

export function* resetPasswordSaga() {
  yield takeEvery(resetPasswordInit.type, handleLogin);
}
