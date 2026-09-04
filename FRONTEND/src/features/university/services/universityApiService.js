import apiClient from '../../../infrastructure/api/client.js';
import { facultyProjectsApi, DEFAULT_UNIVERSITY_CODE } from './api/facultyProjectsApi.js';
import { partnersApprovalsApi } from './api/partnersApprovalsApi.js';

export { DEFAULT_UNIVERSITY_CODE };

export const universityApiService = {
  ...facultyProjectsApi,
  ...partnersApprovalsApi,

  async getDashboardSummary(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/dashboard?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data && res.data.kpis) return res.data;
    } catch (err) { console.error('API getDashboardSummary error:', err.message); }
    return {
      name: 'Ranchi University',
      kpis: {
        assignedChallenges: { total: 0, reviewNeeded: 0 },
        activeProjects: { total: 0, delayed: 0 },
        facultyMentors: { total: 0, onLeave: 0 },
        pendingApprovals: { total: 0 },
        industryPartners: { total: 0 }
      },
      challenges: [],
      projects: [],
      faculty: []
    };
  },

  async getAssignedChallenges(universityCode = DEFAULT_UNIVERSITY_CODE, params = {}) {
    try {
      const query = new URLSearchParams({ universityCode, ...params });
      const res = await apiClient.get(`university/challenges?${query.toString()}`);
      if (res?.data && (res.data.challenges?.length !== undefined || Array.isArray(res.data))) return res.data;
    } catch (err) { console.error('API getAssignedChallenges error:', err.message); }
    return { challenges: [], total: 0 };
  },

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata = {}) {
    try {
      const res = await apiClient.patch(`university/challenges/${challengeId}/status?universityCode=${encodeURIComponent(universityCode)}`, {
        status, actionLabel, ...metadata
      });
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateChallengeStatus error:', err.message); }
    return { challengeId, status, actionLabel };
  },

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    try {
      const res = await apiClient.post(`university/challenges/${challengeId}/assign-faculty?universityCode=${encodeURIComponent(universityCode)}`, {
        facultyInfo
      });
      if (res?.data) return res.data;
    } catch (err) { console.error('API assignFaculty error:', err.message); }
    return { challengeId, facultyInfo, status: 'Accepted' };
  },

  async deleteChallenge(challengeId, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/challenges/${encodeURIComponent(challengeId)}?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) {
      try {
        await apiClient.delete(`citizen/challenges/${encodeURIComponent(challengeId)}`);
      } catch (e) {
        console.error('API deleteChallenge error:', err.message);
      }
    }
    return { success: true, challengeId };
  },

  async getReports(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/reports?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API getReports error:', err.message); }
    return [];
  },

  async getProfile(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/profile?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API getProfile error:', err.message); }
    return null;
  },

  async updateProfile(profileData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.put(`university/profile?universityCode=${encodeURIComponent(universityCode)}`, profileData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateProfile error:', err.message); }
    return null;
  },

  async clearActivities(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/notifications?universityCode=${encodeURIComponent(universityCode)}`);
      return res?.data || { success: true };
    } catch (err) {
      console.error('API clearActivities error:', err.message);
      return { success: false };
    }
  }
};

export default universityApiService;
