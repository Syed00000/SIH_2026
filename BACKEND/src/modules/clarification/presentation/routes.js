import { Router } from 'express';
import clarificationController from './controller.js';
import jwt from 'jsonwebtoken';
import config from '../../../shared/config/index.js';

const router = Router();

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
        fullName: decoded.fullName || decoded.name,
        profile: decoded.profile
      };
    } catch {
      // ignore invalid optional token
    }
  }
  next();
};

router.get('/unread-stats', optionalAuth, (req, res, next) =>
  clarificationController.getUnreadCount(req, res, next)
);

router.get('/challenge-stats', optionalAuth, (req, res, next) =>
  clarificationController.getChallengeStats(req, res, next)
);

router.get('/:challengeId/messages', optionalAuth, (req, res, next) =>
  clarificationController.getMessages(req, res, next)
);

router.post('/:challengeId/messages', optionalAuth, (req, res, next) =>
  clarificationController.sendMessage(req, res, next)
);

router.patch('/:challengeId/read', optionalAuth, (req, res, next) =>
  clarificationController.markRead(req, res, next)
);

router.delete('/:challengeId/messages/:messageId', optionalAuth, (req, res, next) =>
  clarificationController.deleteMessage(req, res, next)
);

router.delete('/:challengeId/clear', optionalAuth, (req, res, next) =>
  clarificationController.clearChat(req, res, next)
);

export default router;
