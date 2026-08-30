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
      return response.data || { challenges: [], total: 0, page: 1, totalPages: 1 };
    } catch (err) {
      console.warn('API error fetching challenges:', err);
      return { challenges: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  async fetchMyChallenges(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await apiClient.get(`citizen/challenges/my${query ? `?${query}` : ''}`);
      return response.data || { challenges: [], total: 0, page: 1, totalPages: 1 };
    } catch (err) {
      console.warn('API error fetching my challenges:', err);
      return { challenges: [], total: 0, page: 1, totalPages: 1 };
    }
  },

  async fetchStats() {
    try {
      const response = await apiClient.get('citizen/stats');
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

  async deleteChallenge(challengeId) {
    const response = await apiClient.delete(`citizen/challenges/${challengeId}`);
    return response.data || response;
  }
};

export default citizenService;
