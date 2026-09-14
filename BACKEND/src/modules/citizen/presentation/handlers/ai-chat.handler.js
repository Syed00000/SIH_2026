import { chatbotGuardrailService } from '../../../../infrastructure/ai/chatbot-guardrail.service.js';
import logger from '../../../../shared/logger/index.js';

export const createAiChatHandler = () => {
  const handleChat = async (req, res, next) => {
    try {
      const { message, history } = req.body || {};

      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Message string is required'
        });
      }

      logger.info({ msg: 'Public AI Assistant received question', len: message.length });
      const result = await chatbotGuardrailService.processQuery(message, Array.isArray(history) ? history : []);

      res.status(200).json({
        success: true,
        data: {
          reply: result.reply,
          signature: result.signature,
          timestamp: new Date().toISOString(),
          firewallStatus: 'PROTECTED'
        }
      });
    } catch (error) {
      logger.error({ msg: 'AI Assistant error', error: error.message });
      next(error);
    }
  };

  return { handleChat };
};

export default createAiChatHandler;
