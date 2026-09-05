import { isDbReady, findUniversityByCodeOrId } from './helpers/lookup.helper.js';
import { challengeRepository } from './repositories/challenge.repository.js';
import { projectCrudRepository } from './repositories/project-crud.repository.js';
import { projectApprovalRepository } from './repositories/project-approval.repository.js';
import { projectPrototypeRepository } from './repositories/project-prototype.repository.js';
import { facultyTeamRepository } from './repositories/faculty-team.repository.js';
import { approvalActivityRepository } from './repositories/approval-activity.repository.js';
import { partnerRequestRepository } from './repositories/partner-request.repository.js';
import { ProfileRepository } from './repositories/profile.repository.js';

export class UniversityDashboardRepository {
  constructor() {
    this.challengeRepo = challengeRepository;
    this.projectCrudRepo = projectCrudRepository;
    this.projectApprovalRepo = projectApprovalRepository;
    this.projectPrototypeRepo = projectPrototypeRepository;
    this.facultyTeamRepo = facultyTeamRepository;
    this.approvalActivityRepo = approvalActivityRepository;
    this.partnerRequestRepo = partnerRequestRepository;
    this.profileRepo = new ProfileRepository(this.facultyTeamRepo, this.projectCrudRepo);
  }

  isDbReady() { return isDbReady(); }
  findUniversityByCodeOrId(identifier) { return findUniversityByCodeOrId(identifier); }

  getChallengesByUniversity(universityCode, queryParams) {
    return this.challengeRepo.getChallengesByUniversity(universityCode, queryParams);
  }

  updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata) {
    return this.challengeRepo.updateChallengeStatus(challengeId, universityCode, status, actionLabel, metadata);
  }

  assignFaculty(challengeId, universityCode, facultyInfo) {
    return this.challengeRepo.assignFaculty(challengeId, universityCode, facultyInfo);
  }

  deleteChallenge(universityCode, challengeId, deletedBy) {
    return this.challengeRepo.deleteChallenge(universityCode, challengeId, deletedBy);
  }

  getProjectsByUniversity(universityCode, includeDeleted) {
    return this.projectCrudRepo.getProjectsByUniversity(universityCode, includeDeleted);
  }

  createProject(universityCode, projectData) {
    return this.projectCrudRepo.createProject(universityCode, projectData);
  }

  updateProject(universityCode, projectId, updateData) {
    return this.projectApprovalRepo.updateProject(universityCode, projectId, updateData);
  }

  assignFacultyToProject(universityCode, projectId, facultyInfo) {
    return this.projectCrudRepo.assignFacultyToProject(universityCode, projectId, facultyInfo);
  }

  deleteProject(universityCode, projectId, deletedBy) {
    return this.projectCrudRepo.deleteProject(universityCode, projectId, deletedBy);
  }

  getFacultyByUniversity(universityCode) {
    return this.facultyTeamRepo.getFacultyByUniversity(universityCode);
  }

  createFaculty(universityCode, facultyData) {
    return this.facultyTeamRepo.createFaculty(universityCode, facultyData);
  }

  updateFaculty(universityCode, facultyId, updateData) {
    return this.facultyTeamRepo.updateFaculty(universityCode, facultyId, updateData);
  }

  deleteFaculty(universityCode, facultyId) {
    return this.facultyTeamRepo.deleteFaculty(universityCode, facultyId);
  }

  getTeamsByUniversity(universityCode) {
    return this.facultyTeamRepo.getTeamsByUniversity(universityCode);
  }

  createTeam(universityCode, data) {
    return this.facultyTeamRepo.createTeam(universityCode, data);
  }

  updateTeam(universityCode, id, data) {
    return this.facultyTeamRepo.updateTeam(universityCode, id, data);
  }

  deleteTeam(universityCode, id) {
    return this.facultyTeamRepo.deleteTeam(universityCode, id);
  }

  getPartnersByUniversity(universityCode) {
    return this.partnerRequestRepo.getPartnersByUniversity(universityCode);
  }

  getApprovalsByUniversity(universityCode) {
    return this.approvalActivityRepo.getApprovalsByUniversity(universityCode);
  }

  updateApprovalStatus(approvalId, universityCode, status, remarks) {
    return this.approvalActivityRepo.updateApprovalStatus(approvalId, universityCode, status, remarks);
  }

  deleteApproval(approvalId, universityCode) {
    return this.approvalActivityRepo.deleteApproval(approvalId, universityCode);
  }

  submitPrototype(projectId, universityCode, prototypeData) {
    return this.projectPrototypeRepo.submitPrototype(projectId, universityCode, prototypeData);
  }

  forwardPrototypeToGovernment(projectId, universityCode, remarks) {
    return this.projectPrototypeRepo.forwardPrototypeToGovernment(projectId, universityCode, remarks);
  }

  updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks) {
    return this.projectPrototypeRepo.updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks);
  }

  uploadProjectPdf(projectId, universityCode, file) {
    return this.projectPrototypeRepo.uploadProjectPdf(projectId, universityCode, file);
  }

  getActivitiesByUniversity(universityCode, limit) {
    return this.approvalActivityRepo.getActivitiesByUniversity(universityCode, limit);
  }

  clearActivities(universityCode) {
    return this.approvalActivityRepo.clearActivities(universityCode);
  }

  createIndustryRequest(universityCode, payload) {
    return this.partnerRequestRepo.createIndustryRequest(universityCode, payload);
  }

  getIndustryRequests(universityCode) {
    return this.partnerRequestRepo.getIndustryRequests(universityCode);
  }

  updateIndustryRequestStatus(requestId, status, universityCode, extra = {}) {
    return this.partnerRequestRepo.updateIndustryRequestStatus(requestId, status, universityCode, extra);
  }

  deleteIndustryRequest(requestId, universityCode) {
    return this.partnerRequestRepo.deleteIndustryRequest(requestId, universityCode);
  }

  getUniversityProfile(universityCode) {
    return this.profileRepo.getUniversityProfile(universityCode);
  }

  updateUniversityProfile(universityCode, updateData, user) {
    return this.profileRepo.updateUniversityProfile(universityCode, updateData, user);
  }
}

export const universityDashboardRepository = new UniversityDashboardRepository();
export default universityDashboardRepository;
