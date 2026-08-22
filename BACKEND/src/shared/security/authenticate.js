import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { AuthenticationError, AuthorizationError } from '../errors/AppError.js';
import logger from '../logger/index.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AuthenticationError('Authentication token missing or invalid'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
    req.user = {
      id: decoded.sub,
      role: decoded.role
    };
    next();
  } catch (error) {
    logger.warn({ msg: 'JWT Access Verification failed', error: error.message });
    return next(new AuthenticationError('Invalid or expired authentication token'));
  }
};

export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError('User not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AuthorizationError('Access forbidden: insufficient permissions'));
    }

    next();
  };
};

export default authenticate;
