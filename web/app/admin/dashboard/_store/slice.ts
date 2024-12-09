import { apiSlice } from '@/redux/api-slice';

const {
  reducer: dashboardReducer,
  actions: {
    init: dashboardInit,
    success: dashboardSuccess,
    error: dashboardError,
    clear: dashboardClear,
  },
} = apiSlice('dashboard');

export { dashboardReducer, dashboardInit, dashboardSuccess, dashboardError, dashboardClear };
