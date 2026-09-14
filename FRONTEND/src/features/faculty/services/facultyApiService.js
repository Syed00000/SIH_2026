import { universityApiService } from '../../university/services/universityApiService.js';
import apiClient from '../../../infrastructure/api/client.js';

export const facultyApiService = {
  // Fetch all data for this faculty
  async getFacultyData(userOrEmail, universityCode = 'RU001') {
    const cleanEmail = (typeof userOrEmail === 'string' ? userOrEmail : (userOrEmail?.email || '')).toLowerCase().trim();
    const userName = (typeof userOrEmail === 'object' ? (userOrEmail?.fullName || userOrEmail?.name || '') : '').toLowerCase().trim();

    const [allChallenges, allProjects, allFaculty, allApprovals, allActivities, allTeamsRes] = await Promise.all([
      universityApiService.getAssignedChallenges(universityCode),
      universityApiService.getProjects(universityCode),
      universityApiService.getFaculty(universityCode),
      universityApiService.getApprovals(universityCode),
      apiClient.get(`university/notifications?universityCode=${encodeURIComponent(universityCode)}`).then((r) => r?.data?.data || []).catch(() => []),
      universityApiService.getTeams(universityCode)
    ]);

    const challengesList = allChallenges?.challenges || (Array.isArray(allChallenges) ? allChallenges : []);
    const projectsList = Array.isArray(allProjects) ? allProjects : [];
    const facultyList = Array.isArray(allFaculty) ? allFaculty : [];
    const approvalsList = Array.isArray(allApprovals) ? allApprovals : [];
    const teamsList = Array.isArray(allTeamsRes) ? allTeamsRes : [];

    // Find current faculty profile
    const currentFaculty = facultyList.find((f) => {
      const fEmail = (f.email || '').toLowerCase().trim();
      const fName = (f.name || '').toLowerCase().trim();
      if (cleanEmail && fEmail === cleanEmail) return true;
      if (userName && (fName === userName || fName.includes(userName) || userName.includes(fName))) return true;
      if (cleanEmail && fName.includes(cleanEmail.split('@')[0])) return true;
      return false;
    }) || {
      name: (typeof userOrEmail === 'object' && (userOrEmail?.fullName || userOrEmail?.name)) || 'Faculty Mentor',
      email: cleanEmail,
      designation: (typeof userOrEmail === 'object' && userOrEmail?.profile?.designation) || 'Associate Professor',
      department: (typeof userOrEmail === 'object' && userOrEmail?.profile?.department) || 'Electrical & Electronics Engineering',
      universityCode
    };

    const candidateNames = [
      currentFaculty.name?.toLowerCase().trim(),
      userName,
      cleanEmail ? cleanEmail.split('@')[0] : ''
    ].filter(Boolean);

    const isMentorMatch = (mentorName, mentorEmail) => {
      const mEmail = (mentorEmail || '').toLowerCase().trim();
      const mName = (mentorName || '').toLowerCase().trim();
      if (cleanEmail && mEmail && mEmail === cleanEmail) return true;
      if (mName && candidateNames.some((cn) => cn && (mName === cn || mName.includes(cn) || cn.includes(mName)))) return true;
      return false;
    };

    // Filter challenges assigned to this faculty mentor
    const myChallenges = challengesList.filter((c) => {
      const mentorEmail = c.assignedFaculty?.email || c.assignedUniversity?.mentorEmail || '';
      const mentorName = c.assignedFaculty?.name || c.assignedUniversity?.mentorName || '';
      return isMentorMatch(mentorName, mentorEmail);
    });

    // Filter projects mentored by this faculty
    const filteredProjects = projectsList.filter((p) => {
      const mentorEmail = p.facultyMentor?.email || '';
      const mentorName = p.facultyMentor?.name || p.leadMentor || '';
      return isMentorMatch(mentorName, mentorEmail);
    });

    // Ensure every assigned challenge appears as an active project card on the faculty dashboard
    const projectChallengeIds = new Set(filteredProjects.map((p) => p.challengeId || p.projectId).filter(Boolean));
    const activeProjectList = [...filteredProjects];

    myChallenges.forEach((c) => {
      const cid = c.challengeId || c.id || c._id;
      if (cid && !projectChallengeIds.has(cid)) {
        projectChallengeIds.add(cid);
        activeProjectList.push({
          projectId: String(cid).startsWith('CHL-JH-2026-') ? String(cid).replace('CHL-JH-2026-', 'PRJ-') : `PRJ-${cid}`,
          challengeId: cid,
          title: c.title || 'Ground Problem Statement',
          problemStatement: c.problemStatement || c.description || c.title,
          domain: c.domain || c.category || 'Technology',
          status: c.status === 'Accepted' ? 'Proposal Stage' : (c.status || 'Proposal Stage'),
          priority: c.priority || 'Medium',
          location: c.location || { district: c.district || 'Ranchi' },
          leadMentor: currentFaculty.name || (typeof userOrEmail === 'object' && userOrEmail?.fullName) || 'Lead Faculty Mentor',
          facultyMentor: currentFaculty,
          universityCode,
          sanctionedBudget: null,
          disbursedAmount: '0',
          prototypeStatus: 'Not Started',
          governmentStatus: 'Pending',
          teamMembers: [],
          studentTeam: '',
          milestones: c.milestones || [],
          mediaUrls: c.mediaUrls || [],
          allocatedBy: c.allocatedBy || c.nodalOfficer || null,
          submitter: c.submitter || null
        });
      }
    });

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
      challenges: myChallenges,
      allChallenges: challengesList,
      projects: enrichedProjects,
      allProjects: projectsList,
      teams: teamsList,
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
  },

  async deleteProject(projectId, universityCode = 'RU001') {
    return universityApiService.deleteProject(projectId, universityCode);
  },
  async deleteChallenge(challengeId, universityCode = 'RU001') {
    return universityApiService.deleteChallenge(challengeId, universityCode);
  },
  async getTeams(universityCode = 'RU001') {
    return universityApiService.getTeams(universityCode);
  },
  async createTeam(teamData, universityCode = 'RU001') {
    return universityApiService.createTeam(teamData, universityCode);
  },
  async updateTeam(teamId, teamData, universityCode = 'RU001') {
    return universityApiService.updateTeam(teamId, teamData, universityCode);
  },
  async deleteTeam(teamId, universityCode = 'RU001') {
    return universityApiService.deleteTeam(teamId, universityCode);
  },
  async uploadProjectPdf(projectId, file, universityCode = 'RU001') {
    return universityApiService.uploadProjectPdf(projectId, file, universityCode);
  }
};

export default facultyApiService;
