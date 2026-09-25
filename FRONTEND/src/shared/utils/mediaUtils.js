/**
 * Resolves any raw media URL (relative, absolute, or cloud-hosted)
 * into a safe, production-compatible absolute or proxy URL.
 *
 * @param {string} rawUrl - Media file URL or relative upload path
 * @returns {string} - Fully-resolved URL suitable for img/video tags
 */
export const resolveMediaUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // If already absolute or data/blob URI
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;

  // Prioritize environment variable if defined
  const envBackend = import.meta.env?.VITE_BACKEND_URL || 
    (import.meta.env?.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, '') : '');

  if (envBackend) {
    return `${envBackend.replace(/\/$/, '')}${cleanPath}`;
  }

  // Local development fallback
  if (
    typeof window !== 'undefined' &&
    (window.location.port === '5173' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    return `http://127.0.0.1:3000${cleanPath}`;
  }

  // On production (e.g. Vercel), fallback to relative path (handled by vercel rewrite or proxy)
  return cleanPath;
};

export default resolveMediaUrl;
