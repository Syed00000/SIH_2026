import { AppError } from '../../../shared/errors/AppError.js';
import config from '../../../shared/config/index.js';

/**
 * Strips any sensitive credentials, secrets, or API keys from error messages
 * before logging or exposing in application errors.
 */
export const sanitizeErrorMessage = (message = '') => {
  if (typeof message !== 'string') return 'An error occurred during storage operation';

  let sanitized = message;
  const secrets = [
    config.CLOUDINARY_API_SECRET,
    config.CLOUDINARY_API_KEY,
    config.CLOUDINARY_URL
  ].filter(Boolean);

  for (const secret of secrets) {
    if (secret && secret.length > 4) {
      sanitized = sanitized.replaceAll(secret, '[REDACTED_CREDENTIAL]');
    }
  }

  // Also strip any standard credential URI patterns (e.g. cloudinary://key:secret@cloud)
  sanitized = sanitized.replace(/cloudinary:\/\/[^@]+@/gi, 'cloudinary://[REDACTED]@');

  return sanitized;
};

export class StorageError extends AppError {
  constructor(message = 'Storage operation failed', statusCode = 500, errorCode = 'STORAGE_ERROR', details = null) {
    super(sanitizeErrorMessage(message), statusCode, errorCode, details);
    this.name = 'StorageError';
  }
}

export class StorageUploadError extends StorageError {
  constructor(message = 'Failed to upload file to storage provider', details = null) {
    super(message, 502, 'STORAGE_UPLOAD_ERROR', details);
    this.name = 'StorageUploadError';
  }
}

export class StorageDeleteError extends StorageError {
  constructor(message = 'Failed to delete file from storage provider', details = null) {
    super(message, 502, 'STORAGE_DELETE_ERROR', details);
    this.name = 'StorageDeleteError';
  }
}

export class StorageAccessError extends StorageError {
  constructor(message = 'Failed to generate secure access URL for file', details = null) {
    super(message, 500, 'STORAGE_ACCESS_ERROR', details);
    this.name = 'StorageAccessError';
  }
}

export default {
  StorageError,
  StorageUploadError,
  StorageDeleteError,
  StorageAccessError,
  sanitizeErrorMessage
};
