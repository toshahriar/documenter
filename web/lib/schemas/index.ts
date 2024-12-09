import * as z from 'zod';

const passwordValidation = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' });
/*.refine((val) => /[a-z]/.test(val), {
  message: 'Password must contain at least one lowercase letter',
})
.refine((val) => /[A-Z]/.test(val), {
  message: 'Password must contain at least one uppercase letter',
})
.refine((val) => /[0-9]/.test(val), {
  message: 'Password must contain at least one number',
})
.refine((val) => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
  message: 'Password must contain at least one special character',
})*/

export const loginSchema = z.object({
  identifier: z.string().min(1, { message: 'Email/Username is required' }),
  password: passwordValidation,
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'First Name is required' })
      .min(3, { message: 'First Name must be at least 2 characters' })
      .max(50, { message: 'First Name must not exceed 50 characters' }),
    lastName: z
      .string()
      .min(1, { message: 'Last Name is required' })
      .min(2, { message: 'Last Name must be at least 2 characters' })
      .max(50, { message: 'Last Name must not exceed 50 characters' }),
    username: z
      .string()
      .min(1, { message: 'Username is required' })
      .min(2, { message: 'Username must be at least 2 characters' })
      .max(50, { message: 'Username must not exceed 50 characters' }),
    email: z
      .string()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: passwordValidation,
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

export const resetPasswordSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(30, { message: 'First name must not be longer than 30 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(30, { message: 'Last name must not be longer than 30 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  bio: z.string().max(500, { message: 'Bio must not be longer than 500 characters' }).optional(),
  company: z
    .string()
    .max(100, { message: 'Company name must not be longer than 100 characters' })
    .optional(),
  role: z.string().max(100, { message: 'Role must not be longer than 100 characters' }).optional(),
});
