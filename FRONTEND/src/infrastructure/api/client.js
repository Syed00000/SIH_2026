import { config } from '../config.js';

import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens
} from './tokenStorage.js';

export {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens
};

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

export function onUnauthorized(callback) {
  onUnauthorizedCallback = callback;
}

const buildUrl = (endpoint, params) => {
  const base = config.api.baseUrl.endsWith('/') ? config.api.baseUrl : `${config.api.baseUrl}/`;
  const ep = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  let fullUrl = `${base}${ep}`;
  if (params && typeof params === 'object') {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
    });
    const qs = searchParams.toString();
    if (qs) fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs;
  }
  return fullUrl;
};

export const performTokenRefresh = async () => {
  const currentRefreshToken = getRefreshToken();
  if (!currentRefreshToken) {
    clearTokens();
    return null;
  }

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
    } else {
      clearTokens();
    }
  } catch {
    clearTokens();
  }
  return null;
};

const request = async (endpoint, options = {}, isRetry = false, networkRetryCount = 0) => {
  const url = buildUrl(endpoint, options.params);
  const token = getAccessToken();

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  if (isFormData && headers['Content-Type']) {
    delete headers['Content-Type'];
  }

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
        let newAccessToken = null;
        try {
          newAccessToken = await performTokenRefresh();
        } catch {
          newAccessToken = null;
        } finally {
          isRefreshing = false;
        }

        if (newAccessToken) {
          onRefreshed(newAccessToken);
          return request(endpoint, options, true);
        } else {
          onRefreshed(null);
          clearTokens();
          if (onUnauthorizedCallback) {
            onUnauthorizedCallback();
          }
          const error = new Error(data.error?.message || data.message || 'Authentication required');
          error.status = 401;
          error.response = { status: 401, data };
          throw error;
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
    // If it is a transient network error (server restarting/connecting) and retry count < 3
    if (!error.status && networkRetryCount < 3) {
      const delay = (networkRetryCount + 1) * 700;
      await new Promise((resolve) => setTimeout(resolve, delay));
      return request(endpoint, options, isRetry, networkRetryCount + 1);
    }

    if (!error.response) {
      error.response = { data: { error: { message: error.message } } };
    }
    throw error;
  }
};

export const apiClient = {
  get: (endpoint, options) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => {
    const isFD = typeof FormData !== 'undefined' && body instanceof FormData;
    return request(endpoint, { method: 'POST', body: isFD ? body : JSON.stringify(body), ...options });
  },
  upload: (endpoint, formData, options) => request(endpoint, { method: 'POST', body: formData, ...options }),
  put: (endpoint, body, options) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (endpoint, body, options) => request(endpoint, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, ...options }),
  delete: (endpoint, options) => request(endpoint, { method: 'DELETE', ...options }),
};

export default apiClient;
