import { setRefreshTokenCookie } from '../cookie.helper.js';

export const createSessionHandler = (authService) => {
  const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      setRefreshTokenCookie(res, result.refreshToken);

      res.json({
        success: true,
        message: 'Login successful.',
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: {
            id: result.user.id,
            fullName: result.user.fullName,
            email: result.user.email,
            mobileNumber: result.user.mobileNumber,
            role: result.user.role,
            deptId: result.user.deptId || result.user.profile?.deptId || '',
            category: result.user.category || result.user.profile?.category || '',
            department: result.user.department || result.user.profile?.department || result.user.fullName || '',
            code: result.user.code || result.user.profile?.code || '',
            blockId: result.user.blockId || result.user.profile?.blockId || '',
            blockName: result.user.blockName || result.user.profile?.name || '',
            block: result.user.block || result.user.profile?.block || '',
            district: result.user.profile?.district || result.user.district || '',
            officerId: result.user.officerId || result.user.profile?.officerId || '',
            designation: result.user.designation || result.user.profile?.designation || '',
            profile: result.user.profile || {},
            emailVerified: result.user.emailVerified,
            accountStatus: result.user.accountStatus
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  const refresh = async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          error: { message: 'Refresh token is required' }
        });
      }
      const result = await authService.refresh(token);

      setRefreshTokenCookie(res, result.refreshToken);

      res.json({
        success: true,
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  const logout = async (req, res, next) => {
    try {
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      if (token) {
        await authService.logout(token);
      }

      res.clearCookie('refreshToken');
      res.json({
        success: true,
        data: { message: 'Logged out successfully' }
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    login,
    refresh,
    logout
  };
};

export default createSessionHandler;
