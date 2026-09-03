import { citizenRepository } from '../infrastructure/repository.js';
import { generateChallengeId } from './helpers/challenge-id.helper.js';
import { ChallengeSubmissionService } from './services/challenge-submission.service.js';
import { ChallengeQueryService } from './services/challenge-query.service.js';
import { ChallengeAnalyticsService } from './services/challenge-analytics.service.js';
import { ChallengeTriageService } from './services/challenge-triage.service.js';
import { citizenMediaService } from './services/citizen-media.service.js';

export class CitizenService {
  constructor(repository = citizenRepository) {
    this.repository = repository;
    this.submissionService = new ChallengeSubmissionService(repository);
    this.queryService = new ChallengeQueryService(repository);
    this.analyticsService = new ChallengeAnalyticsService(repository);
    this.triageService = new ChallengeTriageService(repository);
    this.mediaService = citizenMediaService;
  }

  generateChallengeId() {
    return generateChallengeId();
  }

  async submitChallenge(data, user = null) {
    return this.submissionService.submitChallenge(data, user);
  }

  async getChallenges(params) {
    return this.queryService.getChallenges(params);
  }

  async getMyChallenges(user, params) {
    return this.queryService.getMyChallenges(user, params);
  }

  async getChallengeById(challengeId) {
    return this.queryService.getChallengeById(challengeId);
  }

  async getStats(user = null, district = null) {
    return this.analyticsService.getStats(user, district);
  }

  async getUpdates() {
    return this.analyticsService.getUpdates();
  }

  async getPopularAreas() {
    return this.analyticsService.getPopularAreas();
  }

  async triageChallenge(challengeId, triageData, user = null) {
    return this.triageService.triageChallenge(challengeId, triageData, user);
  }

  async withdrawChallenge(challengeId, reason, user = null) {
    return this.triageService.withdrawChallenge(challengeId, reason, user);
  }

  async deleteChallenge(challengeId) {
    return this.triageService.deleteChallenge(challengeId);
  }

  async uploadMedia(data) {
    return this.mediaService.uploadEvidence(data);
  }

  async getMediaById(mediaId, user = null) {
    return this.mediaService.getMediaById(mediaId, user);
  }

  async deleteMedia(mediaId, user = null) {
    return this.mediaService.deleteMedia(mediaId, user);
  }
}

export const citizenService = new CitizenService();
export default citizenService;
