import apiClient from '../../../../infrastructure/api/client.js';

export const DEFAULT_UNIVERSITY_CODE = 'RU001';

export const partnersApprovalsApi = {
  async getPartners(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/partners?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data && Array.isArray(res.data)) return res.data;
      if (res?.data) return res.data;
    } catch (err) { console.error('API getPartners error:', err.message); }
    return [];
  },

  async getActivities(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/activities?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API getActivities error:', err.message); }
    return [];
  },

  async clearActivities(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.post(`university/activities/clear?universityCode=${encodeURIComponent(universityCode)}`, { universityCode });
      if (res?.data) return res.data;
    } catch (err) { console.error('API clearActivities error:', err.message); }
    return { success: true };
  },

  async getApprovals(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/approvals?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API getApprovals error:', err.message); }
    return [];
  },

  async updateApproval(approvalId, universityCode, status) {
    try {
      const res = await apiClient.patch(`university/approvals/${approvalId}?universityCode=${encodeURIComponent(universityCode)}`, { status });
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateApproval error:', err.message); }
    return { approvalId, status };
  },

  async updateApprovalStatus(approvalId, universityCode, status, adminRemarks = '', extraData = {}) {
    try {
      const res = await apiClient.patch(
        `university/approvals/${approvalId}?universityCode=${encodeURIComponent(universityCode)}`,
        { status, adminRemarks, ...extraData }
      );
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateApprovalStatus error:', err.message); }
    return { approvalId, status, adminRemarks, ...extraData };
  },

  async deleteApproval(approvalId, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/approvals/${approvalId}?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API deleteApproval error:', err.message); }
    return { success: false };
  },

  async createIndustryRequest(payload, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.post(`university/industry-request?universityCode=${encodeURIComponent(universityCode)}`, payload);
      if (res?.data) return res.data;
    } catch (err) { console.error('API createIndustryRequest error:', err.message); }
    return { success: false };
  },

  async getIndustryRequests(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/industry-requests?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data?.data && Array.isArray(res.data.data)) return res.data.data;
      if (res?.data && Array.isArray(res.data)) return res.data;
    } catch (err) { console.error('API getIndustryRequests error:', err.message); }
    return [];
  },

  async updateIndustryRequestStatus(requestId, status, universityCode = DEFAULT_UNIVERSITY_CODE, extra = {}) {
    try {
      const payload = typeof status === 'object' ? status : { status, ...extra };
      const res = await apiClient.patch(
        `university/industry-requests/${encodeURIComponent(requestId)}/status?universityCode=${encodeURIComponent(universityCode)}`,
        payload
      );
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateIndustryRequestStatus error:', err.message); }
    return { success: false };
  },

  async deleteIndustryRequest(requestId, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/industry-requests/${encodeURIComponent(requestId)}?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API deleteIndustryRequest error:', err.message); }
    return { success: false };
  },

  async forwardPrototypeToGovernment(projectId, universityCode = DEFAULT_UNIVERSITY_CODE, remarks = '') {
    try {
      const res = await apiClient.post(
        `university/projects/${encodeURIComponent(projectId)}/forward-to-government?universityCode=${encodeURIComponent(universityCode)}`,
        { remarks }
      );
      if (res?.data) return res.data;
    } catch (err) { console.error('API forwardPrototypeToGovernment error:', err.message); }
    return { success: false };
  },

  async updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks = '', universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.patch(
        `university/projects/${encodeURIComponent(projectId)}/government-prototype-status?universityCode=${encodeURIComponent(universityCode)}`,
        { status, trlLevel, remarks }
      );
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateGovernmentPrototypeStatus error:', err.message); }
    return { success: false };
  }
};

export default partnersApprovalsApi;
