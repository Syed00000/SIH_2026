import { apiClient } from '../../../infrastructure/api/client.js';

export const citizenService = {
  async submitChallenge(challengeData) {
    const response = await apiClient.post('citizen/challenges', challengeData);
    return response.data || response;
  },

  async fetchChallenges(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await apiClient.get(`citizen/challenges${query ? `?${query}` : ''}`);
      const payload = response.data?.data || response.data || {};
      return {
        challenges: payload.challenges || (Array.isArray(payload) ? payload : []),
        total: payload.total || 0,
        page: payload.page || 1,
        totalPages: payload.totalPages || 1
      };
    } catch (err) {
      console.warn('API error fetching challenges:', err);
      return { challenges: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  async fetchMyChallenges(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await apiClient.get(`citizen/challenges/my${query ? `?${query}` : ''}`);
      const payload = response.data?.data || response.data || {};
      return {
        challenges: payload.challenges || (Array.isArray(payload) ? payload : []),
        total: payload.total || 0,
        page: payload.page || 1,
        totalPages: payload.totalPages || 1
      };
    } catch (err) {
      console.warn('API error fetching my challenges:', err);
      return { challenges: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  async fetchStats(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await apiClient.get(`citizen/stats${query ? `?${query}` : ''}`);
      const data = response.data?.data || response.data || {};
      return data;
    } catch {
      return {
        activities: { submitted: 0, underReview: 0, inProgress: 0, resolved: 0, total: 0 },
        overallImpact: { challengesSubmitted: 0, universitiesEngaged: 0, industryPartners: 0 }
      };
    }
  },

  async fetchUpdates() {
    try {
      const response = await apiClient.get('citizen/updates');
      return response.data || [];
    } catch {
      return [];
    }
  },

  async fetchPopularAreas() {
    try {
      const response = await apiClient.get('citizen/areas');
      return response.data || [];
    } catch {
      return [];
    }
  },

  async withdrawChallenge(challengeId, reason = '') {
    const response = await apiClient.patch(`citizen/challenges/${challengeId}/withdraw`, { reason });
    return response.data || response;
  },

  async deleteChallenge(challengeId) {
    const response = await apiClient.delete(`citizen/challenges/${challengeId}`);
    return response.data || response;
  },

  async uploadEvidence(file, { challengeId = null, citizenId = null, caption = '' } = {}) {
    const formData = new FormData();
    formData.append('file', file);
    if (challengeId) formData.append('challengeId', challengeId);
    if (citizenId) formData.append('citizenId', citizenId);
    if (caption) formData.append('caption', caption);

    const response = await apiClient.upload('citizen/media/upload', formData);
    return response.data || response;
  },

  async deleteEvidence(mediaId) {
    const response = await apiClient.delete(`citizen/media/${mediaId}`);
    return response.data || response;
  },

  async fetchChallengeMedia(challengeId) {
    try {
      const response = await apiClient.get(`citizen/challenges/${challengeId}/media`);
      return response.data || [];
    } catch {
      return [];
    }
  }
};

export default citizenService;
