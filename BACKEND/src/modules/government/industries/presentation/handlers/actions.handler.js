export const createActionsHandler = (service) => {
  const toggleStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await service.toggleStatus(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: `Industry status changed to ${updated.status}`,
        data: { industry: updated }
      });
    } catch (error) {
      next(error);
    }
  };

  const resetPassword = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.resetPassword(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'New credentials generated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  const seedAuthentic = async (req, res, next) => {
    try {
      const result = await service.seedAuthenticIndustries();
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Authentic Jharkhand industries seeded successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  };

  return {
    toggleStatus,
    resetPassword,
    seedAuthentic
  };
};

export default createActionsHandler;
