import apiClient from '../../../infrastructure/api/client.js';

export const industryService = {
  async getIndustries(params = {}) {
    try {
      const cleanParams = {};
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined && params[k] !== null && params[k] !== '') {
          const val = params[k];
          // Keep numbers (page, limit) as-is; skip "All X" strings
          if (typeof val === 'number') {
            cleanParams[k] = val;
          } else if (typeof val === 'string' && val !== 'All' && !val.startsWith('All ')) {
            cleanParams[k] = val;
          }
        }
      });
      const query = new URLSearchParams(cleanParams);
      const res = await apiClient.get(`government/industries?${query.toString()}`);
      if (res?.data) {
        const payload = res.data.data || res.data;
        const records = Array.isArray(payload.records) ? payload.records : (Array.isArray(payload) ? payload : []);
        const total = payload.total ?? records.length;
        const kpis = payload.kpis || {
          totalIndustries: total,
          activeIndustries: records.filter(r => r.status === 'Active').length,
          pendingReview: records.filter(r => r.status === 'Pending').length,
          disabledIndustries: records.filter(r => r.accessStatus === 'Disabled').length,
          totalCsrFundsCr: Number(records.reduce((acc, curr) => acc + (curr.financials?.csrCommittedCr || 0), 0).toFixed(2))
        };

        return {
          records,
          total,
          page: payload.page || params.page || 1,
          limit: payload.limit || params.limit || 10,
          totalPages: payload.totalPages || Math.ceil(total / (params.limit || 10)),
          kpis
        };
      }
    } catch (err) {
      console.error('API getIndustries error:', err.message);
    }
    return { records: [], total: 0, kpis: { totalIndustries: 0, activeIndustries: 0, pendingReview: 0, disabledIndustries: 0, totalCsrFundsCr: 0 } };
  },

  async createIndustry(data) {
    try {
      const res = await apiClient.post('government/industries', data);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('API createIndustry error:', err.message);
      throw err;
    }
  },

  async toggleStatus(industryId, status) {
    try {
      const res = await apiClient.patch(`government/industries/${industryId}/status`, { status });
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('API toggleStatus error:', err.message);
      throw err;
    }
  },

  async approveApplication(industryId, remarks = '') {
    try {
      const res = await apiClient.post(`government/industries/${industryId}/approve`, { remarks });
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('API approveApplication error:', err.message);
      throw err;
    }
  },

  async rejectApplication(industryId, reason = '') {
    try {
      const res = await apiClient.post(`government/industries/${industryId}/reject`, { reason });
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('API rejectApplication error:', err.message);
      throw err;
    }
  },

  async deleteIndustry(industryId) {
    try {
      const res = await apiClient.delete(`government/industries/${industryId}`);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('API deleteIndustry error:', err.message);
      throw err;
    }
  },

  async resetPassword(industryId) {
    try {
      const res = await apiClient.post(`government/industries/${industryId}/reset-password`, {});
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('API resetPassword error:', err.message);
      throw err;
    }
  },

  async updateIndustry(industryId, data) {
    try {
      const res = await apiClient.put(`government/industries/${industryId}`, data);
      return res?.data?.data || res?.data;
    } catch (err) {
      console.error('API updateIndustry error:', err.message);
      throw err;
    }
  }
};

export default industryService;
