import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
  id: string | number | null;
  title: string;
  description: string;
  status: 'default' | 'destructive';
}

const initialState: ToastState = {
  id: null,
  title: '',
  description: '',
  status: 'default',
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<any>) => {
      state.id = +new Date();
      state.title = action.payload?.title;
      state.description = action.payload?.description;
      state.status = action.payload?.status ?? 'default';
    },
    hideToast: (state) => {
      return initialState;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;
