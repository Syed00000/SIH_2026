import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import fs from 'fs';
import { initCloudinaryClient } from '../../../infrastructure/storage/providers/helpers/cloudinary-config.helper.js';
import logger from '../../../shared/logger/index.js';

/**
 * Streams a PDF document for native inline browser viewing.
 * Bypasses Cloudinary raw ACL restrictions using authenticated signatures.
 */
export const streamPdf = async (req, res, next) => {
  try {
    const rawUrl = req.query.url;
    const rawPublicId = req.query.publicId;
    const requestedFileName = req.query.filename || 'document.pdf';
    const safeFilename = requestedFileName.replace(/[^a-zA-Z0-9._-]/g, '_');

    // 0. Unwrap nested streaming proxy URLs if passed
    let cleanUrl = rawUrl;
    while (cleanUrl && cleanUrl.includes('/api/v1/media/pdf')) {
      try {
        const parsed = new URL(cleanUrl, 'http://localhost:3000');
        const inner = parsed.searchParams.get('url');
        if (inner && inner !== cleanUrl) {
          cleanUrl = inner;
        } else {
          break;
        }
      } catch {
        break;
      }
    }

    // 1. Local disk storage fallback
    if (cleanUrl && (cleanUrl.startsWith('/uploads/') || cleanUrl.includes('/uploads/'))) {
      const cleanRelative = cleanUrl.split('/uploads/')[1].split('?')[0];
      const localPath = path.join(process.cwd(), 'public/uploads', cleanRelative);
      if (fs.existsSync(localPath)) {
        const stat = fs.statSync(localPath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Accept-Ranges', 'bytes');
        return fs.createReadStream(localPath).pipe(res);
      }
    }

    // 2. Cloudinary authentication & extraction
    initCloudinaryClient();

    let publicId = rawPublicId;
    if (!publicId && cleanUrl) {
      const match = cleanUrl.match(/\/(?:upload|authenticated)(?:\/s--[^/]+--)?\/(?:v\d+\/)?([^?&#]+)/);
      if (match) {
        publicId = decodeURIComponent(match[1]);
        publicId = publicId.split('?')[0].split('&')[0].split('#')[0].trim();
      }
    }

    if (!publicId && !cleanUrl) {
      return res.status(400).json({ success: false, message: 'PDF url or publicId is required' });
    }

    let buffer = null;

    // Strategy: Try combinations of private download URLs
    if (publicId) {
      const cleanId = publicId.replace(/\.pdf$/, '');
      const hasPdfExt = publicId.toLowerCase().endsWith('.pdf');

      const attempts = [
        // Raw upload
        { id: cleanId, format: 'pdf', type: 'upload', resType: 'raw' },
        ...(hasPdfExt ? [{ id: publicId, format: '', type: 'upload', resType: 'raw' }] : []),
        // Raw authenticated
        { id: cleanId, format: 'pdf', type: 'authenticated', resType: 'raw' },
        ...(hasPdfExt ? [{ id: publicId, format: '', type: 'authenticated', resType: 'raw' }] : []),
        // Image upload (some PDFs uploaded as image)
        { id: cleanId, format: 'pdf', type: 'upload', resType: 'image' },
        { id: cleanId, format: 'pdf', type: 'authenticated', resType: 'image' }
      ];

      for (const att of attempts) {
        try {
          const downloadUrl = cloudinary.utils.private_download_url(att.id, att.format, {
            resource_type: att.resType,
            type: att.type
          });

          const cloudRes = await fetch(downloadUrl);
          if (cloudRes.ok) {
            const arrayBuf = await cloudRes.arrayBuffer();
            if (arrayBuf && arrayBuf.byteLength > 0) {
              buffer = Buffer.from(arrayBuf);
              logger.info({ msg: 'Successfully fetched PDF from Cloudinary', publicId: att.id, type: att.type, resType: att.resType, size: buffer.length });
              break;
            }
          }
        } catch (_) {}
      }
    }

    // Strategy B: Direct fetch if cleanUrl was provided
    if (!buffer && cleanUrl && cleanUrl.startsWith('http')) {
      try {
        const directRes = await fetch(cleanUrl);
        if (directRes.ok) {
          const arrayBuf3 = await directRes.arrayBuffer();
          if (arrayBuf3 && arrayBuf3.byteLength > 0) {
            buffer = Buffer.from(arrayBuf3);
          }
        }
      } catch (_) {}
    }

    if (!buffer || buffer.length === 0) {
      logger.error({ msg: 'Failed to retrieve PDF document', url: cleanUrl, publicId });
      return res.status(404).json({
        success: false,
        message: 'PDF document could not be retrieved from storage or is unavailable'
      });
    }

    const isPdf = buffer.slice(0, 4).toString() === '%PDF';
    const contentType = isPdf ? 'application/pdf' : 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('Accept-Ranges', 'bytes');

    return res.send(buffer);
  } catch (err) {
    next(err);
  }
};

export default {
  streamPdf
};
