import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { StorageProvider } from '../interfaces/StorageProvider.js';
import { resolveFileMetadata } from './helpers/cloudinary-url.helper.js';
import logger from '../../../shared/logger/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../../../public/uploads');

export class LocalStorageProvider extends StorageProvider {
  constructor() {
    super();
    this.name = 'local';
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  async upload({
    buffer,
    originalFileName = 'upload.bin',
    mimeType = 'application/octet-stream',
    folder = 'citizens/evidence',
    uniqueId,
    isPrivate = true
  }) {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Invalid file data: expected in-memory Buffer');
    }

    const { resourceType, fileType } = resolveFileMetadata(mimeType, originalFileName);
    const ext = path.extname(originalFileName) || (fileType === 'image' ? '.jpg' : fileType === 'pdf' ? '.pdf' : '.bin');
    const safeUniqueId = (uniqueId || `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${safeUniqueId}${ext}`;

    const targetFolder = path.join(UPLOADS_DIR, folder);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const filePath = path.join(targetFolder, filename);
    await fs.promises.writeFile(filePath, buffer);

    const relativePath = `/uploads/${folder}/${filename}`.replace(/\\/g, '/');
    const accessUrl = `http://localhost:3000${relativePath}`;

    logger.info({ msg: 'File uploaded locally', path: relativePath, size: buffer.length });

    return {
      storageProvider: 'local',
      storageKey: relativePath,
      providerPublicId: relativePath,
      resourceType,
      originalFileName,
      mimeType,
      fileType,
      fileSize: buffer.length,
      accessUrl,
      createdAt: new Date()
    };
  }

  async getAccessUrl({ providerPublicId }) {
    if (!providerPublicId) return '';
    if (providerPublicId.startsWith('http')) return providerPublicId;
    return `http://localhost:3000${providerPublicId.startsWith('/') ? '' : '/'}${providerPublicId}`;
  }

  async delete({ providerPublicId }) {
    if (!providerPublicId) return false;
    try {
      const cleanPath = providerPublicId.replace(/^\/?uploads\//, '');
      const filePath = path.join(UPLOADS_DIR, cleanPath);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }
      return true;
    } catch (err) {
      logger.error({ msg: 'Failed to delete local file', error: err.message });
      return false;
    }
  }
}

export default LocalStorageProvider;
