import { universityApiService } from '../../university/services/universityApiService.js';
import apiClient from '../../../infrastructure/api/client.js';

export const facultyApiService = {
  // Fetch all data for this faculty
  async getFacultyData(facultyEmail, universityCode = 'RU001') {
    const cleanEmail = (facultyEmail || '').toLowerCase().trim();
    const [allChallenges, allProjects, allFaculty, allApprovals, allActivities] = await Promise.all([
      universityApiService.getAssignedChallenges(universityCode),
      universityApiService.getProjects(universityCode),
      universityApiService.getFaculty(universityCode),
      universityApiService.getApprovals(universityCode),
      apiClient.get(`university/notifications?universityCode=${encodeURIComponent(universityCode)}`).then((r) => r?.data?.data || []).catch(() => [])
    ]);

    const challengesList = allChallenges?.challenges || (Array.isArray(allChallenges) ? allChallenges : []);
    const projectsList = Array.isArray(allProjects) ? allProjects : [];
    const facultyList = Array.isArray(allFaculty) ? allFaculty : [];
    const approvalsList = Array.isArray(allApprovals) ? allApprovals : [];

    // Find current faculty profile
    const currentFaculty = facultyList.find(
      (f) => f.email?.toLowerCase() === cleanEmail || f.name?.toLowerCase().includes(cleanEmail.split('@')[0])
    ) || {
      name: 'Faculty Mentor',
      email: cleanEmail,
      designation: 'Faculty Mentor',
      department: 'Engineering & Technology',
      universityCode
    };

    const facultyNameLower = (currentFaculty.name || '').toLowerCase();

    // Filter challenges assigned to this faculty mentor
    const myChallenges = challengesList.filter((c) => {
      const mentorEmail = c.assignedFaculty?.email?.toLowerCase() || '';
      const mentorName = (c.assignedFaculty?.name || c.assignedUniversity?.mentorName || '').toLowerCase();
      return (
        mentorEmail === cleanEmail ||
        (facultyNameLower && mentorName && (mentorName.includes(facultyNameLower) || facultyNameLower.includes(mentorName)))
      );
    });

    // Filter projects mentored by this faculty
    const filteredProjects = projectsList.filter((p) => {
      const mentorEmail = p.facultyMentor?.email?.toLowerCase() || '';
      const mentorName = (p.facultyMentor?.name || p.leadMentor || '').toLowerCase();
      return (
        mentorEmail === cleanEmail ||
        (facultyNameLower && mentorName && (mentorName.includes(facultyNameLower) || facultyNameLower.includes(mentorName)))
      );
    });

    const activeProjectList = filteredProjects.length > 0 ? filteredProjects : projectsList;

    // Cross-link latest remarks and feedback from university approvals onto project objects
    const enrichedProjects = activeProjectList.map((p) => {
      const matchingApproval = approvalsList.find(
        (a) =>
          (a.projectId && (a.projectId === p.projectId || a.projectId === p._id)) ||
          (a.challengeId && (a.challengeId === p.challengeId || a.challengeId === p.id)) ||
          (a.approvalId && a.approvalId === `APP-${p.projectId}`)
      );

      const latestRemarks =
        p.adminRemarks ||
        matchingApproval?.adminRemarks ||
        p.universityRemarks ||
        '';

      return {
        ...p,
        adminRemarks: latestRemarks,
        universityRemarks: latestRemarks,
        matchingApproval
      };
    });

    // Revisions requested by University Authority
    const revisionsList = approvalsList.filter(
      (a) => a.status === 'Changes Required' || a.status === 'Changes Requested' || Boolean(a.adminRemarks && a.status !== 'Approved')
    );

    return {
      faculty: currentFaculty,
      challenges: myChallenges.length > 0 ? myChallenges : challengesList,
      projects: enrichedProjects,
      approvals: approvalsList,
      revisions: revisionsList,
      activities: allActivities || []
    };
  },

  async resubmitRevision(approvalId, universityCode = 'RU001', notes = '', extraData = {}) {
    try {
      const res = await universityApiService.updateApprovalStatus(
        approvalId,
        universityCode,
        'Pending',
        notes ? `Faculty Revision: ${notes}` : 'Revised proposal resubmitted by Faculty',
        extraData
      );
      return res;
    } catch (err) {
      console.error('API resubmitRevision error:', err.message);
      throw err;
    }
  },

  async updateProject(projectId, updateData) {
    return universityApiService.updateProject(projectId, updateData);
  },

  async submitPrototype(projectId, data) {
    try {
      const res = await apiClient.post(`university/projects/${encodeURIComponent(projectId)}/prototype?universityCode=RU001`, data);
      if (res?.data) return { success: true, ...res.data };
      return { success: false };
    } catch (err) {
      console.error('API submitPrototype error:', err.message);
      return { success: false };
    }
  },

  async savePrototypeDraft(projectId, prototypeData) {
    // Simply updates the project with the latest blocks and sets status to Drafting
    try {
      const res = await this.updateProject(projectId, { 
        prototypeData,
        prototypeStatus: 'Drafting'
      });
      return { success: true, projectId, status: 'Drafting' };
    } catch (err) {
      console.error('API savePrototypeDraft error:', err.message);
      return { success: false };
    }
  },

  async deletePrototypeDraft(projectId) {
    try {
      const res = await this.updateProject(projectId, { 
        prototypeData: null,
        prototypeStatus: 'Not Started'
      });
      return { success: true, projectId, status: 'Not Started' };
    } catch (err) {
      console.error('API deletePrototypeDraft error:', err.message);
      return { success: false };
    }
  },

  async getNotifications(universityCode = 'RU001') {
    try {
      const res = await apiClient.get(`university/notifications?universityCode=${encodeURIComponent(universityCode)}`);
      return res?.data?.data || [];
    } catch (err) {
      console.error('API getNotifications error:', err.message);
      return [];
    }
  },

  async clearNotifications(universityCode = 'RU001') {
    try {
      await apiClient.delete(`university/notifications?universityCode=${encodeURIComponent(universityCode)}`);
      return { success: true };
    } catch (err) {
      console.error('API clearNotifications error:', err.message);
      return { success: false };
    }
  }
};

export default facultyApiService;
