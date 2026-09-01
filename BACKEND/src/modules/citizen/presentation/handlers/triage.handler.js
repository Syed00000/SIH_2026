import logger from '../../../../shared/logger/index.js';

export const createTriageHandler = (service) => {
  const triageChallenge = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = req.user || null;
      const triageData = req.body;

      logger.info({ msg: 'Nodal Officer triaging citizen challenge', id, triageData });
      const updated = await service.triageChallenge(id, triageData, user);

      res.status(200).json({
        success: true,
        message: 'Challenge triaged and updated successfully',
        data: updated
      });
    } catch (error) {
      logger.error({ msg: 'Failed to triage citizen challenge', error: error.message });
      next(error);
    }
  };

  const withdrawChallenge = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reason } = req.body || {};
      const user = req.user || null;
      logger.info({ msg: 'Citizen withdrawing challenge', id, reason });
      const updated = await service.withdrawChallenge(id, reason, user);
      res.status(200).json({
        success: true,
        message: 'Problem statement withdrawn successfully',
        data: updated
      });
    } catch (error) {
      logger.error({ msg: 'Failed to withdraw citizen challenge', error: error.message });
      next(error);
    }
  };

  const deleteChallenge = async (req, res, next) => {
    try {
      const { id } = req.params;
      logger.info({ msg: 'Nodal Officer deleting/dismissing citizen challenge', id });
      const result = await service.deleteChallenge(id);
      res.status(200).json(result);
    } catch (error) {
      logger.error({ msg: 'Failed to delete citizen challenge', error: error.message });
      next(error);
    }
  };

  return {
    triageChallenge,
    withdrawChallenge,
    deleteChallenge
  };
};

export default createTriageHandler;
