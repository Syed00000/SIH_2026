export const createUserHandler = (userService) => {
  const me = async (req, res, next) => {
    try {
      const userId = req.user?.id || req.user?.sub;
      const user = await userService.getUserById(userId);
      res.json({
        success: true,
        data: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role,
          profile: user.profile,
          emailVerified: user.isEmailVerified,
          accountStatus: user.accountStatus
        }
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    me
  };
};

export default createUserHandler;
