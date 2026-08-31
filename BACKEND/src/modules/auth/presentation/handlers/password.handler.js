export const createPasswordHandler = (authService) => {
  const requestPasswordReset = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await authService.requestPasswordReset(email);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  const resetPassword = async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPassword({ email, otp, newPassword });
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    requestPasswordReset,
    resetPassword
  };
};

export default createPasswordHandler;
