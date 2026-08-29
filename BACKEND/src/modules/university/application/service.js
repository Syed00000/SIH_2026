import { universityDashboardRepository } from '../infrastructure/repository.js';
import { NotFoundError } from '../../../shared/errors/AppError.js';

export class UniversityService {
  async getDashboard(universityCode = 'RUNI-JH') {
    const code = (universityCode || 'RU001').toUpperCase();
    const university = await universityDashboardRepository.findUniversityByCodeOrId(code);
    const [challengesRes, projects, faculty, activities, approvals, partners] = await Promise.all([
      universityDashboardRepository.getChallengesByUniversity(code, { page: 1, limit: 100 }),
      universityDashboardRepository.getProjectsByUniversity(code),
      universityDashboardRepository.getFacultyByUniversity(code),
      universityDashboardRepository.getActivitiesByUniversity(code, 10),
      universityDashboardRepository.getApprovalsByUniversity(code),
      universityDashboardRepository.getPartnersByUniversity(code)
    ]);

    const allChallenges = (challengesRes.challenges || []).map((c) => ({
      id: c.challengeId,
      challengeId: c.challengeId,
      title: c.title,
      domain: c.domain,
      district: c.district,
      priority: c.priority,
      status: c.status,
      actionLabel: 'View',
      actionText: 'View',
      assignedOn: c.assignedOn,
      deadline: c.deadline,
      problemStatement: c.problemStatement,
      affectedPopulation: c.affectedPopulation,
      suggestedFaculty: c.suggestedFaculty,
      assignedFaculty: c.assignedFaculty,
      locationDetails: c.locationDetails
    }));

    const reviewNeededCount = allChallenges.filter((c) => c.status === 'Review' || c.status === 'Pending').length;
    const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
    const activeProjectsCount = projects.filter((p) => p.status !== 'Completed' && p.status !== 'Archived').length;
    const delayedProjectsCount = projects.filter((p) => p.status === 'Delayed').length;
    const onTrackCount = projects.filter((p) => p.status === 'On Track' || p.status === 'In Progress').length;
    const atRiskCount = projects.filter((p) => p.status === 'At Risk' || p.status === 'Planning').length;
    const completedCount = projects.filter((p) => p.status === 'Completed').length;
    const facultyCount = faculty.length;
    const onLeaveCount = faculty.filter((f) => f.availabilityStatus === 'On Leave').length;

    const totalProj = projects.length;
    const liveActivities = activities || [];

    // Group domains directly from real challenges
    const domainMap = {};
    allChallenges.forEach((c) => {
      if (c.domain) {
        domainMap[c.domain] = (domainMap[c.domain] || 0) + 1;
      }
    });

    const topDomains = Object.keys(domainMap).map((dom) => ({
      name: dom,
      count: domainMap[dom],
      percent: allChallenges.length > 0 ? Math.round((domainMap[dom] / allChallenges.length) * 100) : 0
    }));

    return {
      name: university?.name || 'University Innovation Portal',
      shortName: university?.shortName || code,
      district: university?.district || '',
      university: {
        code,
        name: university?.name || 'University Innovation Portal',
        shortName: university?.shortName || code,
        district: university?.district || '',
        nodalOfficer: university?.nodalOfficer || null
      },
      challenges: allChallenges,
      kpis: {
        assignedChallenges: { total: challengesRes.total || allChallenges.length, reviewNeeded: reviewNeededCount },
        activeProjects: { total: activeProjectsCount, delayed: delayedProjectsCount },
        facultyMentors: { total: facultyCount, onLeave: onLeaveCount },
        pendingApprovals: { total: pendingApprovalsCount, note: 'Requires action' },
        industryPartners: { total: partners.length, note: 'Active collaborations' }
      },
      pendingActions: [
        ...(reviewNeededCount > 0
          ? [{ id: 'pa-1', title: 'Challenges need review', count: reviewNeededCount, actionText: 'Review Now', actionType: 'review_challenges', variant: 'blue' }]
          : []),
        ...(pendingApprovalsCount > 0
          ? [{ id: 'pa-2', title: 'Approvals pending action', count: pendingApprovalsCount, actionText: 'Review Approvals', actionType: 'pending_approvals', variant: 'amber' }]
          : [])
      ],
      projectProgressBreakdown: { onTrack: onTrackCount, atRisk: atRiskCount, delayed: delayedProjectsCount, completed: completedCount, total: totalProj },
      projectProgress: {
        totalProjects: totalProj,
        total: totalProj,
        breakdown: [
          { status: 'On Track', count: onTrackCount, percentage: totalProj > 0 ? Math.round((onTrackCount / totalProj) * 100) : 0, color: '#0f172a' },
          { status: 'At Risk', count: atRiskCount, percentage: totalProj > 0 ? Math.round((atRiskCount / totalProj) * 100) : 0, color: '#64748b' },
          { status: 'Delayed', count: delayedProjectsCount, percentage: totalProj > 0 ? Math.round((delayedProjectsCount / totalProj) * 100) : 0, color: '#e11d48' },
          { status: 'Completed', count: completedCount, percentage: totalProj > 0 ? Math.round((completedCount / totalProj) * 100) : 0, color: '#10b981' }
        ]
      },
      topDomains,
      recentActivity: liveActivities,
      recentActivities: liveActivities
    };
  }

  async getChallenges(universityCode, query) {
    const res = await universityDashboardRepository.getChallengesByUniversity(universityCode, query);
    const mapped = (res.challenges || []).map((c) => ({
      ...c,
      id: c.challengeId,
      actionText: 'View'
    }));
    return { ...res, challenges: mapped };
  }

  async updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata) {
    const updated = await universityDashboardRepository.updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata);
    if (!updated) throw new NotFoundError('Challenge not found');
    return updated;
  }

  async assignFaculty(challengeId, universityCode, facultyInfo) {
    const updated = await universityDashboardRepository.assignFaculty(challengeId, universityCode, facultyInfo);
    if (!updated) throw new NotFoundError('Challenge not found');
    return updated;
  }

  async getFaculty(universityCode) { return await universityDashboardRepository.getFacultyByUniversity(universityCode); }
  async createFaculty(universityCode, data) { return await universityDashboardRepository.createFaculty(universityCode, data); }
  async updateFaculty(universityCode, id, data) { return await universityDashboardRepository.updateFaculty(universityCode, id, data); }
  async deleteFaculty(universityCode, id) { return await universityDashboardRepository.deleteFaculty(universityCode, id); }

  async getProjects(universityCode) { return await universityDashboardRepository.getProjectsByUniversity(universityCode); }
  async createProject(universityCode, data) { return await universityDashboardRepository.createProject(universityCode, data); }
  async updateProject(universityCode, id, data) { return await universityDashboardRepository.updateProject(universityCode, id, data); }
  async deleteProject(universityCode, id) { return await universityDashboardRepository.deleteProject(universityCode, id); }

  async getTeams(universityCode) { return await universityDashboardRepository.getTeamsByUniversity(universityCode); }
  async getPartners(universityCode) { return await universityDashboardRepository.getPartnersByUniversity(universityCode); }
  async getApprovals(universityCode) { return await universityDashboardRepository.getApprovalsByUniversity(universityCode); }
  async updateApproval(approvalId, universityCode, status) { return await universityDashboardRepository.updateApprovalStatus(approvalId, universityCode, status); }

  async getProfile(universityCode) {
    return await universityDashboardRepository.getUniversityProfile(universityCode);
  }

  async updateProfile(universityCode, data, user) {
    return await universityDashboardRepository.updateUniversityProfile(universityCode, data, user);
  }
}

export const universityService = new UniversityService();
export default universityService;
