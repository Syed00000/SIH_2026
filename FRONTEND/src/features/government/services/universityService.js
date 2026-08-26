import apiClient from '../../../infrastructure/api/client.js';

export const universityService = {
  /**
   * Fetch all universities directly from MongoDB backend API
   */
  async getUniversities(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.district && params.district !== 'All Districts' && params.district !== 'All') {
      query.append('district', params.district);
    }
    if (params.status && params.status !== 'All Status' && params.status !== 'All') {
      query.append('status', params.status);
    }
    if (params.accessStatus && params.accessStatus !== 'All') {
      query.append('accessStatus', params.accessStatus);
    }
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const res = await apiClient.get(`admin/heis?${query.toString()}`);
    if (res?.data) {
      return res.data;
    }
    return {
      records: [],
      total: 0,
      page: 1,
      limit: params.limit || 10,
      totalPages: 0,
      kpis: {
        totalUniversities: 0,
        activeUniversities: 0,
        disabledUniversities: 0,
        pendingApproval: 0,
        activePercentage: 0,
        disabledPercentage: 0
      }
    };
  },

  /**
   * Get single university by MongoDB ID
   */
  async getUniversityById(id) {
    const res = await apiClient.get(`admin/heis/${id}`);
    if (res?.data?.university) {
      return res.data.university;
    }
    throw new Error('University not found in database');
  },

  /**
   * Register new University in MongoDB & generate User credentials
   */
  async createUniversity(payload) {
    const res = await apiClient.post('admin/heis', payload);
    if (res?.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Failed to create university');
  },

  /**
   * Update university details in MongoDB
   */
  async updateUniversity(id, payload) {
    const res = await apiClient.put(`admin/heis/${id}`, payload);
    if (res?.data?.university) {
      return res.data.university;
    }
    throw new Error(res?.message || 'Failed to update university');
  },

  /**
   * Toggle Access Status (Enabled / Disabled) in MongoDB & revoke tokens if disabled
   */
  async toggleAccessStatus(id) {
    const res = await apiClient.patch(`admin/heis/${id}/toggle-access`);
    if (res?.data?.university) {
      return res.data.university;
    }
    throw new Error(res?.message || 'Failed to toggle access status');
  },

  /**
   * Approve or Reject University Status (Approved / Pending / Rejected)
   */
  async updateStatus(id, status, remarks = '') {
    const res = await apiClient.patch(`admin/heis/${id}/status`, { status, remarks });
    if (res?.data?.university) {
      return res.data.university;
    }
    throw new Error(res?.message || 'Failed to update review status');
  },

  /**
   * Delete University from MongoDB & deactivate User
   */
  async deleteUniversity(id) {
    const res = await apiClient.delete(`admin/heis/${id}`);
    return res;
  }
};

export default universityService;
