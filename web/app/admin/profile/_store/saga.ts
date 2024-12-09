import { put, call, takeEvery, select } from 'redux-saga/effects';
import { profileInit } from '@/app/admin/profile/_store/slice';
import axiosClient from '@/lib/utils/api-client';
import { showToast } from '@/redux/toast-slice';
import { meInit } from '@/app/admin/_store/slices/me-slice';

function* handleLogin(data: any): any {
  try {
    yield put(meInit(null));
    const response: any = yield call(axiosClient.post, 'v1/profile', data.payload);
    if (response.notify) {
      yield put(
        showToast({
          title: response.status === 'success' ? 'Success' : 'Error',
          description: response.message ?? 'Operation successfully completed.',
          status: response.status === 'success' ? 'default' : 'destructive',
        })
      );
    }
  } catch (err: any) {
    yield put(
      showToast({
        title: 'Error',
        description: err.message ?? err.error ?? 'An error occurred.',
        status: 'destructive',
      })
    );
  }
}

export function* profileSaga() {
  yield takeEvery(profileInit.type, handleLogin);
}
