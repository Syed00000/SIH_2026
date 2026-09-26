import pino from 'pino';
import config from '../config/index.js';

const isProduction =
  config.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);

// Pino-pretty transport fails in serverless/worker-thread restricted environments like Vercel Lambda
const usePrettyTransport = !isProduction && !process.env.VERCEL;

const logger = pino({
  level: config.LOG_LEVEL || 'info',
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
  transport: usePrettyTransport
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
