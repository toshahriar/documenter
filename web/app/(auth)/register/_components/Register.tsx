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

import { Loader2, Mail, User, KeyRound, ArrowRight } from 'lucide-react';
import { registerSchema } from '@/lib/schemas';
import { registerClear, registerInit } from '@/app/(auth)/register/_store/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const requestId = useAppSelector((state: any) => state.register.requestId);
  const isLoading = useAppSelector((state: any) => state.register.loading);
  const isSuccess = useAppSelector((state: any) => state.register.status === 'success');
  const stateErrors = useAppSelector((state: any) => state.register.errors);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    dispatch(registerInit({ ...data, notify: true }));
  };

  const getErrorMessage = (field: string) => {
    return stateErrors?.[field] || (errors as any)?.[field]?.message;
  };

  useEffect(() => {
    if (isSuccess) {
      reset();
      dispatch(registerClear([]));
      router.push('/login');
    }
  }, [isSuccess, dispatch, reset, router]);

  return (
    <Card className="w-full max-w-md mx-auto bg-card border-0 shadow-md">
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl font-semibold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            ={' '}
            <div className="relative">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('firstName')}
                  id="firstName"
                  placeholder="John"
                  className={`pl-10 ${
                    errors?.firstName || stateErrors?.firstName ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('firstName') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('firstName')}</p>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('lastName')}
                  id="lastName"
                  placeholder="Doe"
                  className={`pl-10 ${
                    errors?.lastName || stateErrors?.lastName ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('lastName') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('lastName')}</p>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('username')}
                  id="username"
                  placeholder="jondoe"
                  className={`pl-10 ${
                    errors?.username || stateErrors?.username ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('username') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('username')}</p>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className={`pl-10 ${errors?.email || stateErrors?.email ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('email') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('email')}</p>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('password')}
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${
                    errors?.password || stateErrors?.password ? 'border-red-500' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>
              {getErrorMessage('password') && (
                <p className="text-sm text-red-500 mt-1">{getErrorMessage('password')}</p>
              )}
            </div>
            <div className="relative">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 ${
                    errors?.confirmPassword || stateErrors?.confirmPassword ? 'border-red-500' : ''
                  }`}
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
                Creating Account...
              </>
            ) : (
              <>
                Create Account
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
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline hover:text-primary/90 transition-colors"
          >
            Sign in
          </Link>
        </div>
        <p className="text-xs text-muted-foreground px-6">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default Register;
