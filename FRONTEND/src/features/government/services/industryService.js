import apiClient from '../../../infrastructure/api/client.js';

export const industryService = {
  /**
   * Fetch all industries with real server search, filtering and pagination
   */
  async getIndustries(params = {}) {
    const query = new URLSearchParams();
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.category && params.category !== 'All' && params.category !== 'All Categories') {
      query.append('category', params.category);
    }
    if (params.thematicDomain && params.thematicDomain !== 'All' && params.thematicDomain !== 'All Domains') {
      query.append('thematicDomain', params.thematicDomain);
    }
    if (params.status && params.status !== 'All' && params.status !== 'All Status') {
      query.append('status', params.status);
    }
    if (params.verificationStatus && params.verificationStatus !== 'All') {
      query.append('verificationStatus', params.verificationStatus);
    }
    if (params.district && params.district !== 'All' && params.district !== 'All Districts') {
      query.append('district', params.district);
    }
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);

    const res = await apiClient.get(`admin/industries?${query.toString()}`);
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
        totalIndustries: 0,
        activeIndustries: 0,
        disabledIndustries: 0,
        verifiedPartners: 0,
        pendingReview: 0,
        totalCsrFundsCr: 0,
        supportedProjects: 0,
        verifiedLabs: 0
      }
    };
  },

  /**
   * Public Self-Registration Application (Without applicant password)
   */
  async applyIndustry(payload) {
    const res = await apiClient.post('admin/industries/apply', payload);
    if (res?.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Failed to submit application');
  },

  /**
   * Government Admin: Approve Application & Dispatch Credentials
   */
  async approveApplication(id, payload = {}) {
    const res = await apiClient.post(`admin/industries/${id}/approve`, payload);
    if (res?.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Failed to approve application');
  },

  /**
   * Government Admin: Reject Application
   */
  async rejectApplication(id, payload = {}) {
    const res = await apiClient.post(`admin/industries/${id}/reject`, payload);
    if (res?.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Failed to reject application');
  },

  /**
   * Get single industry by ID
   */
  async getIndustryById(id) {
    const res = await apiClient.get(`admin/industries/${id}`);
    if (res?.data?.industry) {
      return res.data.industry;
    }
    throw new Error('Industry organization not found');
  },

  /**
   * Register new Industry in MongoDB & generate login credentials
   */
  async createIndustry(payload) {
    const res = await apiClient.post('admin/industries', payload);
    if (res?.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Failed to register industry');
  },

  /**
   * Update existing Industry details
   */
  async updateIndustry(id, payload) {
    const res = await apiClient.put(`admin/industries/${id}`, payload);
    if (res?.data?.industry) {
      return res.data.industry;
    }
    throw new Error(res?.message || 'Failed to update industry');
  },

  /**
   * Toggle Industry Status (Active <-> Disabled) and revoke user sessions
   */
  async toggleStatus(id) {
    const res = await apiClient.patch(`admin/industries/${id}/status`);
    if (res?.data?.industry) {
      return res.data.industry;
    }
    throw new Error(res?.message || 'Failed to toggle industry status');
  },

  /**
   * Regenerate / Reset Password for an industry
   */
  async resetPassword(id) {
    const res = await apiClient.post(`admin/industries/${id}/reset-password`);
    if (res?.data) {
      return res.data;
    }
    throw new Error(res?.message || 'Failed to reset password');
  },

  /**
   * Delete Industry organization
   */
  async deleteIndustry(id) {
    const res = await apiClient.delete(`admin/industries/${id}`);
    return res;
  }
};

export default industryService;
