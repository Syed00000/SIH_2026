export const cookieParser = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};

  if (cookieHeader) {
    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
      const parts = cookie.split('=');
      if (parts.length >= 2) {
        const name = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        req.cookies[name] = decodeURIComponent(value);
      }
    }
  }

  next();
};

export default cookieParser;
