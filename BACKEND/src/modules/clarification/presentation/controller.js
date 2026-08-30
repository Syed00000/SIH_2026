import clarificationRepository from '../infrastructure/repository.js';
import { getSocketIO } from '../../../infrastructure/socket/socketServer.js';

export class ClarificationController {
  async getMessages(req, res, next) {
    try {
      const { challengeId } = req.params;
      const role = req.user?.role || req.query.role;
      const messages = await clarificationRepository.getMessagesByChallenge(challengeId, role);
      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (err) {
      next(err);
    }
  }

  async sendMessage(req, res, next) {
    try {
      const { challengeId } = req.params;
      const messageData = {
        challengeId,
        ...req.body,
        senderId: req.user?.id || req.body.senderId,
        senderName: req.user?.fullName || req.body.senderName,
        senderRole: req.user?.role || req.body.senderRole || 'UNIVERSITY'
      };

      const savedMessage = await clarificationRepository.createMessage(messageData);

      // Broadcast message via Socket.IO if available
      try {
        const io = getSocketIO();
        if (io) {
          // Emit to challenge specific room
          io.to(`challenge_${challengeId}`).emit('new_message', savedMessage);

          // Also emit notification to targeted party
          if (savedMessage.senderRole === 'UNIVERSITY') {
            io.to('nodal_desk').emit('clarification_notification', {
              type: 'NEW_INQUIRY',
              challengeId,
              universityName: savedMessage.universityName,
              message: savedMessage
            });
          } else {
            const uniCode = savedMessage.universityCode || '';
            if (uniCode) {
              io.to(`university_${uniCode.toUpperCase()}`).emit('clarification_notification', {
                type: 'NEW_RESOLUTION',
                challengeId,
                nodalName: savedMessage.nodalName,
                message: savedMessage
              });
            }
          }
        }
      } catch (socketErr) {
        console.warn('Socket broadcast warning:', socketErr?.message);
      }

      return res.status(201).json({
        success: true,
        data: savedMessage
      });
    } catch (err) {
      next(err);
    }
  }

  async markRead(req, res, next) {
    try {
      const { challengeId } = req.params;
      const role = req.user?.role || req.body.role || 'UNIVERSITY';
      await clarificationRepository.markRead(challengeId, role);
      return res.status(200).json({
        success: true,
        message: 'Marked as read'
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const { challengeId, messageId } = req.params;
      const role = req.user?.role || req.body?.role || 'UNIVERSITY';
      const mode = req.query.mode || req.body?.mode || 'FOR_ME';

      const result = await clarificationRepository.deleteMessage(messageId, role, mode);

      try {
        const io = getSocketIO();
        if (io) {
          if (mode === 'EVERYONE') {
            io.to(`challenge_${challengeId}`).emit('message_deleted', {
              challengeId,
              messageId,
              mode: 'EVERYONE',
              message: result.message
            });
          }
        }
      } catch (e) {
        // ignore
      }

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async clearChat(req, res, next) {
    try {
      const { challengeId } = req.params;
      const role = req.user?.role || req.body?.role || null;
      await clarificationRepository.clearChat(challengeId, role);

      // Notify room about chat clearance
      try {
        const io = getSocketIO();
        if (io) {
          io.to(`challenge_${challengeId}`).emit('chat_cleared', { challengeId, clearedBy: role });
        }
      } catch (e) {
        // ignore
      }

      return res.status(200).json({
        success: true,
        message: 'Chat history cleared successfully'
      });
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const isNodal = req.user?.role === 'NODAL' || req.user?.role === 'ADMIN' || req.query.isNodal === 'true';
      const universityCode = req.user?.profile?.code || req.query.universityCode;
      const stats = await clarificationRepository.getUnreadCount(universityCode, isNodal);
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }

  async getChallengeStats(req, res, next) {
    try {
      const stats = await clarificationRepository.getChallengeStats();
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }
}

export const clarificationController = new ClarificationController();
export default clarificationController;
