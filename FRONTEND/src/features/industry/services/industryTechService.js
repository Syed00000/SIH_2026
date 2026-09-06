import apiClient from '../../../infrastructure/api/client.js';

export const industryTechService = {
  async getTechTools(industryName = '') {
    try {
      const q = industryName ? `?industryName=${encodeURIComponent(industryName)}` : '';
      const res = await apiClient.get(`industry/tech${q}`);
      return res?.data?.data || res?.data || { tools: [], stats: {}, eligibleProblemStatements: [] };
    } catch (err) {
      console.error('Error fetching industry tech tools:', err);
      return { tools: [], stats: {}, eligibleProblemStatements: [] };
    }
  },

  async createTechTool(toolData) {
    try {
      const res = await apiClient.post('industry/tech', toolData);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('Error creating industry tech tool:', err);
      throw err;
    }
  },

  async grantTechHelp(toolId, payload) {
    try {
      const res = await apiClient.post(`industry/tech/${encodeURIComponent(toolId)}/grant`, payload);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('Error granting tech tool help:', err);
      throw err;
    }
  },

  async revokeTechHelp(toolId, projectId) {
    try {
      const res = await apiClient.delete(`industry/tech/${encodeURIComponent(toolId)}/grant/${encodeURIComponent(projectId)}`);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('Error revoking tech tool help:', err);
      throw err;
    }
  }
};

export default industryTechService;
