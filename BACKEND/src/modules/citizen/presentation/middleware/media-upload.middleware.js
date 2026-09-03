import multer from 'multer';
import { BadRequestError, ValidationError } from '../../../../shared/errors/AppError.js';

// Specific size constraints in bytes
export const FILE_LIMITS = {
  VIDEO_MAX_BYTES: 50 * 1024 * 1024,   // 50 MB per user specification
  PDF_MAX_BYTES: 1024 * 1024,          // 1024 KB (1 MB) strictly in KB per user instruction
  IMAGE_MAX_BYTES: 10 * 1024 * 1024,   // 10 MB
  OVERALL_MAX_BYTES: 50 * 1024 * 1024  // Maximum threshold for single upload stream
};

const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  // Videos
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
  // Documents
  'application/pdf'
]);

const ALLOWED_EXTENSIONS = new RegExp(
  '\\.(jpg|jpeg|png|webp|gif|mp4|webm|mov|pdf)$',
  'i'
);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  const originalName = (file.originalname || '').toLowerCase();

  // Validate extension
  if (!ALLOWED_EXTENSIONS.test(originalName)) {
    return cb(
      new ValidationError(
        'Unsupported file extension. Allowed formats: JPG, PNG, WEBP, GIF, MP4, WEBM, MOV, PDF'
      ),
      false
    );
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.has(mime)) {
    return cb(
      new ValidationError(
        `Unsupported media format (${mime}). Allowed formats: Images, Videos (MP4/WEBM/MOV), and PDF documents`
      ),
      false
    );
  }

  cb(null, true);
};

// Base multer instance configured with memoryStorage for serverless runtime
const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: FILE_LIMITS.OVERALL_MAX_BYTES,
    files: 1
  },
  fileFilter
});

/**
 * Express middleware wrapper that intercepts upload and validates size
 * per file category (strict 50MB for video, strict 1024KB for PDF).
 */
export const handleSingleMediaUpload = (fieldName = 'file') => {
  const uploadSingle = uploadMiddleware.single(fieldName);

  return (req, res, next) => {
    uploadSingle(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new BadRequestError(`File size exceeds maximum upload limit of 50 MB`));
          }
          return next(new BadRequestError(`Upload error: ${err.message}`));
        }
        return next(err);
      }

      const file = req.file;
      if (!file) {
        return next(new BadRequestError('No file was uploaded. Please attach an image, video, or PDF file.'));
      }

      const mime = (file.mimetype || '').toLowerCase();
      const fileSize = file.size;

      // Enforce strict PDF limit in KB
      if (mime === 'application/pdf' && fileSize > FILE_LIMITS.PDF_MAX_BYTES) {
        return next(
          new BadRequestError(
            `PDF document size (${Math.round(fileSize / 1024)} KB) exceeds the maximum allowed limit of 1024 KB (1 MB). Please upload a smaller PDF.`
          )
        );
      }

      // Enforce strict Video limit
      if (mime.startsWith('video/') && fileSize > FILE_LIMITS.VIDEO_MAX_BYTES) {
        return next(
          new BadRequestError(
            `Video size (${Math.round(fileSize / (1024 * 1024))} MB) exceeds the maximum allowed limit of 50 MB.`
          )
        );
      }

      // Enforce strict Image limit
      if (mime.startsWith('image/') && fileSize > FILE_LIMITS.IMAGE_MAX_BYTES) {
        return next(
          new BadRequestError(
            `Image size (${Math.round(fileSize / (1024 * 1024))} MB) exceeds the maximum allowed limit of 10 MB.`
          )
        );
      }

      next();
    });
  };
};

export default handleSingleMediaUpload;
