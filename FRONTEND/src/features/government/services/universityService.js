import apiClient from '../../../infrastructure/api/client.js';

export const universityService = {
  async getUniversities(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.search?.trim()) query.append('search', params.search.trim());
      if (params.district && !params.district.startsWith('All')) query.append('district', params.district);
      if (params.status && !params.status.startsWith('All')) query.append('status', params.status);
      if (params.accessStatus && params.accessStatus !== 'All') query.append('accessStatus', params.accessStatus);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);

      const res = await apiClient.get(`admin/heis?${query.toString()}`);
      const payload = res?.data?.data || res?.data || {};
      const records = Array.isArray(payload.records) ? payload.records : [];
      const total = payload.total || records.length;
      const kpis = payload.kpis || {
        totalUniversities: total,
        activeUniversities: records.filter(r => r.status === 'Active').length,
        disabledUniversities: records.filter(r => r.accessStatus === 'Disabled').length,
        pendingApproval: records.filter(r => r.status === 'Pending').length
      };

      return {
        records,
        total,
        page: payload.page || params.page || 1,
        limit: payload.limit || params.limit || 10,
        totalPages: payload.totalPages || Math.ceil(total / (params.limit || 10)),
        kpis
      };
    } catch (err) {
      console.error('getUniversities error:', err.message);
      return { records: [], total: 0, kpis: {} };
    }
  },

  async getUniversityById(id) {
    const res = await apiClient.get(`admin/heis/${id}`);
    const data = res?.data?.data || res?.data;
    if (data?.university || data?._id || data?.code) return data?.university || data;
    throw new Error('University not found in database');
  },

  async createUniversity(payload) {
    const res = await apiClient.post('admin/heis', payload);
    if (res?.data) return res.data?.data || res.data;
    throw new Error('Failed to create university');
  },

  async updateUniversity(id, payload) {
    const res = await apiClient.put(`admin/heis/${id}`, payload);
    const data = res?.data?.data || res?.data;
    if (data?.university || data?._id) return data?.university || data;
    throw new Error('Failed to update university');
  },

  async toggleAccessStatus(id) {
    const res = await apiClient.patch(`admin/heis/${id}/toggle-access`);
    const data = res?.data?.data || res?.data;
    if (data?.university || data?._id) return data?.university || data;
    throw new Error('Failed to toggle access status');
  },

  async updateStatus(id, status, remarks = '') {
    const res = await apiClient.patch(`admin/heis/${id}/status`, { status, remarks });
    const data = res?.data?.data || res?.data;
    if (data?.university || data?._id) return data?.university || data;
    throw new Error('Failed to update review status');
  },

  async updateUniversityStatus(id, status, remarks = '') {
    return this.updateStatus(id, status, remarks);
  },

  async deleteUniversity(id) {
    const res = await apiClient.delete(`admin/heis/${id}`);
    return res?.data?.data || res?.data;
  }
};

export default universityService;
