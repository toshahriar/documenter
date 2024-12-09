import { put, call, takeEvery, select } from 'redux-saga/effects';
import { logoutError, logoutInit, logoutSuccess } from '@/app/admin/_store/slices/logout-slice';
import axiosClient from '@/lib/utils/api-client';
import { showToast } from '@/redux/toast-slice';

function* handleLogin(data: any): any {
  try {
    const response: any = yield call(axiosClient.post, 'v1/auth/logout', data.payload);
    yield put(logoutSuccess(response));
    const notify = yield select((state: any) => state.logout.notify);
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
    yield put(logoutError(err));
    yield put(
      showToast({
        title: 'Error',
        description: err.message ?? err.error ?? 'An error occurred.',
        status: 'destructive',
      })
    );
  }
}

export function* logoutSaga() {
  yield takeEvery(logoutInit.type, handleLogin);
}
