import { apiClient } from '../../infrastructure/api/client.js';

export const authApi = {
  login: async (credentials) => {
    return apiClient.post('auth/login', credentials);
  },

  register: async (userData) => {
    return apiClient.post('auth/register', userData);
  },

  verifyEmail: async (data) => {
    return apiClient.post('auth/verify-email', data);
  },

  resendVerificationOtp: async (data) => {
    return apiClient.post('auth/resend-verification-otp', data);
  },

  forgotPassword: async (data) => {
    return apiClient.post('auth/forgot-password', data);
  },

  resetPassword: async (data) => {
    return apiClient.post('auth/reset-password', data);
  },

  getMe: async () => {
    return apiClient.get('auth/me');
  },

  logout: async () => {
    return apiClient.post('auth/logout');
  }
};

export default authApi;
