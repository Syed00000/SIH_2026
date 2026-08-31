import logger from '../../../../shared/logger/index.js';

export const createAnalyticsHandler = (service) => {
  const getStats = async (req, res, next) => {
    try {
      const user = req.user || null;
      const stats = await service.getStats(user);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error({ msg: 'Failed to get citizen stats', error: error.message });
      next(error);
    }
  };

  const getUpdates = async (req, res, next) => {
    try {
      const updates = await service.getUpdates();
      res.status(200).json({
        success: true,
        data: updates
      });
    } catch (error) {
      logger.error({ msg: 'Failed to fetch updates', error: error.message });
      next(error);
    }
  };

  const getPopularAreas = async (req, res, next) => {
    try {
      const areas = await service.getPopularAreas();
      res.status(200).json({
        success: true,
        data: areas
      });
    } catch (error) {
      logger.error({ msg: 'Failed to fetch popular areas', error: error.message });
      next(error);
    }
  };

  return {
    getStats,
    getUpdates,
    getPopularAreas
  };
};

export default createAnalyticsHandler;
