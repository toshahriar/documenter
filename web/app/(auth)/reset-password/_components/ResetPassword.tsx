'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Loader2, KeyRound, ArrowRight } from 'lucide-react';
import { resetPasswordSchema } from '@/lib/schemas';
import { resetPasswordInit } from '@/app/(auth)/reset-password/_store/slice';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  const requestId = useAppSelector((state: any) => state.resetPassword.requestId);
  const isLoading = useAppSelector((state: any) => state.resetPassword.loading);
  const isSuccess = useAppSelector((state: any) => state.resetPassword.status === 'success');
  const stateErrors = useAppSelector((state: any) => state.resetPassword.errors);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordValues) => {
    const payload = {
      ...data,
      token,
      userId,
    };
    dispatch(resetPasswordInit(payload));
  };

  const getErrorMessage = (field: string) => {
    return stateErrors?.[field] || (errors as any)?.[field]?.message;
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      router.push('/login');
    }
  }, [dispatch, requestId]);

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-md">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl font-semibold text-center">Reset Your Password</CardTitle>
        <CardDescription className="text-center">
          Please enter your new password to reset it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  New Password
                </Label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  placeholder="Enter your new password"
                  className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('password') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('password')}</p>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('confirmPassword') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('confirmPassword')}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting password...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 text-center">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>
        <div className="text-sm">
          Remember your password?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
          >
            Log in here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ResetPassword;
