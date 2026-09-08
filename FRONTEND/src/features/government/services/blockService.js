import { apiClient } from '../../../infrastructure/api/client.js';

export const blockService = {
  getBlocks: async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await apiClient.get(`government/blocks${query ? `?${query}` : ''}`);
      return res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
    } catch (err) {
      console.warn('Error fetching blocks:', err);
      return [];
    }
  },

  getBlockById: async (id) => {
    const res = await apiClient.get(`government/blocks/${id}`);
    return res?.data?.data || res?.data;
  },

  createBlock: async (payload) => {
    const res = await apiClient.post('government/blocks', payload);
    return res?.data?.data || res?.data;
  },

  updateBlock: async (id, payload) => {
    const res = await apiClient.put(`government/blocks/${id}`, payload);
    return res?.data?.data || res?.data;
  },

  deleteBlock: async (id) => {
    const res = await apiClient.delete(`government/blocks/${id}`);
    return res?.data || res;
  }
};

export default blockService;
