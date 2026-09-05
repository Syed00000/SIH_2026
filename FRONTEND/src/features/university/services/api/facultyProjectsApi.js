import apiClient from '../../../../infrastructure/api/client.js';

export const DEFAULT_UNIVERSITY_CODE = 'RU001';

export const facultyProjectsApi = {
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
      if (res?.data && Array.isArray(res.data)) return res.data;
    } catch (err) { console.error('API getTeams error:', err.message); }
    return [];
  },

  async createTeam(teamData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.post(`university/teams?universityCode=${encodeURIComponent(universityCode)}`, teamData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API createTeam error:', err.message); }
    return teamData;
  },

  async updateTeam(teamId, teamData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.patch(`university/teams/${encodeURIComponent(teamId)}?universityCode=${encodeURIComponent(universityCode)}`, teamData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API updateTeam error:', err.message); }
    return { teamId, ...teamData };
  },

  async deleteTeam(teamId, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/teams/${encodeURIComponent(teamId)}?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API deleteTeam error:', err.message); }
    return { success: true, teamId };
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

  async deleteChallenge(challengeId, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(`university/challenges/${encodeURIComponent(challengeId)}?universityCode=${encodeURIComponent(universityCode)}`);
      if (res?.data) return res.data;
    } catch (err) { console.error('API deleteChallenge error:', err.message); }
    return { success: true, challengeId };
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

  async requestProjectTranche(projectId, trancheData, universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.post(`university/projects/${encodeURIComponent(projectId)}/request-tranche?universityCode=${encodeURIComponent(universityCode)}`, trancheData);
      if (res?.data) return res.data;
    } catch (err) { console.error('API requestProjectTranche error:', err.message); }
    return { success: true };
  },

  async uploadProjectPdf(projectId, file, universityCode = DEFAULT_UNIVERSITY_CODE) {
    const formData = new FormData();
    formData.append('pdf', file);
    const res = await apiClient.upload(
      `university/projects/${encodeURIComponent(projectId)}/upload-pdf?universityCode=${encodeURIComponent(universityCode)}`,
      formData
    );
    return res?.data?.data || res?.data || { success: true };
  },

  async deleteProjectPdf(projectId, type = 'prototype', universityCode = DEFAULT_UNIVERSITY_CODE) {
    try {
      const res = await apiClient.delete(
        `university/projects/${encodeURIComponent(projectId)}/pdf?type=${encodeURIComponent(type)}&universityCode=${encodeURIComponent(universityCode)}`
      );
      return res?.data?.data || res?.data || { success: true };
    } catch (err) {
      console.error('API deleteProjectPdf error:', err.message);
      return { success: false, error: err.message };
    }
  }
};

export default facultyProjectsApi;
