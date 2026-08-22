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
    email: z.string().trim().email('Invalid email address').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    firstName: z.string().trim().min(1, 'First name is required').max(50),
    lastName: z.string().trim().min(1, 'Last name is required').max(50)
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
    const { email, password, firstName, lastName } = req.body;
    const user = await authService.register({ email, password, firstName, lastName });
    res.status(201).json({
      success: true,
      data: user
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
      data: {
        user: result.user,
        accessToken: result.accessToken
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
