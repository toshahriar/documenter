import { apiSlice } from '@/redux/api-slice';

const {
  reducer: documentReducer,
  actions: {
    init: documentInit,
    success: documentSuccess,
    error: documentError,
    clear: documentClear,
  },
} = apiSlice('document');

export { documentReducer, documentInit, documentSuccess, documentError, documentClear };
