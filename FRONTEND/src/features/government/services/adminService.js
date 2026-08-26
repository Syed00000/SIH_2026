import apiClient from '../../../infrastructure/api/client.js';

export const adminService = {
  async getAdmins(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.role && params.role !== 'All Roles') query.append('role', params.role);
    if (params.status && params.status !== 'All Status') query.append('status', params.status);
    if (params.district && params.district !== 'All') query.append('district', params.district);
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const res = await apiClient.get(`government/admins?${query.toString()}`);
    if (res?.data) {
      return {
        records: res.data || [],
        stats: res.stats || { totalAdmins: 0, activeAdmins: 0, suspendedAdmins: 0, removedAdmins: 0 }
      };
    }
    return { records: [], stats: {} };
  },

  async getAdminById(id) {
    const res = await apiClient.get(`government/admins/${id}`);
    return res?.data;
  },

  async createAdmin(payload) {
    const res = await apiClient.post('government/admins', payload);
    return res?.data;
  },

  async updateAdmin(id, payload) {
    const res = await apiClient.put(`government/admins/${id}`, payload);
    return res?.data;
  },

  async toggleAdminStatus(id) {
    const res = await apiClient.patch(`government/admins/${id}/status`);
    return res?.data;
  },

  async deleteAdmin(id) {
    const res = await apiClient.delete(`government/admins/${id}`);
    return res?.data;
  }
};

export default adminService;
