// Constraints matching backend limits
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB
export const MAX_PDF_BYTES = 1024 * 1024;        // 1024 KB (1 MB) strictly in KB
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_RECORDING_SECONDS = 120;        // 2 minutes maximum recording limit

export const validateEvidenceFile = (file) => {
  if (!file) return 'No file selected';

  const mime = (file.type || '').toLowerCase();
  const name = (file.name || '').toLowerCase();

  const isImage = mime.startsWith('image/') || name.match(/\.(jpg|jpeg|png|webp|gif)$/);
  const isVideo = mime.startsWith('video/') || name.match(/\.(mp4|webm|mov)$/);
  const isPdf = mime === 'application/pdf' || name.endsWith('.pdf');

  if (!isImage && !isVideo && !isPdf) {
    return 'Unsupported file format. Please upload JPG, PNG, WEBP, MP4, WEBM, MOV, or PDF.';
  }

  if (isPdf && file.size > MAX_PDF_BYTES) {
    return `PDF size (${Math.round(file.size / 1024)} KB) exceeds the maximum allowed limit of 1024 KB (1 MB).`;
  }

  if (isVideo && file.size > MAX_VIDEO_BYTES) {
    return `Video size (${Math.round(file.size / (1024 * 1024))} MB) exceeds the maximum allowed limit of 50 MB.`;
  }

  if (isImage && file.size > MAX_IMAGE_BYTES) {
    return 'Image size exceeds the maximum limit of 10 MB.';
  }

  return null;
};

export const formatDurationTimer = (totalSec) => {
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};
