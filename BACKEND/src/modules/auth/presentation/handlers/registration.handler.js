import { setRefreshTokenCookie } from '../cookie.helper.js';

export const createRegistrationHandler = (authService) => {
  const register = async (req, res, next) => {
    try {
      const { fullName, mobileNumber, email, password, confirmPassword, role, profile } = req.body;
      const result = await authService.register({ fullName, mobileNumber, email, password, confirmPassword, role, profile });
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          userId: result.userId,
          email: result.email,
          role: result.role,
          emailVerificationRequired: result.emailVerificationRequired
        }
      });
    } catch (error) {
      next(error);
    }
  };

  const verifyEmail = async (req, res, next) => {
    try {
      const { email, otp, code } = req.body;
      const result = await authService.verifyEmail({ email, otp, code });

      if (result.refreshToken) {
        setRefreshTokenCookie(res, result.refreshToken);
      }

      res.json({
        success: true,
        message: result.message,
        data: {
          emailVerified: result.emailVerified,
          accountStatus: result.accountStatus,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  };

  const resendVerificationOtp = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await authService.resendVerificationOtp({ email });
      res.json({
        success: true,
        message: result.message,
        devOtp: result.devOtp,
        data: { devOtp: result.devOtp }
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    register,
    verifyEmail,
    resendVerificationOtp
  };
};

export default createRegistrationHandler;
