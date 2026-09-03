import { CloudinaryStorageProvider } from './providers/CloudinaryStorageProvider.js';
import { LocalStorageProvider } from './providers/LocalStorageProvider.js';
import config from '../../shared/config/index.js';
import logger from '../../shared/logger/index.js';

export { StorageProvider } from './interfaces/StorageProvider.js';
export { CloudinaryStorageProvider } from './providers/CloudinaryStorageProvider.js';
export { LocalStorageProvider } from './providers/LocalStorageProvider.js';
export * from './errors/StorageErrors.js';

let cachedProviderInstance = null;

/**
 * Storage Provider Factory.
 * Resolves the configured storage provider according to credentials and STORAGE_PROVIDER env variable.
 * If Cloudinary credentials are not configured, seamlessly falls back to LocalStorageProvider.
 *
 * @returns {import('./interfaces/StorageProvider.js').StorageProvider}
 */
export const getStorageProvider = () => {
  if (cachedProviderInstance) {
    return cachedProviderInstance;
  }

  const cloudName = config.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = config.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
  const apiSecret = config.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;
  const hasCloudinary = Boolean(cloudName && apiKey && apiSecret);

  const providerType = (config.STORAGE_PROVIDER || process.env.STORAGE_PROVIDER || (hasCloudinary ? 'cloudinary' : 'local')).toLowerCase();

  if (providerType === 'cloudinary' && hasCloudinary) {
    cachedProviderInstance = new CloudinaryStorageProvider();
  } else {
    logger.info({
      msg: 'Using LocalStorageProvider for evidence and media storage',
      hasCloudinary
    });
    cachedProviderInstance = new LocalStorageProvider();
  }

  return cachedProviderInstance;
};

export default getStorageProvider;

