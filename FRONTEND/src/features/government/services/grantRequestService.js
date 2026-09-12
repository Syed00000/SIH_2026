import apiClient from '../../../infrastructure/api/client.js';

class GrantRequestService {
  async createRequest(payload) {
    const res = await apiClient.post('government/grant-requests', payload);
    return res.data?.data || res.data;
  }

  async getRequests(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') query.append(k, v);
    });
    const url = `government/grant-requests${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await apiClient.get(url);
    return res.data?.data || res.data || [];
  }

  async grantRequest(requestId, payload = {}) {
    const res = await apiClient.patch(`government/grant-requests/${requestId}/grant`, payload);
    return res.data?.data || res.data;
  }

  async rejectRequest(requestId, payload = {}) {
    const res = await apiClient.patch(`government/grant-requests/${requestId}/reject`, payload);
    return res.data?.data || res.data;
  }
}

export const grantRequestService = new GrantRequestService();
export default grantRequestService;
