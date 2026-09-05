import { universityService } from '../application/service.js';
import { createChallengeProjectHandler } from './handlers/challenge-project.handler.js';
import { createFacultyTeamHandler } from './handlers/faculty-team.handler.js';
import { createPartnerApprovalHandler } from './handlers/partner-approval.handler.js';
import { createDashboardProfileHandler } from './handlers/dashboard-profile.handler.js';

export class UniversityController {
  constructor(service = universityService) {
    this.service = service;
    this.challengeProjectHandler = createChallengeProjectHandler(service);
    this.facultyTeamHandler = createFacultyTeamHandler(service);
    this.partnerApprovalHandler = createPartnerApprovalHandler(service);
    this.dashboardProfileHandler = createDashboardProfileHandler(service);
  }

  getDashboard(req, res, next) { return this.dashboardProfileHandler.getDashboard(req, res, next); }
  getChallenges(req, res, next) { return this.challengeProjectHandler.getChallenges(req, res, next); }
  updateChallengeStatus(req, res, next) { return this.challengeProjectHandler.updateChallengeStatus(req, res, next); }
  assignFaculty(req, res, next) { return this.challengeProjectHandler.assignFaculty(req, res, next); }
  deleteChallenge(req, res, next) { return this.challengeProjectHandler.deleteChallenge(req, res, next); }

  getFaculty(req, res, next) { return this.facultyTeamHandler.getFaculty(req, res, next); }
  createFaculty(req, res, next) { return this.facultyTeamHandler.createFaculty(req, res, next); }
  updateFaculty(req, res, next) { return this.facultyTeamHandler.updateFaculty(req, res, next); }
  deleteFaculty(req, res, next) { return this.facultyTeamHandler.deleteFaculty(req, res, next); }
  getTeams(req, res, next) { return this.facultyTeamHandler.getTeams(req, res, next); }
  createTeam(req, res, next) { return this.facultyTeamHandler.createTeam(req, res, next); }
  updateTeam(req, res, next) { return this.facultyTeamHandler.updateTeam(req, res, next); }
  deleteTeam(req, res, next) { return this.facultyTeamHandler.deleteTeam(req, res, next); }

  getProjects(req, res, next) { return this.challengeProjectHandler.getProjects(req, res, next); }
  createProject(req, res, next) { return this.challengeProjectHandler.createProject(req, res, next); }
  updateProject(req, res, next) { return this.challengeProjectHandler.updateProject(req, res, next); }
  deleteProject(req, res, next) { return this.challengeProjectHandler.deleteProject(req, res, next); }
  assignFacultyToProject(req, res, next) { return this.challengeProjectHandler.assignFacultyToProject(req, res, next); }
  submitPrototype(req, res, next) { return this.challengeProjectHandler.submitPrototype(req, res, next); }
  forwardPrototypeToGovernment(req, res, next) { return this.challengeProjectHandler.forwardPrototypeToGovernment(req, res, next); }
  updateGovernmentPrototypeStatus(req, res, next) { return this.challengeProjectHandler.updateGovernmentPrototypeStatus(req, res, next); }
  requestTranche(req, res, next) { return this.challengeProjectHandler.requestTranche(req, res, next); }
  uploadProjectPdf(req, res, next) { return this.challengeProjectHandler.uploadProjectPdf(req, res, next); }
  deleteProjectPdf(req, res, next) { return this.challengeProjectHandler.deleteProjectPdf(req, res, next); }
  deployProject(req, res, next) { return this.challengeProjectHandler.deployProject(req, res, next); }

  getPartners(req, res, next) { return this.partnerApprovalHandler.getPartners(req, res, next); }
  getActivities(req, res, next) { return this.dashboardProfileHandler.getActivities(req, res, next); }
  clearActivities(req, res, next) { return this.dashboardProfileHandler.clearActivities(req, res, next); }
  getApprovals(req, res, next) { return this.partnerApprovalHandler.getApprovals(req, res, next); }
  updateApproval(req, res, next) { return this.partnerApprovalHandler.updateApproval(req, res, next); }
  deleteApproval(req, res, next) { return this.partnerApprovalHandler.deleteApproval(req, res, next); }
  createIndustryRequest(req, res, next) { return this.partnerApprovalHandler.createIndustryRequest(req, res, next); }
  getIndustryRequests(req, res, next) { return this.partnerApprovalHandler.getIndustryRequests(req, res, next); }
  updateIndustryRequestStatus(req, res, next) { return this.partnerApprovalHandler.updateIndustryRequestStatus(req, res, next); }
  deleteIndustryRequest(req, res, next) { return this.partnerApprovalHandler.deleteIndustryRequest(req, res, next); }

  getReports(req, res, next) { return this.dashboardProfileHandler.getReports(req, res, next); }
  getProfile(req, res, next) { return this.dashboardProfileHandler.getProfile(req, res, next); }
  updateProfile(req, res, next) { return this.dashboardProfileHandler.updateProfile(req, res, next); }
  getNotifications(req, res, next) { return this.dashboardProfileHandler.getNotifications(req, res, next); }
  clearNotifications(req, res, next) { return this.dashboardProfileHandler.clearNotifications(req, res, next); }
}

export const universityController = new UniversityController();
export default universityController;
