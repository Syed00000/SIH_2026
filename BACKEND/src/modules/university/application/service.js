import { universityDashboardRepository } from '../infrastructure/repository.js';
import { calculateDashboardMetrics } from './helpers/dashboard-metrics.helper.js';
import { UniversityChallengeService } from './services/challenge.service.js';
import { UniversityProjectService } from './services/project.service.js';
import { UniversityFacultyService } from './services/faculty.service.js';
import { UniversityPartnerApprovalService } from './services/partner-approval.service.js';

export class UniversityService {
  constructor(repository = universityDashboardRepository) {
    this.repository = repository;
    this.challengeService = new UniversityChallengeService(repository);
    this.projectService = new UniversityProjectService(repository);
    this.facultyService = new UniversityFacultyService(repository);
    this.partnerApprovalService = new UniversityPartnerApprovalService(repository);
  }

  async getDashboard(universityCode = 'RUNI-JH') {
    const code = (universityCode || 'RU001').toUpperCase();
    const university = await this.repository.findUniversityByCodeOrId(code);
    const [challengesRes, projects, faculty, activities, approvals, partners] = await Promise.all([
      this.repository.getChallengesByUniversity(code, { page: 1, limit: 100 }),
      this.repository.getProjectsByUniversity(code),
      this.repository.getFacultyByUniversity(code),
      this.repository.getActivitiesByUniversity(code, 10),
      this.repository.getApprovalsByUniversity(code),
      this.repository.getPartnersByUniversity(code)
    ]);

    return calculateDashboardMetrics({
      code,
      university,
      challengesRes,
      projects,
      faculty,
      activities,
      approvals,
      partners
    });
  }

  getChallenges(universityCode, query) { return this.challengeService.getChallenges(universityCode, query); }
  updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata) {
    return this.challengeService.updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata);
  }
  assignFaculty(challengeId, universityCode, facultyInfo) {
    return this.challengeService.assignFaculty(challengeId, universityCode, facultyInfo);
  }
  deleteChallenge(universityCode, id) {
    return this.challengeService.deleteChallenge(universityCode, id);
  }

  getProjects(universityCode) { return this.projectService.getProjects(universityCode); }
  getProjectById(universityCode, id) { return this.projectService.getProjectById(id); }
  createProject(universityCode, data) { return this.projectService.createProject(universityCode, data); }
  updateProject(universityCode, id, data) { return this.projectService.updateProject(universityCode, id, data); }
  deleteProject(universityCode, id) { return this.projectService.deleteProject(universityCode, id); }
  assignFacultyToProject(universityCode, id, facultyInfo) { return this.projectService.assignFacultyToProject(universityCode, id, facultyInfo); }
  submitPrototype(projectId, universityCode, prototypeData) { return this.projectService.submitPrototype(projectId, universityCode, prototypeData); }
  forwardPrototypeToGovernment(projectId, universityCode, remarks) { return this.projectService.forwardPrototypeToGovernment(projectId, universityCode, remarks); }
  updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks, extra) { return this.projectService.updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks, extra); }
  uploadProjectPdf(projectId, universityCode, file, type = 'prototype') { return this.projectService.uploadProjectPdf(projectId, universityCode, file, type); }
  deleteProjectPdf(projectId, universityCode, type = 'prototype') { return this.projectService.deleteProjectPdf(projectId, universityCode, type); }
  deployProject(projectId, universityCode, payload) { return this.projectService.deployProject(projectId, universityCode, payload); }

  getFaculty(universityCode) { return this.facultyService.getFaculty(universityCode); }
  createFaculty(universityCode, data) { return this.facultyService.createFaculty(universityCode, data); }
  updateFaculty(universityCode, id, data) { return this.facultyService.updateFaculty(universityCode, id, data); }
  deleteFaculty(universityCode, id) { return this.facultyService.deleteFaculty(universityCode, id); }
  getTeams(universityCode) { return this.facultyService.getTeams(universityCode); }
  createTeam(universityCode, data) { return this.facultyService.createTeam(universityCode, data); }
  updateTeam(universityCode, id, data) { return this.facultyService.updateTeam(universityCode, id, data); }
  deleteTeam(universityCode, id) { return this.facultyService.deleteTeam(universityCode, id); }

  getActivities(universityCode) { return this.partnerApprovalService.getActivities(universityCode); }
  clearActivities(universityCode) { return this.partnerApprovalService.clearActivities(universityCode); }
  getPartners(universityCode) { return this.partnerApprovalService.getPartners(universityCode); }
  getApprovals(universityCode) { return this.partnerApprovalService.getApprovals(universityCode); }
  updateApproval(approvalId, universityCode, status, remarks = '') { return this.partnerApprovalService.updateApproval(approvalId, universityCode, status, remarks); }
  deleteApproval(approvalId, universityCode) { return this.partnerApprovalService.deleteApproval(approvalId, universityCode); }
  createIndustryRequest(universityCode, payload) { return this.partnerApprovalService.createIndustryRequest(universityCode, payload); }
  getIndustryRequests(universityCode) { return this.partnerApprovalService.getIndustryRequests(universityCode); }
  updateIndustryRequestStatus(requestId, status, universityCode, extra = {}) { return this.partnerApprovalService.updateIndustryRequestStatus(requestId, status, universityCode, extra); }
  deleteIndustryRequest(requestId, universityCode) { return this.partnerApprovalService.deleteIndustryRequest(requestId, universityCode); }

  async getProfile(universityCode) {
    return await this.repository.getUniversityProfile(universityCode);
  }

  async updateProfile(universityCode, data, user) {
    return await this.repository.updateUniversityProfile(universityCode, data, user);
  }
}

export const universityService = new UniversityService();
export default universityService;
