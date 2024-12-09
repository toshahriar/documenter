import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ApiSliceState {
  loading?: boolean;
  status?: null | 'success' | 'error';
  notify?: boolean;
  data?: any;
  meta?: any;
  error?: any;
  errors?: any;
  action?: any;
  requestId?: any;
}

export const apiSlice = (name: string) => {
  const initialState: ApiSliceState = {
    loading: false,
    status: null,
    notify: false,
    data: null,
    meta: null,
    error: null,
    errors: null,
    requestId: null,
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      init: (state, action: PayloadAction<any>) => {
        const payload: any = action.payload;
        state.loading = true;
        state.status = null;
        state.notify = payload?.notify ?? false;
        state.action = payload?.action ?? '';
      },
      success: (state, action: PayloadAction<any>) => {
        const payload: any = action.payload;
        state = { ...state, ...payload };
        state.loading = false;
        state.action = payload?.action ?? '';
        return state;
      },
      error: (state, action: PayloadAction<any>) => {
        const payload: any = action.payload;
        delete payload.data;
        state = { ...state, ...payload };
        state.loading = false;
        state.notify = true;
        state.action = payload?.action ?? '';
        return state;
      },
      clear: (state, action: PayloadAction<any>) => {
        const keysToClear: any[] = action?.payload ?? [];
        if (keysToClear.length === 0) {
          return initialState;
        }
        return {
          ...state,
          ...Object.keys(state).reduce((acc: any, key: any) => {
            if (keysToClear.includes(key)) {
              acc[key] = (initialState as any)[key];
            } else {
              acc[key] = (state as any)[key];
            }
            return acc;
          }, {}),
        };
      },
    },
  });

  return {
    actions: slice.actions,
    reducer: slice.reducer,
  };
};
