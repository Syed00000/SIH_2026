import logger from '../logger/index.js';
import config from '../config/index.js';
import { AppError } from './AppError.js';

export const errorHandler = (err, req, res, next) => {
  const correlationId = req.headers['x-correlation-id'] || req.id;

  logger.error({
    msg: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    errorCode: err.errorCode,
    correlationId,
    path: req.path,
    method: req.method
  });

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

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid JSON payload'
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
