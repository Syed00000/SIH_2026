import { apiClient } from '../../infrastructure/api/client.js';

export const authApi = {
  login: async (credentials) => {
    return apiClient.post('auth/login', credentials);
  },

  register: async (userData) => {
    return apiClient.post('auth/register', userData);
  },

  logout: async () => {
    return apiClient.post('auth/logout');
  },

  refresh: async () => {
    return apiClient.post('auth/refresh');
  },
};
