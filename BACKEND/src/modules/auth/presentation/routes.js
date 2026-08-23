import { Router } from 'express';
import {
  register,
  verifyEmail,
  resendVerificationOtp,
  login,
  refresh,
  logout,
  requestPasswordReset,
  resetPassword,
  me,
  registerSchema,
  verifyEmailSchema,
  resendOtpSchema,
  loginSchema,
  resetRequestSchema,
  resetPasswordSchema
} from './controller.js';
import { validate } from '../../../shared/validation/validate.js';
import { rateLimiter } from '../../../shared/security/rate-limiter.js';
import authenticate from '../../../shared/security/authenticate.js';

const router = Router();

const authLimiter = rateLimiter({
  windowMs: 60000,
  max: 20,
  keyPrefix: 'rl:auth'
});

const resetLimiter = rateLimiter({
  windowMs: 300000,
  max: 10,
  keyPrefix: 'rl:reset'
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), verifyEmail);
router.post('/resend-verification-otp', resetLimiter, validate(resendOtpSchema), resendVerificationOtp);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', validate({}), refresh);
router.post('/logout', logout);
router.post('/forgot-password', resetLimiter, validate(resetRequestSchema), requestPasswordReset);
router.post('/reset-password', resetLimiter, validate(resetPasswordSchema), resetPassword);
router.get('/me', authenticate, me);

export default router;
