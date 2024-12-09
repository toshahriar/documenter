'use client';

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { hideToast } from '@/redux/toast-slice';

export const ToastProvider = () => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const toastState = useAppSelector((state: any) => state.toast);

  useEffect(() => {
    if (toastState.id) {
      toast({
        title: toastState.title,
        description: toastState.description,
        variant: toastState.status,
      });

      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [toastState.id, toast, dispatch]);

  return null;
};
