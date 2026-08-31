import { emitMessageDeleted, emitChatCleared } from '../helpers/socket-emitter.helper.js';

export const createDeletionHandler = (repository) => {
  const deleteMessage = async (req, res, next) => {
    try {
      const { challengeId, messageId } = req.params;
      const role = req.user?.role || req.body?.role || 'UNIVERSITY';
      const mode = req.query.mode || req.body?.mode || 'FOR_ME';

      const result = await repository.deleteMessage(messageId, role, mode);

      emitMessageDeleted(challengeId, messageId, mode, result.message);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  };

  const clearChat = async (req, res, next) => {
    try {
      const { challengeId } = req.params;
      const role = req.user?.role || req.body?.role || null;
      await repository.clearChat(challengeId, role);

      emitChatCleared(challengeId, role);

      return res.status(200).json({
        success: true,
        message: 'Chat history cleared successfully'
      });
    } catch (err) {
      next(err);
    }
  };

  return {
    deleteMessage,
    clearChat
  };
};

export default createDeletionHandler;
