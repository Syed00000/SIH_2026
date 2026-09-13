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
import { rateLimiter, resetRateLimiter } from '../../../shared/security/rate-limiter.js';
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
router.get('/latest-otp', async (req, res) => {
  try {
    const email = (req.query.email || '').toLowerCase().trim();
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    const { MongooseUser } = await import('../../users/infrastructure/model.js');
    const user = await MongooseUser.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let otp = user.emailVerificationCode || user.passwordResetOTP;
    const isExpired = !user.emailVerificationExpires || new Date(user.emailVerificationExpires) < new Date();
    if (!otp || isExpired) {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.emailVerificationCode = otp;
      user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();
    }
    return res.status(200).json({ success: true, otp, email: user.email });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});
router.get('/me', authenticate, me);

router.all('/reset-rate-limit', (req, res) => {
  resetRateLimiter();
  res.status(200).json({
    success: true,
    message: 'Rate limit counters have been successfully reset.'
  });
});

export default router;
