import { config } from '../config.js';

let accessToken = localStorage.getItem('joharsetu_token') || null;
let onUnauthorizedCallback = null;

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem('joharsetu_token', token);
  } else {
    localStorage.removeItem('joharsetu_token');
  }
}

export function getAccessToken() {
  return accessToken || localStorage.getItem('joharsetu_token');
}

export function onUnauthorized(callback) {
  onUnauthorizedCallback = callback;
}

const buildUrl = (endpoint) => {
  const base = config.api.baseUrl.endsWith('/') ? config.api.baseUrl : `${config.api.baseUrl}/`;
  const ep = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}${ep}`;
};

const request = async (endpoint, options = {}) => {
  const url = buildUrl(endpoint);
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401 && onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
      const error = new Error(data.error?.message || data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.response = { status: response.status, data };
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.response) {
      error.response = { data: { error: { message: error.message } } };
    }
    throw error;
  }
};

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
