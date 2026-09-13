let accessToken = typeof localStorage !== 'undefined' ? localStorage.getItem('joharsetu_token') : null;
let refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('joharsetu_refresh_token') : null;

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem('joharsetu_token', token);
  } else {
    localStorage.removeItem('joharsetu_token');
  }
}

export function getAccessToken() {
  const token = accessToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('joharsetu_token') : null);
  if (!token || token === 'undefined' || token === 'null' || typeof token !== 'string') return null;
  return token;
}

export function setRefreshToken(token) {
  refreshToken = token;
  if (token && token !== 'undefined' && token !== 'null') {
    localStorage.setItem('joharsetu_refresh_token', token);
  } else {
    refreshToken = null;
    localStorage.removeItem('joharsetu_refresh_token');
  }
}

export function getRefreshToken() {
  const token = refreshToken || (typeof localStorage !== 'undefined' ? localStorage.getItem('joharsetu_refresh_token') : null);
  if (!token || token === 'undefined' || token === 'null' || typeof token !== 'string') return null;
  return token;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('joharsetu_token');
    localStorage.removeItem('joharsetu_refresh_token');
  }
}
