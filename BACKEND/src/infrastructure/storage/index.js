import { CloudinaryStorageProvider } from './providers/CloudinaryStorageProvider.js';
import config from '../../shared/config/index.js';
import logger from '../../shared/logger/index.js';

export { StorageProvider } from './interfaces/StorageProvider.js';
export { CloudinaryStorageProvider } from './providers/CloudinaryStorageProvider.js';
export * from './errors/StorageErrors.js';

let cachedProviderInstance = null;

/**
 * Storage Provider Factory.
 * Resolves the configured storage provider according to the STORAGE_PROVIDER environment variable.
 * Easily swappable for AWS S3, Cloudflare R2, or Supabase Storage without changing business logic.
 *
 * @returns {import('./interfaces/StorageProvider.js').StorageProvider}
 */
export const getStorageProvider = () => {
  if (cachedProviderInstance) {
    return cachedProviderInstance;
  }

  const providerType = (config.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER || 'cloudinary').toLowerCase();

  switch (providerType) {
    case 'cloudinary':
      cachedProviderInstance = new CloudinaryStorageProvider();
      break;
    default:
      logger.warn({
        msg: `Storage provider "${providerType}" not implemented yet, defaulting to Cloudinary`,
        provider: providerType
      });
      cachedProviderInstance = new CloudinaryStorageProvider();
      break;
  }

  return cachedProviderInstance;
};

export default getStorageProvider;
