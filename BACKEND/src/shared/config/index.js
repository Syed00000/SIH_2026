import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().min(1).default(process.env.URL || 'mongodb://localhost:27017/sih_2026'),
  JWT_ACCESS_SECRET: z.string().min(32).default('a_very_long_secure_default_access_token_secret_32_chars_min'),
  JWT_REFRESH_SECRET: z.string().min(32).default('a_very_long_secure_default_refresh_token_secret_32_chars_min'),
  JWT_ACCESS_EXPIRY: z.string().default(process.env.NODE_ENV === 'production' ? '15m' : '7d'),
  JWT_REFRESH_EXPIRY: z.string().default('30d'),
  CORS_ORIGINS: z.string().transform((val) => val.split(',')).default('*'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  GOVT_ADMIN_NAME: z.string().default('Government Admin'),
  GOVT_ADMIN_EMAIL: z.string().email().optional(),
  GOVT_ADMIN_PASSWORD: z.string().min(6).optional(),
  GOVT_ADMIN_MOBILE: z.string().default('9876543210'),
  CLOUDINARY_CLOUD_NAME: z.string().optional().default(''),
  CLOUDINARY_API_KEY: z.string().optional().default(''),
  CLOUDINARY_API_SECRET: z.string().optional().default(''),
  CLOUDINARY_URL: z.string().optional().default(''),
  STORAGE_PROVIDER: z.enum(['cloudinary', 'local', 's3']).default('cloudinary'),
  DEFAULT_BLOCK_PASSWORD: z.string().default(process.env.DEFAULT_BLOCK_PASSWORD || ''),
  DEFAULT_WARD_PASSWORD: z.string().default(process.env.DEFAULT_WARD_PASSWORD || ''),
  DEFAULT_TECH_PASSWORD: z.string().default(process.env.DEFAULT_TECH_PASSWORD || ''),
  DEFAULT_NODAL_PASSWORD: z.string().default(process.env.DEFAULT_NODAL_PASSWORD || ''),
  DEFAULT_BUDGET_OFFICER_PASSWORD: z.string().default(process.env.DEFAULT_BUDGET_OFFICER_PASSWORD || ''),
  CARTO_API_KEY: z.string().optional().default(process.env.CARTO_API_KEY || 'cb1_3yhz_1_e7b1c7f6e22a991f83004a14'),
  MAPTILER_API_KEY: z.string().optional().default(process.env.MAPTILER_API_KEY || '')
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
    LOG_LEVEL: process.env.LOG_LEVEL,
    GOVT_ADMIN_NAME: process.env.GOVT_ADMIN_NAME,
    GOVT_ADMIN_EMAIL: process.env.GOVT_ADMIN_EMAIL,
    GOVT_ADMIN_PASSWORD: process.env.GOVT_ADMIN_PASSWORD,
    GOVT_ADMIN_MOBILE: process.env.GOVT_ADMIN_MOBILE,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
    DEFAULT_BLOCK_PASSWORD: process.env.DEFAULT_BLOCK_PASSWORD,
    DEFAULT_WARD_PASSWORD: process.env.DEFAULT_WARD_PASSWORD,
    DEFAULT_TECH_PASSWORD: process.env.DEFAULT_TECH_PASSWORD,
    DEFAULT_NODAL_PASSWORD: process.env.DEFAULT_NODAL_PASSWORD,
    DEFAULT_BUDGET_OFFICER_PASSWORD: process.env.DEFAULT_BUDGET_OFFICER_PASSWORD,
    CARTO_API_KEY: process.env.CARTO_API_KEY,
    MAPTILER_API_KEY: process.env.MAPTILER_API_KEY
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
