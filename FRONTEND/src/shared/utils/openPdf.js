const getBackendBase = () => {
  const envUrl = import.meta.env?.VITE_BACKEND_URL || import.meta.env?.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location) {
    const port = '3000';
    return `${window.location.protocol}//${window.location.hostname}:${port}`;
  }
  return 'http://localhost:3000';
};

/**
 * Transforms any raw Cloudinary or storage PDF URL into a reliable,
 * backend-authenticated streaming URL to bypass CDN 401 ACL deny restrictions.
 */
export function getPdfViewUrl(url, fileName = 'document.pdf') {
  if (!url) return '';
  const trimmed = url.trim();

  const backendBase = getBackendBase();

  // Already routed via media streaming proxy
  if (trimmed.includes('/api/v1/media/pdf')) {
    const pathAndQuery = trimmed.substring(trimmed.indexOf('/api/v1/media/pdf'));
    return `${backendBase}${pathAndQuery}`;
  }

  // Cloudinary URL requiring authentication proxy
  if (trimmed.includes('cloudinary.com')) {
    return `${backendBase}/api/v1/media/pdf?url=${encodeURIComponent(trimmed)}&filename=${encodeURIComponent(fileName || 'document.pdf')}`;
  }

  // Local storage relative path
  if (trimmed.startsWith('/uploads/')) {
    return `${backendBase}/api/v1/media/pdf?url=${encodeURIComponent(trimmed)}&filename=${encodeURIComponent(fileName || 'document.pdf')}`;
  }

  return trimmed;
}

/**
 * Opens a PDF in a new browser tab for native viewing and downloading.
 */
export function openPdfDocument(url, fileName = 'document.pdf') {
  if (!url) return;
  const viewUrl = getPdfViewUrl(url, fileName);
  window.open(viewUrl, '_blank', 'noopener,noreferrer');
}

export const openPdf = openPdfDocument;
export default openPdfDocument;
