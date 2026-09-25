const defaultBaseUrl = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://127.0.0.1:3000/api/v1/'
  : '/api/v1/';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultBaseUrl;
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '15000', 10);
const ENV = import.meta.env.MODE || 'development';

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT,
  },
  env: ENV,
  isDev: ENV === 'development',
  isProd: ENV === 'production',
};
