import apiClient from '../../../infrastructure/api/client.js';

export const departmentService = {
  getDepartments: async (params = {}) => {
    return apiClient.get('government/departments', { params });
  },

  getDepartmentById: async (id) => {
    return apiClient.get(`government/departments/${id}`);
  },

  createDepartment: async (payload) => {
    return apiClient.post('government/departments', payload);
  },

  updateDepartment: async (id, payload) => {
    return apiClient.put(`government/departments/${id}`, payload);
  },

  deleteDepartment: async (id) => {
    return apiClient.delete(`government/departments/${id}`);
  }
};

export default departmentService;
