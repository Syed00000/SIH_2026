import { apiClient } from '../../../infrastructure/api/client.js';

export const clarificationChatService = {
  /**
   * Fetch chat message history for a challenge
   */
  async getMessages(challengeId) {
    if (!challengeId) return [];
    try {
      const res = await apiClient.get(`clarification-chat/${challengeId}/messages`);
      return res.data?.data || res.data || [];
    } catch (err) {
      console.warn('Error fetching clarification messages:', err?.message);
      return [];
    }
  },

  /**
   * Send a message via REST endpoint
   */
  async sendMessage(challengeId, payload) {
    try {
      const res = await apiClient.post(`clarification-chat/${challengeId}/messages`, payload);
      return res.data?.data || res.data;
    } catch (err) {
      console.error('Error sending clarification message:', err);
      throw err;
    }
  },

  /**
   * Mark messages as read
   */
  async markRead(challengeId, role) {
    try {
      const res = await apiClient.patch(`clarification-chat/${challengeId}/read`, { role });
      return res.data;
    } catch (err) {
      console.warn('Error marking messages as read:', err?.message);
    }
  },

  /**
   * Get unread counts
   */
  async getUnreadStats(universityCode = null, isNodal = false) {
    try {
      const res = await apiClient.get('clarification-chat/unread-stats', {
        params: { universityCode, isNodal }
      });
      return res.data?.data || { unreadTotal: 0 };
    } catch (err) {
      return { unreadTotal: 0 };
    }
  },

  /**
   * Get per-challenge unread stats
   */
  async getChallengeStats() {
    try {
      const res = await apiClient.get('clarification-chat/challenge-stats');
      return res.data?.data || {};
    } catch (err) {
      return {};
    }
  },

  /**
   * Delete single message (mode: 'FOR_ME' | 'EVERYONE')
   */
  async deleteMessage(challengeId, messageId, role, mode = 'FOR_ME') {
    try {
      const res = await apiClient.delete(`clarification-chat/${challengeId}/messages/${messageId}`, {
        params: { mode },
        data: { role, mode }
      });
      return res.data;
    } catch (err) {
      console.warn('Error deleting message:', err?.message);
      return { success: false };
    }
  },

  /**
   * Clear Chat history for challenge
   */
  async clearChat(challengeId, role = null) {
    try {
      const res = await apiClient.delete(`clarification-chat/${challengeId}/clear`, {
        data: { role }
      });
      return res.data;
    } catch (err) {
      console.warn('Error clearing chat:', err?.message);
      return { success: false };
    }
  }
};

export default clarificationChatService;
