import logger from '../../../../shared/logger/index.js';

export const createSubmissionHandler = (service) => {
  const submitChallenge = async (req, res, next) => {
    try {
      const user = req.user || null;
      const challengeData = req.body;

      logger.info({ msg: 'Citizen submitting problem statement', title: challengeData?.title });
      const challenge = await service.submitChallenge(challengeData, user);

      // Asynchronously trigger AI vector indexing and intelligence analysis in background
      import('../../../../infrastructure/ai/challenge-intelligence.service.js')
        .then(({ challengeIntelligenceService }) => challengeIntelligenceService.analyzeChallenge(challenge))
        .catch((aiErr) => logger.warn({ msg: 'Background AI analysis skipped or pending', err: aiErr.message }));

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
