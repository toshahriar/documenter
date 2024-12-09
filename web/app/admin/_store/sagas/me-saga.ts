import { put, call, takeEvery, select } from 'redux-saga/effects';
import { meError, meInit, meSuccess } from '@/app/admin/_store/slices/me-slice';
import axiosClient from '@/lib/utils/api-client';
import { showToast } from '@/redux/toast-slice';

function* handleLogin(data: any): any {
  try {
    const response: any = yield call(axiosClient.post, 'v1/auth/me', data.payload);
    yield put(meSuccess(response));
    const notify = yield select((state: any) => state.me.notify);
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
    yield put(meError(err));
    yield put(
      showToast({
        title: 'Error',
        description: err.message ?? err.error ?? 'An error occurred.',
        status: 'destructive',
      })
    );
  }
}

export function* meSaga() {
  yield takeEvery(meInit.type, handleLogin);
}
