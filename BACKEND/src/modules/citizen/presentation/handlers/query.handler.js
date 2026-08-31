import logger from '../../../../shared/logger/index.js';

export const createQueryHandler = (service) => {
  const getChallenges = async (req, res, next) => {
    try {
      const { domain, status, district, search, page = 1, limit = 20 } = req.query;
      const result = await service.getChallenges({
        domain,
        status,
        district,
        search,
        page,
        limit
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error({ msg: 'Failed to fetch challenges', error: error.message });
      next(error);
    }
  };

  const getMyChallenges = async (req, res, next) => {
    try {
      const user = req.user || null;
      const { status, search, page = 1, limit = 20 } = req.query;

      const result = await service.getMyChallenges(user, {
        status,
        search,
        page,
        limit
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logger.error({ msg: 'Failed to fetch citizen challenges', error: error.message });
      next(error);
    }
  };

  const getChallengeById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const challenge = await service.getChallengeById(id);

      res.status(200).json({
        success: true,
        data: challenge
      });
    } catch (error) {
      logger.error({ msg: 'Failed to get challenge details', error: error.message });
      next(error);
    }
  };

  return {
    getChallenges,
    getMyChallenges,
    getChallengeById
  };
};

export default createQueryHandler;
