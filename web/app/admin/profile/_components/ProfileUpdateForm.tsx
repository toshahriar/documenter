'use client';

import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { profileInit } from '@/app/admin/profile/_store/slice';
import {ArrowRight, Loader2} from "lucide-react";

const profileUpdateSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    username: z.string().min(1, { message: 'Username is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data?.password) {
        return data.password.length > 8;
      }
      return true;
    },
    {
      message: 'Password must be at least 8 characters long',
      path: ['password'],
    }
  )
  .refine(
    (data) => {
      if (data.password || data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

type ProfileFormValues = z.infer<typeof profileUpdateSchema>;

const FormInput = ({
  id,
  label,
  register,
  errors,
  type = 'text',
  placeholder,
}: {
  id: string;
  label: string;
  register: any;
  errors: any;
  type?: string;
  placeholder: string;
}) => (
  <div className="relative">
    <Label htmlFor={id} className="text-sm font-medium">
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      {...register(id)}
      placeholder={placeholder}
      className={`${errors?.[id] ? 'border-red-500' : ''}`}
    />
    {errors?.[id] && <p className="text-sm text-red-500 mt-1">{errors?.[id]?.message}</p>}
  </div>
);

export function ProfileUpdateForm() {
  const dispatch = useAppDispatch();

  const data = useAppSelector((state: any) => state?.me?.data ?? {});
  const isLoading = useAppSelector((state: any) => state?.me?.loading ?? false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        username: data.username || '',
        email: data.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [data, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    const payload = {
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      ...(data.password && { password: data.password }),
      ...(data.confirmPassword && { confirmPassword: data.confirmPassword }),
    };
    dispatch(profileInit(payload));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h2 className="text-lg font-semibold text-center">Update Profile</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-6">
            <FormInput
              id="firstName"
              label="First Name"
              register={register}
              errors={errors}
              placeholder="Enter your first name"
            />
            <FormInput
              id="lastName"
              label="Last Name"
              register={register}
              errors={errors}
              placeholder="Enter your last name"
            />
            <FormInput
              id="username"
              label="Username"
              register={register}
              errors={errors}
              placeholder="Enter your username"
            />
            <FormInput
              id="email"
              label="Email"
              register={register}
              errors={errors}
              type="email"
              placeholder="Enter your email"
            />
            <FormInput
              id="password"
              label="Password (Optional)"
              register={register}
              errors={errors}
              type="password"
              placeholder="Enter new password"
            />
            <FormInput
              id="confirmPassword"
              label="Confirm Password (Optional)"
              register={register}
              errors={errors}
              type="password"
              placeholder="Confirm new password"
            />

            <div className="relative flex justify-end mx-auto">
              <Button type="submit" className="w-[100px] bg-gradient-to-r from-yellow-400 to-yellow-300 text-black px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center gap-2" disabled={isLoading}>
                {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                ) : (
                    <>
                      Save
                    </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
