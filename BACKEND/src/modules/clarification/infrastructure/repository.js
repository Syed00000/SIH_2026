import ClarificationMessage from './model.js';
import { purgeOldSeenMessages, buildMessageRoomQuery } from './helpers/query-builder.helper.js';
import { computeUnreadCount, computeChallengeStats } from './helpers/message-stats.helper.js';

export class ClarificationRepository {
  async getMessagesByChallenge(challengeId, role = null) {
    if (!challengeId) return [];

    await purgeOldSeenMessages(ClarificationMessage, challengeId);
    const query = buildMessageRoomQuery(challengeId, role);

    return await ClarificationMessage.find(query).sort({ createdAt: 1 }).lean();
  }

  async createMessage(data) {
    const {
      challengeId,
      senderId,
      senderName,
      senderRole,
      senderDesignation,
      universityCode,
      universityName,
      nodalName,
      message,
      messageType = 'TEXT',
      attachments = [],
      replyTo = null
    } = data;

    const isNodal = senderRole === 'NODAL' || senderRole === 'ADMIN';

    const newMsg = await ClarificationMessage.create({
      challengeId,
      senderId: senderId || '',
      senderName: senderName || 'User',
      senderRole: senderRole || 'UNIVERSITY',
      senderDesignation: senderDesignation || '',
      universityCode: universityCode || '',
      universityName: universityName || '',
      nodalName: nodalName || 'State Nodal Officer',
      message: message.trim(),
      messageType,
      attachments,
      replyTo: replyTo || { messageId: null, senderName: '', senderRole: '', message: '' },
      isReadByNodal: isNodal,
      isReadByUniversity: !isNodal,
      seenAt: null,
      deletedByRoles: [],
      isDeletedForEveryone: false
    });

    return newMsg.toObject();
  }

  async deleteMessage(messageId, role, mode = 'FOR_ME') {
    if (!messageId) return { success: false };

    if (mode === 'EVERYONE') {
      const updated = await ClarificationMessage.findByIdAndUpdate(
        messageId,
        {
          $set: {
            isDeletedForEveryone: true,
            message: '🚫 This message was deleted',
            attachments: []
          }
        },
        { new: true }
      );
      return { success: true, mode: 'EVERYONE', message: updated };
    }

    // Delete for Me
    const updated = await ClarificationMessage.findByIdAndUpdate(
      messageId,
      { $addToSet: { deletedByRoles: role } },
      { new: true }
    );

    if (updated?.deletedByRoles?.includes('UNIVERSITY') && updated?.deletedByRoles?.includes('NODAL')) {
      await ClarificationMessage.findByIdAndDelete(messageId);
    }

    return { success: true, mode: 'FOR_ME', messageId };
  }

  async markRead(challengeId, readerRole) {
    const now = new Date();
    const isNodal = readerRole === 'NODAL' || readerRole === 'ADMIN';
    const fieldToUpdate = isNodal
      ? { isReadByNodal: true, seenAt: now }
      : { isReadByUniversity: true, seenAt: now };
    const query = isNodal ? { challengeId, isReadByNodal: false } : { challengeId, isReadByUniversity: false };

    await ClarificationMessage.updateMany(query, { $set: fieldToUpdate });
    return { success: true };
  }

  async clearChat(challengeId, role = null) {
    if (!challengeId) return { success: false };

    if (!role) {
      await ClarificationMessage.deleteMany({ challengeId });
    } else {
      await ClarificationMessage.updateMany({ challengeId }, { $addToSet: { deletedByRoles: role } });
      await ClarificationMessage.deleteMany({
        challengeId,
        deletedByRoles: { $all: ['UNIVERSITY', 'NODAL'] }
      });
    }

    return { success: true };
  }

  async getUnreadCount(universityCode = null, isNodal = false) {
    return computeUnreadCount(ClarificationMessage, universityCode, isNodal);
  }

  async getChallengeStats() {
    return computeChallengeStats(ClarificationMessage);
  }
}

export const clarificationRepository = new ClarificationRepository();
export default clarificationRepository;
