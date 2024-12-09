import { put, call, takeEvery, select } from 'redux-saga/effects';
import {
  registerClear,
  registerError,
  registerInit,
  registerSuccess,
} from '@/app/(auth)/register/_store/slice';
import axiosClient from '@/lib/utils/api-client';
import { showToast } from '@/redux/toast-slice';

function* handleRegister(data: any): any {
  try {
    const response: any = yield call(axiosClient.post, 'v1/auth/register', data.payload);
    yield put(registerSuccess(response));
    const notify = yield select((state: any) => state.register.notify);
    if (notify) {
      yield put(
        showToast({
          title: 'Success',
          description: response.message ?? 'Operation successfully completed!',
        })
      );
    }
  } catch (err: any) {
    yield put(registerError(err));
    yield put(
      showToast({
        title: 'Error occurred',
        description: err.message ?? err?.response?.data?.message ?? 'An unexpected error occurred',
        status: 'destructive',
      })
    );
  }
}

export function* registerSaga() {
  yield takeEvery(registerInit.type, handleRegister);
}
