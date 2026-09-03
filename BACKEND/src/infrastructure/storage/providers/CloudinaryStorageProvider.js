import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { StorageProvider } from '../interfaces/StorageProvider.js';
import {
  StorageUploadError,
  StorageDeleteError,
  StorageAccessError,
  sanitizeErrorMessage
} from '../errors/StorageErrors.js';
import { initCloudinaryClient } from './helpers/cloudinary-config.helper.js';
import { resolveFileMetadata, generateSignedUrl } from './helpers/cloudinary-url.helper.js';
import logger from '../../../shared/logger/index.js';

export class CloudinaryStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.name = 'cloudinary';
    this.configured = initCloudinaryClient();
  }

  ensureConfigured() {
    if (!this.configured) {
      this.configured = initCloudinaryClient();
      if (!this.configured) {
        throw new StorageUploadError('Cloudinary storage provider is not properly configured');
      }
    }
  }

  async upload({
    buffer,
    originalFileName,
    mimeType,
    folder = 'citizens/evidence',
    uniqueId,
    isPrivate = true
  }) {
    this.ensureConfigured();

    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new StorageUploadError('Invalid file data: expected in-memory Buffer');
    }

    const { resourceType, fileType } = resolveFileMetadata(mimeType, originalFileName);
    const baseId = uniqueId || `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const extension = fileType === 'pdf' && !baseId.endsWith('.pdf') ? '.pdf' : '';
    const publicId = `${baseId}${extension}`;

    const uploadOptions = {
      folder,
      public_id: publicId,
      resource_type: resourceType,
      type: isPrivate ? 'authenticated' : 'upload',
      overwrite: false,
      unique_filename: false
    };

    return new Promise((resolve, reject) => {
      try {
        const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
          if (error) {
            logger.error({ msg: 'Cloudinary upload error', folder, error: sanitizeErrorMessage(error.message) });
            return reject(new StorageUploadError(sanitizeErrorMessage(error.message)));
          }

          if (!result?.public_id) {
            return reject(new StorageUploadError('Cloudinary did not return valid file metadata'));
          }

          const accessUrl = generateSignedUrl({
            providerPublicId: result.public_id,
            resourceType,
            isPrivate,
            format: result.format
          });

          resolve({
            storageProvider: 'cloudinary',
            storageKey: result.public_id,
            providerPublicId: result.public_id,
            resourceType,
            originalFileName,
            mimeType,
            fileType,
            fileSize: result.bytes || buffer.length,
            accessUrl,
            createdAt: result.created_at ? new Date(result.created_at) : new Date()
          });
        });

        Readable.from(buffer).pipe(uploadStream);
      } catch (err) {
        reject(new StorageUploadError(sanitizeErrorMessage(err.message)));
      }
    });
  }

  async getAccessUrl({
    providerPublicId,
    resourceType = 'image',
    isPrivate = true,
    expiresInSeconds = 3600
  }) {
    if (!providerPublicId) throw new StorageAccessError('Provider public ID is required');
    return generateSignedUrl({ providerPublicId, resourceType, isPrivate, expiresInSeconds });
  }

  async delete({ providerPublicId, resourceType = 'image', isPrivate = true }) {
    this.ensureConfigured();
    if (!providerPublicId) throw new StorageDeleteError('Missing providerPublicId for deletion');

    try {
      const result = await cloudinary.uploader.destroy(providerPublicId, {
        resource_type: resourceType,
        type: isPrivate ? 'authenticated' : 'upload',
        invalidate: true
      });

      const isSuccess = result.result === 'ok' || result.result === 'not found';
      if (!isSuccess) {
        logger.warn({ msg: 'Cloudinary deletion returned non-ok result', providerPublicId, result: result.result });
      }
      return isSuccess;
    } catch (err) {
      logger.error({ msg: 'Cloudinary asset deletion failed', providerPublicId, error: sanitizeErrorMessage(err.message) });
      throw new StorageDeleteError(sanitizeErrorMessage(err.message));
    }
  }
}

export default CloudinaryStorageProvider;
