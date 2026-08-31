import { emitNewMessage } from '../helpers/socket-emitter.helper.js';

export const createMessageHandler = (repository) => {
  const getMessages = async (req, res, next) => {
    try {
      const { challengeId } = req.params;
      const role = req.user?.role || req.query.role;
      const messages = await repository.getMessagesByChallenge(challengeId, role);
      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (err) {
      next(err);
    }
  };

  const sendMessage = async (req, res, next) => {
    try {
      const { challengeId } = req.params;
      const messageData = {
        challengeId,
        ...req.body,
        senderId: req.user?.id || req.body.senderId,
        senderName: req.user?.fullName || req.body.senderName,
        senderRole: req.user?.role || req.body.senderRole || 'UNIVERSITY'
      };

      const savedMessage = await repository.createMessage(messageData);

      emitNewMessage(challengeId, savedMessage);

      return res.status(201).json({
        success: true,
        data: savedMessage
      });
    } catch (err) {
      next(err);
    }
  };

  const markRead = async (req, res, next) => {
    try {
      const { challengeId } = req.params;
      const role = req.user?.role || req.body.role || 'UNIVERSITY';
      await repository.markRead(challengeId, role);
      return res.status(200).json({
        success: true,
        message: 'Marked as read'
      });
    } catch (err) {
      next(err);
    }
  };

  return {
    getMessages,
    sendMessage,
    markRead
  };
};

export default createMessageHandler;
