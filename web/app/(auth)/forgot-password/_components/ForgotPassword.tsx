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
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import { forgotPasswordSchema } from '@/lib/schemas';
import { forgotPasswordInit } from '@/app/(auth)/forgot-password/_store/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

type LoginValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const dispatch = useAppDispatch();

  const requestId = useAppSelector((state: any) => state.forgotPassword.requestId);
  const isLoading = useAppSelector((state: any) => state.forgotPassword.loading);
  const isSuccess = useAppSelector((state: any) => state.forgotPassword.status === 'success');
  const stateErrors = useAppSelector((state: any) => state.forgotPassword.errors);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: LoginValues) => {
    dispatch(forgotPasswordInit(data));
  };

  const getErrorMessage = (field: string) => {
    return stateErrors?.[field] || (errors as any)?.[field]?.message;
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [dispatch, requestId]);

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-md">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl font-semibold text-center">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Please enter your email address to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('email')}
                  id="email"
                  type="text"
                  placeholder="Enter your email address"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('email') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('email')}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              <>
                Send Reset Link
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

export default ForgotPassword;
