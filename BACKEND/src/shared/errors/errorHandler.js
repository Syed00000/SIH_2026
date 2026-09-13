import logger from '../logger/index.js';
import config from '../config/index.js';
import { AppError } from './AppError.js';

export const errorHandler = (err, req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || req.id;

  if (err instanceof AppError && err.statusCode < 500) {
    logger.warn({
      msg: err.message,
      statusCode: err.statusCode,
      errorCode: err.errorCode,
      correlationId,
      path: req.path,
      method: req.method
    });
  } else {
    logger.error({
      msg: err.message,
      stack: err.stack,
      statusCode: err.statusCode || 500,
      errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
      correlationId,
      path: req.path,
      method: req.method
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        ...(err.details && { details: err.details })
      }
    });
  }

  // Handle Mongoose / MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = field === 'email' 
      ? 'EMAIL_ALREADY_EXISTS' 
      : field === 'mobileNumber' 
        ? 'MOBILE_ALREADY_EXISTS' 
        : 'Resource conflict';

    return res.status(409).json({
      success: false,
      error: {
        code: 'CONFLICT_ERROR',
        message
      }
    });
  }

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid JSON payload'
      }
    });
  }

  // Handle Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: `Invalid identifier format for ${err.path || 'resource'}: ${err.value}`
      }
    });
  }

  // Handle Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message
      }
    });
  }

  const isProduction = config.NODE_ENV === 'production';
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProduction 
        ? 'An unexpected error occurred. Please try again later.' 
        : err.message
    }
  });
};

export default errorHandler;
