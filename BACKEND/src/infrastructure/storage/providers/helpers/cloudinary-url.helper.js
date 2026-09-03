import { v2 as cloudinary } from 'cloudinary';
import { StorageAccessError, sanitizeErrorMessage } from '../../errors/StorageErrors.js';
import logger from '../../../../shared/logger/index.js';

/**
 * Determines Cloudinary resource_type and application fileType from MIME and extension.
 */
export const resolveFileMetadata = (mimeType = '', originalFileName = '') => {
  const lowerMime = (mimeType || '').toLowerCase();
  const lowerName = (originalFileName || '').toLowerCase();

  if (lowerMime.startsWith('image/') || lowerName.match(/\.(jpg|jpeg|png|webp|gif|svg)$/)) {
    return { resourceType: 'image', fileType: 'image' };
  }

  if (lowerMime.startsWith('video/') || lowerName.match(/\.(mp4|webm|mov|m4v|ogg)$/)) {
    return { resourceType: 'video', fileType: 'video' };
  }

  if (lowerMime === 'application/pdf' || lowerName.endsWith('.pdf')) {
    return { resourceType: 'raw', fileType: 'pdf' };
  }

  return { resourceType: 'raw', fileType: 'document' };
};

/**
 * Generates a signed, time-limited URL for private asset access.
 */
export const generateSignedUrl = ({
  providerPublicId,
  resourceType = 'image',
  isPrivate = true,
  expiresInSeconds = 3600,
  format
}) => {
  try {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

    const urlOptions = {
      resource_type: resourceType,
      type: isPrivate ? 'authenticated' : 'upload',
      sign_url: true,
      expires_at: expiresAt,
      secure: true
    };

    if (format) {
      urlOptions.format = format;
    }

    return cloudinary.utils.url(providerPublicId, urlOptions);
  } catch (err) {
    logger.error({
      msg: 'Failed to generate signed URL',
      providerPublicId,
      error: sanitizeErrorMessage(err.message)
    });
    throw new StorageAccessError(sanitizeErrorMessage(err.message));
  }
};

export default {
  resolveFileMetadata,
  generateSignedUrl
};
