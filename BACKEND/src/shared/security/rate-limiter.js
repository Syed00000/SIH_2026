import { RateLimitError } from '../errors/AppError.js';
import logger from '../logger/index.js';

const store = new Map();

export const rateLimiter = ({
  windowMs = 60000,
  max = 60,
  keyPrefix = 'rl'
}) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    const record = store.get(key);

    if (!record) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
      return next();
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      return next();
    }

    record.count += 1;
    const remaining = Math.max(0, max - record.count);
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      logger.warn(`Rate limit exceeded for client: ${ip} on path: ${req.path}`);
      const retrySeconds = Math.ceil((record.resetTime - now) / 1000);
      return next(new RateLimitError(`Too many requests. Please try again in ${retrySeconds} seconds.`));
    }

    next();
  };
};

export default rateLimiter;
