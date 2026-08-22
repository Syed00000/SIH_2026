import pino from 'pino';
import config from '../config/index.js';

const isProduction = config.NODE_ENV === 'production';

const logger = pino({
  level: config.LOG_LEVEL,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'body.password',
      'body.token',
      'body.refreshToken',
      'body.accessToken',
      'body.passwordResetToken',
      'body.emailVerificationToken',
      'password',
      'token',
      'refreshToken',
      'accessToken',
      'secret'
    ],
    censor: '[REDACTED]'
  },
  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined
});

export default logger;
export { logger };
