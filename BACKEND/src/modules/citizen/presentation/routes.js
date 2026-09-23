import { Router } from 'express';
import { citizenController } from './controller.js';
import jwt from 'jsonwebtoken';
import config from '../../../shared/config/index.js';
import { handleSingleMediaUpload } from './middleware/media-upload.middleware.js';

const router = Router();

// Optional authentication middleware: attaches user if token is present
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET);
      req.user = {
        id: decoded.sub,
        role: decoded.role,
        email: decoded.email,
        district: decoded.district || ''
      };
    } catch {
      // ignore invalid optional token
    }
  }
  next();
};

// AI Intelligence & Triage Routes
router.post('/challenges/ai-batch-sync', optionalAuth, (req, res, next) => citizenController.batchSyncAi(req, res, next));
router.post('/challenges/:id/ai-analyze', optionalAuth, (req, res, next) => citizenController.analyzeChallenge(req, res, next));
router.post('/challenges/:id/ai-apply', optionalAuth, (req, res, next) => citizenController.applyAiRecommendation(req, res, next));
router.post('/challenges/:id/mark-duplicate', optionalAuth, (req, res, next) => citizenController.markDuplicate(req, res, next));
router.post('/ai-chat', optionalAuth, (req, res, next) => citizenController.handleAiChat(req, res, next));

// Citizen Routes
router.post('/challenges', optionalAuth, (req, res, next) => citizenController.submitChallenge(req, res, next));
router.get('/challenges', optionalAuth, (req, res, next) => citizenController.getChallenges(req, res, next));
router.get('/challenges/my', optionalAuth, (req, res, next) => citizenController.getMyChallenges(req, res, next));
router.get('/challenges/:id', optionalAuth, (req, res, next) => citizenController.getChallengeById(req, res, next));
router.patch('/challenges/:id/triage', optionalAuth, (req, res, next) => citizenController.triageChallenge(req, res, next));
router.patch('/challenges/:id/assign', optionalAuth, (req, res, next) => citizenController.triageChallenge(req, res, next));
router.patch('/challenges/:id/withdraw', optionalAuth, (req, res, next) => citizenController.withdrawChallenge(req, res, next));
router.post('/challenges/:id/withdraw', optionalAuth, (req, res, next) => citizenController.withdrawChallenge(req, res, next));
router.delete('/challenges/:id', optionalAuth, (req, res, next) => citizenController.deleteChallenge(req, res, next));

// Evidence Media Routes (Storage Provider Wrapper)
router.post(
  '/media/upload',
  optionalAuth,
  handleSingleMediaUpload('file'),
  (req, res, next) => citizenController.uploadMedia(req, res, next)
);
router.get('/media/:mediaId', optionalAuth, (req, res, next) => citizenController.getMedia(req, res, next));
router.get('/challenges/:challengeId/media', optionalAuth, (req, res, next) => citizenController.getChallengeMedia(req, res, next));
router.delete('/media/:mediaId', optionalAuth, (req, res, next) => citizenController.deleteMedia(req, res, next));

router.get('/stats', optionalAuth, (req, res, next) => citizenController.getStats(req, res, next));
router.get('/updates', optionalAuth, (req, res, next) => citizenController.getUpdates(req, res, next));
router.get('/areas', (req, res, next) => citizenController.getPopularAreas(req, res, next));

export default router;
