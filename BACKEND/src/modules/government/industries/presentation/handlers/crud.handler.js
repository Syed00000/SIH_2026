export const createCrudHandler = (service) => {
  const getIndustries = async (req, res, next) => {
    try {
      const { search, category, thematicDomain, status, accessStatus, verificationStatus, district, page, limit } = req.query;
      const data = await service.getIndustries({
        search,
        category,
        thematicDomain,
        status,
        accessStatus,
        verificationStatus,
        district,
        page: page || 1,
        limit: limit || 10
      });

      res.status(200).json({
        status: 'SUCCESS',
        data
      });
    } catch (error) {
      next(error);
    }
  };

  const getIndustryById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const industry = await service.getIndustryById(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { industry }
      });
    } catch (error) {
      next(error);
    }
  };

  const createIndustry = async (req, res, next) => {
    try {
      const result = await service.createIndustry(req.body);
      res.status(201).json({
        status: 'SUCCESS',
        message: 'Industry organization created and login credentials generated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  const updateIndustry = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await service.updateIndustry(id, req.body);
      res.status(200).json({
        status: 'SUCCESS',
        message: 'Industry organization updated successfully',
        data: { industry: updated }
      });
    } catch (error) {
      next(error);
    }
  };

  const deleteIndustry = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await service.deleteIndustry(id);
      res.status(200).json({
        status: 'SUCCESS',
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  return {
    getIndustries,
    getIndustryById,
    createIndustry,
    updateIndustry,
    deleteIndustry
  };
};

export default createCrudHandler;
