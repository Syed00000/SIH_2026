import { RateLimitError } from '../errors/AppError.js';
import logger from '../logger/index.js';
import config from '../config/index.js';

const store = new Map();

/**
 * Resets the in-memory rate limiting store (clears all blocked IPs/keys).
 */
export const resetRateLimiter = () => {
  store.clear();
  logger.info('Rate limiter store has been cleared/reset.');
};

// Periodic cleanup of stale rate limiter records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    if (now > record.resetTime) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000).unref();

export const rateLimiter = ({
  windowMs = 60000,
  max = 60,
  keyPrefix = 'rl'
}) => {
  // In development, provide very high limits to avoid blocking developer workflows and hot-reloading
  const effectiveMax = config.NODE_ENV === 'production' ? max : Math.max(max * 100, 10000);

  return (req, res, next) => {
    const rawIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    const ip = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : 'unknown';
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();

    const record = store.get(key);

    if (!record) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', effectiveMax);
      res.setHeader('X-RateLimit-Remaining', effectiveMax - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));
      return next();
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
      res.setHeader('X-RateLimit-Limit', effectiveMax);
      res.setHeader('X-RateLimit-Remaining', effectiveMax - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));
      return next();
    }

    record.count += 1;
    const remaining = Math.max(0, effectiveMax - record.count);
    res.setHeader('X-RateLimit-Limit', effectiveMax);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > effectiveMax) {
      logger.warn(`Rate limit exceeded for client: ${ip} on path: ${req.path} (${record.count}/${effectiveMax})`);
      const retrySeconds = Math.ceil((record.resetTime - now) / 1000);
      return next(new RateLimitError(`Too many requests. Please try again in ${retrySeconds} seconds.`));
    }

    next();
  };
};

export default rateLimiter;
