import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  requestPasswordReset,
  registerSchema,
  loginSchema,
  resetRequestSchema
} from './controller.js';
import { validate } from '../../../shared/validation/validate.js';
import { rateLimiter } from '../../../shared/security/rate-limiter.js';

const router = Router();

const authLimiter = rateLimiter({
  windowMs: 60000,
  max: 5,
  keyPrefix: 'rl:auth'
});

const resetLimiter = rateLimiter({
  windowMs: 300000,
  max: 3,
  keyPrefix: 'rl:reset'
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', validate({}), refresh);
router.post('/logout', logout);
router.post('/forgot-password', resetLimiter, validate(resetRequestSchema), requestPasswordReset);

export default router;
