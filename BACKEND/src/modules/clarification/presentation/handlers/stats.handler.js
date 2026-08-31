export const createStatsHandler = (repository) => {
  const getUnreadCount = async (req, res, next) => {
    try {
      const isNodal = req.user?.role === 'NODAL' || req.user?.role === 'ADMIN' || req.query.isNodal === 'true';
      const universityCode = req.user?.profile?.code || req.query.universityCode;
      const stats = await repository.getUnreadCount(universityCode, isNodal);
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  };

  const getChallengeStats = async (req, res, next) => {
    try {
      const stats = await repository.getChallengeStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  };

  return {
    getUnreadCount,
    getChallengeStats
  };
};

export default createStatsHandler;
