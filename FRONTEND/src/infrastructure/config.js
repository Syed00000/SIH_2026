const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1/';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10);
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
