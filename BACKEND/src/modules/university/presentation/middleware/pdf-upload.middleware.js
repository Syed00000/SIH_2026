import multer from 'multer';
import { BadRequestError, ValidationError } from '../../../../shared/errors/AppError.js';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const mime = (file.mimetype || '').toLowerCase();
  const name = (file.originalname || '').toLowerCase();

  if (!name.endsWith('.pdf') && mime !== 'application/pdf') {
    return cb(new ValidationError('Only PDF documents are allowed (.pdf)'), false);
  }
  cb(null, true);
};

export const pdfUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 // Strictly 1MB limit per user requirement
  }
});

export const handlePdfUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: { code: 'FILE_TOO_LARGE', message: 'PDF file size must be under 1MB' }
      });
    }
    return res.status(400).json({ success: false, error: { message: err.message } });
  }
  if (err) {
    return res.status(400).json({ success: false, error: { message: err.message } });
  }
  next();
};

export default pdfUpload;
