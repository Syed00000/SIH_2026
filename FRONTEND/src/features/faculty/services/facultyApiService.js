import { universityApiService } from '../../university/services/universityApiService.js';
import apiClient from '../../../infrastructure/api/client.js';

export const facultyApiService = {
  // Fetch all data for this faculty
  async getFacultyData(facultyEmail, universityCode = 'RU001') {
    const cleanEmail = (facultyEmail || '').toLowerCase().trim();
    const [allChallenges, allProjects, allFaculty] = await Promise.all([
      universityApiService.getAssignedChallenges(universityCode),
      universityApiService.getProjects(universityCode),
      universityApiService.getFaculty(universityCode)
    ]);

    const challengesList = allChallenges?.challenges || (Array.isArray(allChallenges) ? allChallenges : []);
    const projectsList = Array.isArray(allProjects) ? allProjects : [];
    const facultyList = Array.isArray(allFaculty) ? allFaculty : [];

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
    const myProjects = projectsList.filter((p) => {
      const mentorEmail = p.facultyMentor?.email?.toLowerCase() || '';
      const mentorName = (p.facultyMentor?.name || p.leadMentor || '').toLowerCase();
      return (
        mentorEmail === cleanEmail ||
        (facultyNameLower && mentorName && (mentorName.includes(facultyNameLower) || facultyNameLower.includes(mentorName)))
      );
    });

    return {
      faculty: currentFaculty,
      challenges: myChallenges.length > 0 ? myChallenges : challengesList,
      projects: myProjects.length > 0 ? myProjects : projectsList
    };
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
  }
};

export default facultyApiService;
