import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().url().default(process.env.URL || 'mongodb://localhost:27017/sih_2026'),
  JWT_ACCESS_SECRET: z.string().min(32).default('a_very_long_secure_default_access_token_secret_32_chars_min'),
  JWT_REFRESH_SECRET: z.string().min(32).default('a_very_long_secure_default_refresh_token_secret_32_chars_min'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  CORS_ORIGINS: z.string().transform((val) => val.split(',')).default('*'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info')
});

const parseConfig = () => {
  const result = configSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGO_URI: process.env.URL || process.env.MONGO_URI,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY,
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    LOG_LEVEL: process.env.LOG_LEVEL
  });

  if (!result.success) {
    console.error('❌ Invalid environment configuration:');
    console.error(JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
  }

  return result.data;
};

export const config = parseConfig();
export default config;
