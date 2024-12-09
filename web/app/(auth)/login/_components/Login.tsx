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

import { Loader2, Mail, KeyRound, ArrowRight } from 'lucide-react';
import { loginSchema } from '@/lib/schemas';
import { loginInit } from '@/app/(auth)/login/_store/slice';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const requestId = useAppSelector((state: any) => state.login.requestId);
  const isLoading = useAppSelector((state: any) => state.login.loading);
  const isSuccess = useAppSelector((state: any) => state.login.status === 'success');
  const stateErrors = useAppSelector((state: any) => state.login.errors);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginValues) => {
    dispatch(loginInit(data));
  };

  const getErrorMessage = (field: string) => {
    return stateErrors?.[field] || (errors as any)?.[field]?.message;
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      router.push('/admin/dashboard');
    }
  }, [isSuccess, reset, router]);

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-md">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl font-semibold text-center">Welcome Back!</CardTitle>
        <CardDescription className="text-center">
          Log in to your account and continue your journey.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Label htmlFor="identifier" className="text-sm font-medium">
                Email or Username
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('identifier')}
                  id="identifier"
                  type="text"
                  placeholder="Enter your email or username"
                  className={`pl-10 ${errors.identifier ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('identifier') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('identifier')}</p>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline hover:text-primary/90 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('password') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('password')}</p>
              )}
            </div>
          </div>
          <Button type="submit" className="w-full font-semibold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                Log in
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
          New here?{' '}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
          >
            Create an account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Login;
