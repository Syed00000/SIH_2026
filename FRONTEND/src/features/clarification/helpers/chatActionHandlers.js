import { sendSocketMessage, deleteSocketMessage } from '../../../infrastructure/socket/socketClient.js';
import { clarificationChatService } from '../services/clarificationChatService.js';

export const buildMessagePayload = ({
  challengeId,
  text,
  userName,
  userRole,
  isUniversityView,
  uniLeadDesignation,
  nodalDesignation,
  uniCode,
  uniName,
  nodalAdminName,
  replyingTo
}) => {
  const replyPayload = replyingTo
    ? { messageId: replyingTo._id, senderName: replyingTo.senderName, senderRole: replyingTo.senderRole, message: replyingTo.message }
    : null;

  return {
    challengeId,
    message: text,
    senderName: userName,
    senderRole: userRole,
    senderDesignation: isUniversityView ? uniLeadDesignation : nodalDesignation,
    universityCode: uniCode,
    universityName: uniName,
    nodalName: nodalAdminName,
    messageType: 'TEXT',
    replyTo: replyPayload
  };
};

export const executeMessageDelete = async ({ challengeId, msgId, userRole, mode }) => {
  await clarificationChatService.deleteMessage(challengeId, msgId, userRole, mode);
  deleteSocketMessage({ challengeId, messageId: msgId, role: userRole, mode });
};
