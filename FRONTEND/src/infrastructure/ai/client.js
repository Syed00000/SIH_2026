import { apiClient } from '../api/client.js';

export const AI_STATUS = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  PARTIAL: 'partial',
  COMPLETED: 'completed',
  ERROR: 'error',
  UNAVAILABLE: 'unavailable',
};

export const aiClient = {
  classify: async (payload) => {
    return apiClient.post('/ai/classify', payload);
  },

  detectDuplicates: async (payload) => {
    return apiClient.post('/ai/duplicates', payload);
  },

  getRecommendations: async (payload) => {
    return apiClient.post('/ai/recommendations', payload);
  },

  summarize: async (payload) => {
    return apiClient.post('/ai/summarize', payload);
  },

  getRoutingSuggestions: async (payload) => {
    return apiClient.post('/ai/routing', payload);
  },
};
