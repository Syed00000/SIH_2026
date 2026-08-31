import apiClient from '../../../infrastructure/api/client.js';

export const DEFAULT_UNIVERSITY_CODE = 'RU001';

export const universityApiService = {
  async getDashboardSummary(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/dashboard?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data && res.data.kpis) return res.data;
    } catch (err) { console.error('API getDashboardSummary error:', err.message); }
    return {
      name: 'Ranchi University',
      kpis: {
        assignedChallenges: { total: 0, reviewNeeded: 0 },
        activeProjects: { total: 0, delayed: 0 },
        facultyMentors: { total: 0, onLeave: 0 },
        pendingApprovals: { total: 0 },
        industryPartners: { total: 0 }
      },
      challenges: [],
      projects: [],
      faculty: []
    };
  },

  async getAssignedChallenges(universityCode = DEFAULT_UNIVERSITY_CODE, params = {}) {
    try {
      const query = new URLSearchParams({ universityCode, ...params });
      const res = await apiClient.get(`university/challenges?${query.toString()}`);
      if (res?.data && (res.data.challenges?.length !== undefined || Array.isArray(res.data))) return res.data;
    } catch (err) { console.error('API getAssignedChallenges error:', err.message); }
    return { challenges: [], total: 0 };
  },

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata = {}) {
    try {
      const res = await apiClient.patch(`university/challenges/${challengeId}/status?universityCode=${encodeURIComponent(universityCode)}`, {
        status, actionLabel, ...metadata
      });
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateChallengeStatus error:', err.message); }
    return { challengeId, status, actionLabel };
  },

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    try {
      const res = await apiClient.post(`university/challenges/${challengeId}/assign-faculty?universityCode=${encodeURIComponent(universityCode)}`, {
        facultyInfo
      });
      if (res?.data) return res.data;
    } catch (err) { console.error('API assignFaculty error:', err.message); }
    return { challengeId, facultyInfo, status: 'Accepted' };
  },

  async getFaculty(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/faculty?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data && Array.isArray(res.data)) return res.data;
    } catch (err) { console.error('API getFaculty error:', err.message); }
    return [];
  },

  async createFaculty(facultyData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.post(`university/faculty?universityCode=${encodeURIComponent(universityCode)}`, facultyData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API createFaculty error:', err.message); }
    return facultyData;
  },

  async updateFaculty(facultyId, updateData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.patch(`university/faculty/${encodeURIComponent(facultyId)}?universityCode=${encodeURIComponent(universityCode)}`, updateData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateFaculty error:', err.message); }
    return { facultyId, ...updateData };
  },

  async deleteFaculty(facultyId, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/faculty/${encodeURIComponent(facultyId)}?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API deleteFaculty error:', err.message); }
    return { success: true, facultyId };
  },

  async getTeams(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/teams?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API getTeams error:', err.message); }
    return [];
  },

  async getProjects(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/projects?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data && Array.isArray(res.data)) return res.data;
    } catch (err) { console.error('API getProjects error:', err.message); }
    return [];
  },

  async createProject(projectData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.post(`university/projects?universityCode=${encodeURIComponent(universityCode)}`, projectData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API createProject error:', err.message); }
    return projectData;
  },

  async updateProject(projectId, updateData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.patch(`university/projects/${encodeURIComponent(projectId)}?universityCode=${encodeURIComponent(universityCode)}`, updateData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateProject error:', err.message); }
    return { projectId, ...updateData };
  },

  async deleteProject(projectId, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/projects/${encodeURIComponent(projectId)}?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API deleteProject error:', err.message); }
    return { success: true, projectId };
  },

  async assignFacultyToProject(projectId, facultyInfo, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.post(`university/projects/${encodeURIComponent(projectId)}/assign-faculty?universityCode=${encodeURIComponent(universityCode)}`, {
        facultyInfo
      });
      if (res?.data) return res.data;
    } catch (err) { console.error('API assignFacultyToProject error:', err.message); }
    return { projectId, facultyInfo, status: 'In Progress' };
  },

  async getPartners(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/partners?universityCode=${encodeURIComponent(universityCode)}`);
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

  async updateApprovalStatus(approvalId, universityCode, status, adminRemarks = '') {
    try {
      const res = await apiClient.patch(
        `university/approvals/${approvalId}?universityCode=${encodeURIComponent(universityCode)}`,
        { status, adminRemarks }
      );
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateApprovalStatus error:', err.message); }
    return { approvalId, status, adminRemarks };
  },

  async deleteApproval(approvalId, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/approvals/${approvalId}?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API deleteApproval error:', err.message); }
    return { success: false };
  },

  async getPartners(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/partners?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data && Array.isArray(res.data)) return res.data;
    } catch (err) { console.error('API getPartners error:', err.message); }
    return [];
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
  },

  async getReports(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/reports?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API getReports error:', err.message); }
    return [];
  },

  async getProfile(universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.get(`university/profile?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API getProfile error:', err.message); }
    return null;
  },

  async updateProfile(profileData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.put(`university/profile?universityCode=${encodeURIComponent(universityCode)}`, profileData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateProfile error:', err.message); }
    return null;
  }
};

export default universityApiService;
