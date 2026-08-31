export const createApplicationHandler = (service) => {
  const applyIndustry = async (req, res, next) => {
    try {
      const result = await service.applyIndustry(req.body);
      res.status(201).json({
        status: 'SUCCESS',
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  const approveApplication = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.approveApplication(id, req.body);
      res.status(200).json({
        status: 'SUCCESS',
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  const rejectApplication = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.rejectApplication(id, req.body);
      res.status(200).json({
        status: 'SUCCESS',
        message: result.message,
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    applyIndustry,
    approveApplication,
    rejectApplication
  };
};

export default createApplicationHandler;
