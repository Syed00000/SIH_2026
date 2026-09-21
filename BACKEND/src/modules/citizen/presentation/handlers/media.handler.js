import logger from '../../../../shared/logger/index.js';

export const createMediaHandler = (service) => {
  const mediaService = service?.mediaService || service;
  const uploadMedia = async (req, res, next) => {
    try {
      const file = req.file;
      const user = req.user || null;
      const { citizenId, challengeId, caption } = req.body;

      logger.info({
        msg: 'Processing media upload request',
        originalName: file?.originalname,
        mimeType: file?.mimetype,
        challengeId,
        citizenId: citizenId || user?.id
      });

      const result = await mediaService.uploadEvidence({
        file,
        citizenId,
        challengeId,
        caption,
        user
      });

      res.status(201).json({
        success: true,
        message: 'Evidence media uploaded successfully to secure storage',
        data: result
      });
    } catch (error) {
      logger.error({ msg: 'Media upload handler error', error: error.message });
      next(error);
    }
  };

  const getMedia = async (req, res, next) => {
    try {
      const { mediaId } = req.params;
      const user = req.user || null;

      const media = await mediaService.getMediaById(mediaId, user);
      res.status(200).json({
        success: true,
        data: media
      });
    } catch (error) {
      next(error);
    }
  };

  const getChallengeMedia = async (req, res, next) => {
    try {
      const { challengeId } = req.params;
      const user = req.user || null;

      const items = await mediaService.getMediaByChallenge(challengeId, user);
      res.status(200).json({
        success: true,
        count: items.length,
        data: items
      });
    } catch (error) {
      next(error);
    }
  };

  const deleteMedia = async (req, res, next) => {
    try {
      const { mediaId } = req.params;
      const user = req.user || null;

      const result = await mediaService.deleteMedia(mediaId, user);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  return {
    uploadMedia,
    getMedia,
    getChallengeMedia,
    deleteMedia
  };
};

export default createMediaHandler;
