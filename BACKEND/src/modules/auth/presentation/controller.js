import { z } from 'zod';
import MongoUserRepository from '../../users/infrastructure/repository.js';
import UserService from '../../users/application/service.js';
import MongoTokenRepository from '../infrastructure/repository.js';
import AuthService from '../application/service.js';
import { queue } from '../../../infrastructure/queue/queue.js';
import config from '../../../shared/config/index.js';

const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);
const tokenRepository = new MongoTokenRepository();
const authService = new AuthService(userService, tokenRepository, queue);

// Validation Schemas
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
    email: z.string().trim().email('Invalid email address').toLowerCase(),
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

const setRefreshTokenCookie = (res, token) => {
  const isProduction = config.NODE_ENV === 'production';
  const days = parseInt(config.JWT_REFRESH_EXPIRY) || 7;
  
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: days * 24 * 60 * 60 * 1000
  });
};

export const register = async (req, res, next) => {
  try {
    const { fullName, mobileNumber, email, password, confirmPassword, role, profile } = req.body;
    const result = await authService.register({ fullName, mobileNumber, email, password, confirmPassword, role, profile });
    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        userId: result.userId,
        email: result.email,
        role: result.role,
        emailVerificationRequired: result.emailVerificationRequired
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp, code } = req.body;
    const result = await authService.verifyEmail({ email, otp, code });
    res.json({
      success: true,
      message: result.message,
      data: {
        emailVerified: result.emailVerified,
        accountStatus: result.accountStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationOtp({ email });
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    
    setRefreshTokenCookie(res, result.refreshToken);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        accessToken: result.accessToken,
        user: {
          id: result.user.id,
          fullName: result.user.fullName,
          email: result.user.email,
          mobileNumber: result.user.mobileNumber,
          role: result.user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    const result = await authService.refresh(token);
    
    setRefreshTokenCookie(res, result.refreshToken);

    res.json({
      success: true,
      data: {
        accessToken: result.accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (token) {
      await authService.logout(token);
    }
    
    res.clearCookie('refreshToken');
    res.json({
      success: true,
      data: { message: 'Logged out successfully' }
    });
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const result = await authService.resetPassword({ email, otp, newPassword });
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?.sub;
    const user = await userService.getUserById(userId);
    res.json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        profile: user.profile,
        emailVerified: user.isEmailVerified,
        accountStatus: user.accountStatus
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  verifyEmail,
  resendVerificationOtp,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  me
};
