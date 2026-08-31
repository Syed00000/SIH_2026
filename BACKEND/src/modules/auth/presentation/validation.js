import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100),
    mobileNumber: z.string().trim().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit Indian mobile number'),
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters long'),
    role: z.enum(['CITIZEN', 'UNIVERSITY', 'INDUSTRY']).default('CITIZEN'),
    profile: z.object({}).passthrough().optional()
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Password and Confirm Password do not match',
    path: ['confirmPassword']
  })
};

export const verifyEmailSchema = {
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    otp: z.string().trim().length(6, 'OTP must be exactly 6 digits').optional(),
    code: z.string().trim().length(6, 'Verification code must be exactly 6 digits').optional()
  }).refine(data => data.otp || data.code, {
    message: 'Either otp or code is required for email verification'
  })
};

export const resendOtpSchema = {
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase()
  })
};

export const loginSchema = {
  body: z.object({
    email: z.string().trim().min(2, 'Email, University Code, or Mobile number is required'),
    password: z.string().min(1, 'Password is required')
  })
};

export const resetRequestSchema = {
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase()
  })
};

export const resetPasswordSchema = {
  body: z.object({
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    otp: z.string().trim().length(6, 'OTP code must be exactly 6 digits'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters long')
  })
};
