import { put, call, takeEvery } from 'redux-saga/effects';
import axiosClient from '@/lib/utils/api-client';
import { showToast } from '@/redux/toast-slice';
import { dashboardInit, dashboardSuccess } from '@/app/admin/dashboard/_store/slice';

function* handleDashboard(data: any): any {
  try {
    const response: any = yield call(axiosClient.get, 'v1/document/analytic', data.payload);
    yield put(dashboardSuccess(response));
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

export function* dashboardSaga() {
  yield takeEvery(dashboardInit.type, handleDashboard);
}
