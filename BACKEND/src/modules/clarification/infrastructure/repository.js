import ClarificationMessage from './model.js';
import { CitizenChallenge } from '../../citizen/infrastructure/model.js';

export class ClarificationRepository {
  /**
   * Get all messages for a specific challenge room
   * Auto-excludes messages older than 12 hours after being seen by both parties, or deleted by this role
   */
  async getMessagesByChallenge(challengeId, role = null) {
    if (!challengeId) return [];

    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

    // Background purge: Delete any message seen by both parties that is older than 12 hours
    try {
      await ClarificationMessage.deleteMany({
        challengeId,
        isReadByNodal: true,
        isReadByUniversity: true,
        seenAt: { $ne: null, $lt: twelveHoursAgo }
      });
    } catch (e) {
      // background cleanup ignore
    }

    const query = {
      challengeId,
      $or: [
        { seenAt: null },
        { seenAt: { $gte: twelveHoursAgo } },
        { isReadByNodal: false },
        { isReadByUniversity: false }
      ]
    };

    if (role) {
      query.deletedByRoles = { $ne: role };
    }

    let messages = await ClarificationMessage.find(query)
      .sort({ createdAt: 1 })
      .lean();

    return messages;
  }

  /**
   * Create and store a new message
   */
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

  /**
   * Delete a single message (Delete for me vs Delete for everyone)
   */
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
    } else {
      // Delete for Me
      const updated = await ClarificationMessage.findByIdAndUpdate(
        messageId,
        {
          $addToSet: { deletedByRoles: role }
        },
        { new: true }
      );

      // If deleted by all parties, clean up completely
      if (updated && updated.deletedByRoles?.includes('UNIVERSITY') && updated.deletedByRoles?.includes('NODAL')) {
        await ClarificationMessage.findByIdAndDelete(messageId);
      }

      return { success: true, mode: 'FOR_ME', messageId };
    }
  }

  /**
   * Mark messages as read and stamp seenAt
   */
  async markRead(challengeId, readerRole) {
    const now = new Date();
    if (readerRole === 'NODAL' || readerRole === 'ADMIN') {
      await ClarificationMessage.updateMany(
        { challengeId, isReadByNodal: false },
        { 
          $set: { 
            isReadByNodal: true,
            seenAt: now
          } 
        }
      );
    } else {
      await ClarificationMessage.updateMany(
        { challengeId, isReadByUniversity: false },
        { 
          $set: { 
            isReadByUniversity: true,
            seenAt: now
          } 
        }
      );
    }
    return { success: true };
  }

  /**
   * Clear Chat History for a Challenge
   */
  async clearChat(challengeId, role = null) {
    if (!challengeId) return { success: false };

    if (!role) {
      await ClarificationMessage.deleteMany({ challengeId });
    } else {
      // Mark as deleted for this role, and if deleted by both roles, completely remove
      await ClarificationMessage.updateMany(
        { challengeId },
        { $addToSet: { deletedByRoles: role } }
      );
      await ClarificationMessage.deleteMany({
        challengeId,
        deletedByRoles: { $all: ['UNIVERSITY', 'NODAL'] }
      });
    }

    return { success: true };
  }

  /**
   * Get unread stats for badges
   */
  async getUnreadCount(universityCode = null, isNodal = false) {
    if (isNodal) {
      const count = await ClarificationMessage.countDocuments({
        senderRole: 'UNIVERSITY',
        isReadByNodal: false
      });
      return { unreadTotal: count };
    } else if (universityCode) {
      const count = await ClarificationMessage.countDocuments({
        universityCode: universityCode.toUpperCase(),
        senderRole: { $in: ['NODAL', 'ADMIN'] },
        isReadByUniversity: false
      });
      return { unreadTotal: count };
    }
    return { unreadTotal: 0 };
  }

  /**
   * Get per-challenge unread stats
   */
  async getChallengeStats() {
    const unreadNodal = await ClarificationMessage.aggregate([
      { $match: { senderRole: 'UNIVERSITY', isReadByNodal: false } },
      { $group: { _id: '$challengeId', unreadCount: { $sum: 1 } } }
    ]);

    const unreadUniversity = await ClarificationMessage.aggregate([
      { $match: { senderRole: { $in: ['NODAL', 'ADMIN'] }, isReadByUniversity: false } },
      { $group: { _id: '$challengeId', unreadCount: { $sum: 1 } } }
    ]);

    const statsMap = {};
    unreadNodal.forEach((item) => {
      statsMap[item._id] = { ...(statsMap[item._id] || {}), unreadForNodal: item.unreadCount };
    });
    unreadUniversity.forEach((item) => {
      statsMap[item._id] = { ...(statsMap[item._id] || {}), unreadForUniversity: item.unreadCount };
    });

    return statsMap;
  }
}

export const clarificationRepository = new ClarificationRepository();
export default clarificationRepository;
