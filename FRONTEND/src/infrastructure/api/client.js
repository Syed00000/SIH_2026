import { config } from '../config.js';

let accessToken = localStorage.getItem('joharsetu_token') || null;
let refreshToken = localStorage.getItem('joharsetu_refresh_token') || null;
let onUnauthorizedCallback = null;
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach((cb) => cb(newAccessToken));
  refreshSubscribers = [];
}

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

export function setRefreshToken(token) {
  refreshToken = token;
  if (token) {
    localStorage.setItem('joharsetu_refresh_token', token);
  } else {
    localStorage.removeItem('joharsetu_refresh_token');
  }
}

export function getRefreshToken() {
  return refreshToken || localStorage.getItem('joharsetu_refresh_token');
}

export function clearTokens() {
  setAccessToken(null);
  setRefreshToken(null);
}

export function onUnauthorized(callback) {
  onUnauthorizedCallback = callback;
}

const buildUrl = (endpoint) => {
  const base = config.api.baseUrl.endsWith('/') ? config.api.baseUrl : `${config.api.baseUrl}/`;
  const ep = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}${ep}`;
};

export const performTokenRefresh = async () => {
  const currentRefreshToken = getRefreshToken();
  const refreshUrl = buildUrl('auth/refresh');
  
  try {
    const res = await fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: currentRefreshToken }),
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.data?.accessToken) {
      const newAccess = data.data.accessToken;
      setAccessToken(newAccess);
      if (data.data.refreshToken) {
        setRefreshToken(data.data.refreshToken);
      }
      return newAccess;
    }
  } catch {
    // Refresh failed
  }
  return null;
};

const request = async (endpoint, options = {}, isRetry = false, isNetworkRetry = false) => {
  const url = buildUrl(endpoint);
  const token = getAccessToken();

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
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

    // If 401 Unauthorized occurs on an authenticated route and we haven't retried yet
    const isAuthRoute =
      endpoint.includes('auth/login') ||
      endpoint.includes('auth/register') ||
      endpoint.includes('auth/refresh') ||
      endpoint.includes('auth/verify-email');

    if (response.status === 401 && !isRetry && !isAuthRoute) {
      if (!isRefreshing) {
        isRefreshing = true;
        const newAccessToken = await performTokenRefresh();
        isRefreshing = false;

        if (newAccessToken) {
          onRefreshed(newAccessToken);
          return request(endpoint, options, true);
        } else {
          clearTokens();
          if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
          }
        }
      } else {
        // Wait for the active refresh to resolve
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              resolve(request(endpoint, options, true));
            } else {
              const error = new Error('Session expired');
              error.status = 401;
              reject(error);
            }
          });
        });
      }
    }

    if (!response.ok) {
      if (response.status === 401 && !isAuthRoute && onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
      const error = new Error(data.error?.message || data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.response = { status: response.status, data };
      throw error;
    }

    return data;
  } catch (error) {
    // If it is a transient network-level error (server starting up/connecting) and haven't retried yet
    if (!error.status && !isNetworkRetry) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return request(endpoint, options, isRetry, true);
    }

    if (!error.response) {
      error.response = { data: { error: { message: error.message } } };
    }
    throw error;
  }
};

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  upload: (endpoint, formData, options) => request(endpoint, { method: 'POST', body: formData, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
