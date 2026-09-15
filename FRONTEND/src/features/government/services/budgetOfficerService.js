import apiClient from '../../../infrastructure/api/client.js';

export const budgetOfficerService = {
  getOfficers: async (params = {}) => {
    return apiClient.get('government/budget-officers', { params });
  },

  getOfficerById: async (id) => {
    return apiClient.get(`government/budget-officers/${id}`);
  },

  createOfficer: async (payload) => {
    return apiClient.post('government/budget-officers', payload);
  },

  updateOfficer: async (id, payload) => {
    return apiClient.put(`government/budget-officers/${id}`, payload);
  },

  deleteOfficer: async (id) => {
    return apiClient.delete(`government/budget-officers/${id}`);
  }
};

export default budgetOfficerService;
