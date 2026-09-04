import apiClient from '../../../infrastructure/api/client.js';

export const industryFundService = {
  async getProfile() {
    const res = await apiClient.get('industry/funds/profile');
    return res?.data || res;
  },

  async getFunds(industryName) {
    const query = industryName ? `?industryName=${encodeURIComponent(industryName)}` : '';
    const res = await apiClient.get(`industry/funds${query}`);
    return res?.data || res;
  },

  async createFund(payload) {
    const res = await apiClient.post('industry/funds', payload);
    return res?.data || res;
  },

  async updateFund(id, payload) {
    const res = await apiClient.put(`industry/funds/${id}`, payload);
    return res?.data || res;
  },

  async deleteFund(id) {
    const res = await apiClient.delete(`industry/funds/${id}`);
    return res?.data || res;
  },

  async disburseGrant(payload) {
    const res = await apiClient.post('industry/funds/disburse', payload);
    return res?.data || res;
  },

  async approveAndFundRequest(requestId, payload) {
    const res = await apiClient.post(`industry/funds/requests/${requestId}/approve-fund`, payload);
    return res?.data || res;
  }
};

export default industryFundService;
