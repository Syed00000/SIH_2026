import apiClient from '../../../infrastructure/api/client.js';

export const industryExpertService = {
  async getExperts(industryName = '') {
    try {
      const q = industryName ? `?industryName=${encodeURIComponent(industryName)}` : '';
      const res = await apiClient.get(`industry/experts${q}`);
      return res?.data?.data || res?.data || { experts: [], stats: {}, eligibleProblemStatements: [] };
    } catch (err) {
      console.error('Error fetching industry experts:', err);
      return { experts: [], stats: {}, eligibleProblemStatements: [] };
    }
  },

  async createExpert(expertData) {
    try {
      const res = await apiClient.post('industry/experts', expertData);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('Error creating industry expert:', err);
      throw err;
    }
  },

  async assignProblem(expertId, problemData) {
    try {
      const res = await apiClient.post(`industry/experts/${encodeURIComponent(expertId)}/assign`, problemData);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('Error assigning problem to expert:', err);
      throw err;
    }
  },

  async unassignProblem(expertId, requestId) {
    try {
      const res = await apiClient.post(`industry/experts/${encodeURIComponent(expertId)}/unassign`, { requestId });
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('Error unassigning problem from expert:', err);
      throw err;
    }
  }
};

export default industryExpertService;
