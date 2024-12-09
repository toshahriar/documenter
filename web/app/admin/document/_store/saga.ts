import { put, call, takeEvery, select } from 'redux-saga/effects';
import { documentError, documentInit, documentSuccess } from '@/app/admin/document/_store/slice';
import axiosClient from '@/lib/utils/api-client';
import { showToast } from '@/redux/toast-slice';

function* handleInit({ payload }: any): any {
  const handlers: any = {
    get: handleGetDocument,
    save: handleSaveDocument,
    update: handleUpdateDocument,
    delete: handleDeleteDocument,
    send: handleSendDocument,
  };

  const handler = handlers[payload?.type];
  if (handler) {
    yield call(handler, { payload: payload.payload });
  } else {
    yield put(
      showToast({
        title: 'Error',
        description: `Unknown document operation: ${payload?.type}`,
        status: 'destructive',
      })
    );
  }
}

function* handleGetDocument(action: any): any {
  try {
    const { search, status } = action.payload;
    let queryParams = '';

    if (search) {
      queryParams += `?search=${encodeURIComponent(search)}`;
    }

    if (status) {
      queryParams += queryParams
        ? `&status=${encodeURIComponent(status)}`
        : `?status=${encodeURIComponent(status)}`;
    }

    const response: any = yield call(axiosClient.get, `v1/document${queryParams}`);

    yield put(documentSuccess(response));
    const notify = yield select((state: any) => state.document.notify);
    if (notify) {
      yield put(
        showToast({
          title: 'Success',
          description: response.message ?? 'Document fetched successfully!',
        })
      );
    }
  } catch (err: any) {
    yield put(documentError(err));
    yield put(
      showToast({
        title: 'Error occurred',
        description: err.message ?? err.error ?? 'An error occurred while fetching the document',
        status: 'destructive',
      })
    );
  }
}

function* handleSaveDocument(action: any): any {
  try {
    const { data, ...response }: any = yield call(axiosClient.post, 'v1/document', action.payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    yield put(documentSuccess({ ...response, action: 'save' }));
    const notify = yield select((state: any) => state.document.notify);

    if (notify) {
      yield put(
        showToast({
          title: 'Success',
          description: response.message ?? 'Document saved successfully!',
        })
      );
    }
  } catch (err: any) {
    yield put(documentError(err));
    yield put(
      showToast({
        title: 'Error occurred',
        description: err.message ?? err.error ?? 'An error occurred while saving the document',
        status: 'destructive',
      })
    );
  }
}

function* handleUpdateDocument(action: any): any {
  try {
    const { data, ...response }: any = yield call(
      axiosClient.put,
      `v1/document/${action.payload.id}`,
      action.payload.formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    yield put(documentSuccess({ ...response, action: 'update' }));
    const notify = yield select((state: any) => state.document.notify);
    if (notify) {
      yield put(
        showToast({
          title: 'Success',
          description: response.message ?? 'Document updated successfully!',
        })
      );
    }
  } catch (err: any) {
    yield put(documentError({ err }));
    yield put(
      showToast({
        title: 'Error occurred',
        description: err.message ?? err.error ?? 'An error occurred while updating the document',
        status: 'destructive',
      })
    );
  }
}

function* handleDeleteDocument(action: any): any {
  try {
    const { data, ...response }: any = yield call(
      axiosClient.delete,
      `v1/document/${action.payload.id}`
    );
    yield put(documentSuccess({ ...response, action: 'delete' }));
    const notify = yield select((state: any) => state.document.notify);
    if (notify) {
      yield put(
        showToast({
          title: 'Success',
          description: response.message ?? 'Document deleted successfully!',
        })
      );
    }
  } catch (err: any) {
    yield put(documentError(err));
    yield put(
      showToast({
        title: 'Error occurred',
        description: err.message ?? err.error ?? 'An error occurred while deleting the document',
        status: 'destructive',
      })
    );
  }
}

function* handleSendDocument(action: any): any {
  try {
    const { data, ...response }: any = yield call(
      axiosClient.get,
      `v1/document/${action.payload.id}/send`
    );
    yield put(documentSuccess({ ...response, action: 'delete' }));
    const notify = yield select((state: any) => state.document.notify);
    if (notify) {
      yield put(
        showToast({
          title: 'Success',
          description: response.message ?? 'Document deleted successfully!',
        })
      );
    }
  } catch (err: any) {
    yield put(documentError(err));
    yield put(
      showToast({
        title: 'Error occurred',
        description: err.message ?? err.error ?? 'An error occurred while deleting the document',
        status: 'destructive',
      })
    );
  }
}

export function* documentSaga() {
  yield takeEvery(documentInit.type, handleInit);
}
