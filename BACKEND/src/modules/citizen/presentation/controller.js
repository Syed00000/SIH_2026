import { citizenService } from '../application/service.js';
import logger from '../../../shared/logger/index.js';

export class CitizenController {
  async submitChallenge(req, res, next) {
    try {
      const user = req.user || null;
      const challengeData = req.body;

      logger.info({ msg: 'Citizen submitting problem statement', title: challengeData?.title });
      const challenge = await citizenService.submitChallenge(challengeData, user);

      res.status(201).json({
        success: true,
        message: 'Problem statement submitted successfully to Jharkhand Innovation Portal',
        data: challenge
      });
    } catch (error) {
      logger.error({ msg: 'Failed to submit citizen challenge', error: error.message });
      next(error);
    }
  }

  async getChallenges(req, res, next) {
    try {
      const { domain, status, district, search, page = 1, limit = 20 } = req.query;
      const result = await citizenService.getChallenges({
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
  }

  async getMyChallenges(req, res, next) {
    try {
      const user = req.user || null;
      const { status, search, page = 1, limit = 20 } = req.query;

      const result = await citizenService.getMyChallenges(user, {
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
  }

  async getChallengeById(req, res, next) {
    try {
      const { id } = req.params;
      const challenge = await citizenService.getChallengeById(id);

      res.status(200).json({
        success: true,
        data: challenge
      });
    } catch (error) {
      logger.error({ msg: 'Failed to get challenge details', error: error.message });
      next(error);
    }
  }

  async getStats(req, res, next) {
    try {
      const user = req.user || null;
      const stats = await citizenService.getStats(user);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logger.error({ msg: 'Failed to get citizen stats', error: error.message });
      next(error);
    }
  }

  async getUpdates(req, res, next) {
    try {
      const updates = await citizenService.getUpdates();
      res.status(200).json({
        success: true,
        data: updates
      });
    } catch (error) {
      logger.error({ msg: 'Failed to fetch updates', error: error.message });
      next(error);
    }
  }

  async getPopularAreas(req, res, next) {
    try {
      const areas = await citizenService.getPopularAreas();
      res.status(200).json({
        success: true,
        data: areas
      });
    } catch (error) {
      logger.error({ msg: 'Failed to fetch popular areas', error: error.message });
      next(error);
    }
  }
}

export const citizenController = new CitizenController();
export default citizenController;
