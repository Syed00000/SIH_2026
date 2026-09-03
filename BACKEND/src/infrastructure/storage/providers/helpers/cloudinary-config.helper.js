import { v2 as cloudinary } from 'cloudinary';
import config from '../../../../shared/config/index.js';
import logger from '../../../../shared/logger/index.js';
import { sanitizeErrorMessage } from '../../errors/StorageErrors.js';

/**
 * Initializes and configures the Cloudinary v2 SDK from environment configuration.
 * Never exposes credentials or writes them to logs.
 */
export const initCloudinaryClient = () => {
  try {
    const cloudName = config.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = config.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY;
    const apiSecret = config.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      logger.warn({
        msg: 'Cloudinary configuration incomplete. File operations will fail until credentials are provided.',
        hasCloudName: Boolean(cloudName),
        hasApiKey: Boolean(apiKey),
        hasApiSecret: Boolean(apiSecret)
      });
      return false;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true
    });

    logger.info({
      msg: 'Cloudinary client initialized with secure transmission',
      cloudName
    });
    return true;
  } catch (err) {
    logger.error({
      msg: 'Failed to initialize Cloudinary client',
      error: sanitizeErrorMessage(err.message)
    });
    return false;
  }
};

export default initCloudinaryClient;
