import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
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

    // Graceful fallback to local disk storage if Cloudinary is not configured
    if (!this.configured) {
      try {
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const safeFilename = `${Date.now()}-${(originalFileName || 'file').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = path.join(uploadsDir, safeFilename);
        fs.writeFileSync(filePath, buffer);

        const accessUrl = `/uploads/${safeFilename}`;
        logger.info({ msg: 'Uploaded media locally (Cloudinary unconfigured)', filePath, accessUrl });

        return {
          storageProvider: 'local',
          storageKey: `uploads/${safeFilename}`,
          providerPublicId: safeFilename,
          resourceType,
          originalFileName,
          mimeType,
          fileType,
          fileSize: buffer.length,
          accessUrl,
          createdAt: new Date()
        };
      } catch (localErr) {
        logger.error({ msg: 'Local storage fallback failed', error: localErr.message });
        throw new StorageUploadError(`Failed to save file: ${localErr.message}`);
      }
    }

    const uploadOptions = {
      folder,
      public_id: publicId,
      resource_type: resourceType,
      type: 'upload',
      overwrite: true,
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

          const accessUrl = result.secure_url || result.url || generateSignedUrl({
            providerPublicId: result.public_id,
            resourceType,
            isPrivate: false,
            format: result.format
          });

          logger.info({ msg: 'Cloudinary upload success', publicId: result.public_id, accessUrl });

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
    isPrivate = false,
    expiresInSeconds = 3600
  }) {
    if (!providerPublicId) throw new StorageAccessError('Provider public ID is required');
    if (!this.configured || providerPublicId.startsWith('file_') || providerPublicId.includes('-')) {
      return `/uploads/${providerPublicId}`;
    }
    return cloudinary.url(providerPublicId, { secure: true, resource_type: resourceType }) || generateSignedUrl({ providerPublicId, resourceType, isPrivate: false, expiresInSeconds });
  }

  async delete({ providerPublicId, resourceType = 'image', isPrivate = false }) {
    this.ensureConfigured();
    if (!providerPublicId) throw new StorageDeleteError('Missing providerPublicId for deletion');

    // Local disk storage fallback
    if (!this.configured || providerPublicId.startsWith('file_') || providerPublicId.startsWith('/uploads/')) {
      try {
        const cleanFile = providerPublicId.replace(/^\/uploads\//, '');
        const filePath = path.join(process.cwd(), 'public/uploads', cleanFile);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return true;
      } catch {
        return false;
      }
    }

    // Extract publicId if a full URL was supplied
    let cleanId = providerPublicId;
    if (cleanId.includes('cloudinary.com') || cleanId.includes('%2F') || cleanId.includes('%3A')) {
      try {
        cleanId = decodeURIComponent(cleanId);
      } catch (_) {}
    }
    if (cleanId.includes('cloudinary.com')) {
      const match = cleanId.match(/\/(?:upload|authenticated)(?:\/s--[^/]+--)?\/(?:v\d+\/)?([^?&#]+)/);
      if (match) cleanId = decodeURIComponent(match[1]);
    }
    // Clean any remaining query strings, params, or fragments
    cleanId = cleanId.split('?')[0].split('&')[0].split('#')[0].trim();

    const isPdfOrRaw = cleanId.toLowerCase().endsWith('.pdf') || resourceType === 'raw';
    const isVideo = cleanId.toLowerCase().match(/\.(mp4|webm|mov|m4v|ogg)$/) || resourceType === 'video';
    const targetResourceType = isPdfOrRaw ? 'raw' : isVideo ? 'video' : 'image';

    const rawIdWithoutExt = cleanId.replace(/\.pdf$/i, '');
    const rawIdWithExt = cleanId.toLowerCase().endsWith('.pdf') ? cleanId : `${cleanId}.pdf`;
    const imagePublicId = cleanId.replace(/\.(png|jpg|jpeg|webp|gif|svg)$/i, '');

    const candidates = [
      { id: cleanId, type: isPrivate ? 'authenticated' : 'upload', resType: targetResourceType },
      { id: cleanId, type: isPrivate ? 'upload' : 'authenticated', resType: targetResourceType },
      ...(isPdfOrRaw ? [
        { id: rawIdWithExt, type: 'upload', resType: 'raw' },
        { id: rawIdWithExt, type: 'authenticated', resType: 'raw' },
        { id: rawIdWithoutExt, type: 'upload', resType: 'raw' },
        { id: rawIdWithoutExt, type: 'authenticated', resType: 'raw' },
        { id: rawIdWithoutExt, type: 'upload', resType: 'image' },
        { id: rawIdWithoutExt, type: 'authenticated', resType: 'image' },
        { id: cleanId, type: 'upload', resType: 'image' }
      ] : []),
      { id: imagePublicId, type: isPrivate ? 'authenticated' : 'upload', resType: 'image' },
      { id: imagePublicId, type: isPrivate ? 'upload' : 'authenticated', resType: 'image' }
    ];

    let deleted = false;
    for (const cand of candidates) {
      try {
        const result = await cloudinary.uploader.destroy(cand.id, {
          resource_type: cand.resType,
          type: cand.type,
          invalidate: true
        });
        if (result?.result === 'ok') {
          deleted = true;
          logger.info({ msg: 'Cloudinary asset deleted successfully', publicId: cand.id, type: cand.type, resType: cand.resType });
          break;
        }
      } catch (err) {
        // Continue to fallback candidates
      }
    }

    return deleted;
  }
}

export default CloudinaryStorageProvider;
