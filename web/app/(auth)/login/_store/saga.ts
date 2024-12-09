import { put, call, takeEvery, select } from 'redux-saga/effects';
import { loginError, loginInit, loginSuccess } from '@/app/(auth)/login/_store/slice';
import axiosClient from '@/lib/utils/api-client';
import { showToast } from '@/redux/toast-slice';

function* handleLogin(data: any): any {
  try {
    const response: any = yield call(axiosClient.post, 'v1/auth/token', data.payload);
    yield put(loginSuccess(response));
    const notify: boolean = yield select((state: any) => state.login.notify);
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
    yield put(loginError(err));
    yield put(
      showToast({
        title: 'Error',
        description: err.message ?? err.error ?? 'An error occurred.',
        status: 'destructive',
      })
    );
  }
}

export function* loginSaga() {
  yield takeEvery(loginInit.type, handleLogin);
}
