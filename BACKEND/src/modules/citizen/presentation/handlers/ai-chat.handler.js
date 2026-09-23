import { citizenAiAssistantService } from '../../application/services/citizen-ai-assistant.service.js';
import { chatbotGuardrailService } from '../../../../infrastructure/ai/chatbot-guardrail.service.js';
import logger from '../../../../shared/logger/index.js';

export const createAiChatHandler = () => {
  const handleChat = async (req, res, next) => {
    try {
      const { message, history, media, currentLang, selectedLanguage, language } = req.body || {};
      const activeLanguage = currentLang || selectedLanguage || language || null;

      if ((!message || typeof message !== 'string') && (!media || media.length === 0)) {
        return res.status(400).json({
          success: false,
          message: 'Message string or media attachment is required'
        });
      }

      logger.info({
        msg: 'Citizen AI Assistant received message',
        user: req.user?.id || 'guest',
        mediaCount: Array.isArray(media) ? media.length : 0,
        selectedLanguage: activeLanguage
      });

      // 1. Run security injection check
      if (message && chatbotGuardrailService.detectInjection(message)) {
        return res.status(200).json({
          success: true,
          data: {
            reply: '🔒 [JoharSetu Security Firewall] Aapka prashna system safety policy ke anukool nahi paya gaya. JoharSetu AI Assistant keval Jharkhand civic administration aur student innovation se jude vishayon ke liye upalabdha hai.',
            signature: chatbotGuardrailService.generateHmacSignature('blocked'),
            timestamp: new Date().toISOString(),
            firewallStatus: 'BLOCKED'
          }
        });
      }

      // 2. Process conversation, missing location validation, challenge intake, or live tracking
      const result = await citizenAiAssistantService.processCitizenChat({
        message,
        history: Array.isArray(history) ? history : [],
        media: Array.isArray(media) ? media : [],
        user: req.user || req.body?.user || null,
        selectedLanguage: activeLanguage
      });

      const sanitizedReply = chatbotGuardrailService.sanitizeOutput(result.reply || '');

      res.status(200).json({
        success: true,
        data: {
          reply: sanitizedReply,
          intent: result.intent,
          draftReport: result.draftReport || null,
          createdChallenge: result.createdChallenge || null,
          trackingData: result.trackingData || null,
          challengesList: result.challengesList || null,
          withdrawnChallenge: result.withdrawnChallenge || null,
          deletedChallengeId: result.deletedChallengeId || null,
          actionTarget: result.actionTarget || null,
          signature: chatbotGuardrailService.generateHmacSignature(sanitizedReply),
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
