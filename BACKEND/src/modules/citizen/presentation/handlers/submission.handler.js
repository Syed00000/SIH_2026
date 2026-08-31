import logger from '../../../../shared/logger/index.js';

export const createSubmissionHandler = (service) => {
  const submitChallenge = async (req, res, next) => {
    try {
      const user = req.user || null;
      const challengeData = req.body;

      logger.info({ msg: 'Citizen submitting problem statement', title: challengeData?.title });
      const challenge = await service.submitChallenge(challengeData, user);

      res.status(201).json({
        success: true,
        message: 'Problem statement submitted successfully to Jharkhand Innovation Portal',
        data: challenge
      });
    } catch (error) {
      logger.error({ msg: 'Failed to submit citizen challenge', error: error.message });
      next(error);
    }
  };

  return { submitChallenge };
};

export default createSubmissionHandler;
