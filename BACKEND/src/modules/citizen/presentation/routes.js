import { Router } from 'express';
import { citizenController } from './controller.js';
import jwt from 'jsonwebtoken';
import config from '../../../shared/config/index.js';

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
        email: decoded.email
      };
    } catch {
      // ignore invalid optional token
    }
  }
  next();
};

// Citizen Routes
router.post('/challenges', optionalAuth, (req, res, next) => citizenController.submitChallenge(req, res, next));
router.get('/challenges', optionalAuth, (req, res, next) => citizenController.getChallenges(req, res, next));
router.get('/challenges/my', optionalAuth, (req, res, next) => citizenController.getMyChallenges(req, res, next));
router.get('/challenges/:id', optionalAuth, (req, res, next) => citizenController.getChallengeById(req, res, next));
router.patch('/challenges/:id/triage', optionalAuth, (req, res, next) => citizenController.triageChallenge(req, res, next));
router.patch('/challenges/:id/assign', optionalAuth, (req, res, next) => citizenController.triageChallenge(req, res, next));
router.delete('/challenges/:id', optionalAuth, (req, res, next) => citizenController.deleteChallenge(req, res, next));

router.get('/stats', optionalAuth, (req, res, next) => citizenController.getStats(req, res, next));
router.get('/updates', optionalAuth, (req, res, next) => citizenController.getUpdates(req, res, next));
router.get('/areas', (req, res, next) => citizenController.getPopularAreas(req, res, next));

export default router;
