import apiClient from '../../../infrastructure/api/client.js';

export const technicianService = {
  getTechnicians: async (params = {}) => {
    return apiClient.get('government/technicians', { params });
  },

  getTechnicianById: async (id) => {
    return apiClient.get(`government/technicians/${id}`);
  },

  createTechnician: async (payload) => {
    return apiClient.post('government/technicians', payload);
  },

  updateTechnician: async (id, payload) => {
    return apiClient.put(`government/technicians/${id}`, payload);
  },

  deleteTechnician: async (id) => {
    return apiClient.delete(`government/technicians/${id}`);
  }
};

export default technicianService;
