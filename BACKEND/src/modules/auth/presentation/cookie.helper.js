import config from '../../../shared/config/index.js';

export const setRefreshTokenCookie = (res, token) => {
  const isProduction = config.NODE_ENV === 'production';
  const days = parseInt(config.JWT_REFRESH_EXPIRY) || 7;

  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/',
    maxAge: days * 24 * 60 * 60 * 1000
  });
};

export default setRefreshTokenCookie;
