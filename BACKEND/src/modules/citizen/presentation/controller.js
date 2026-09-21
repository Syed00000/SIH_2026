import { citizenService } from '../application/service.js';
import { createSubmissionHandler } from './handlers/submission.handler.js';
import { createQueryHandler } from './handlers/query.handler.js';
import { createAnalyticsHandler } from './handlers/analytics.handler.js';
import { createTriageHandler } from './handlers/triage.handler.js';
import { createMediaHandler } from './handlers/media.handler.js';
import { createAiTriageHandler } from './handlers/ai-triage.handler.js';
import { createAiChatHandler } from './handlers/ai-chat.handler.js';

export class CitizenController {
  constructor(service = citizenService) {
    this.service = service;
    this.submissionHandler = createSubmissionHandler(service);
    this.queryHandler = createQueryHandler(service);
    this.analyticsHandler = createAnalyticsHandler(service);
    this.triageHandler = createTriageHandler(service);
    this.mediaHandler = createMediaHandler(service);
    this.aiHandler = createAiTriageHandler(service);
    this.chatHandler = createAiChatHandler();
  }

  submitChallenge(req, res, next) {
    return this.submissionHandler.submitChallenge(req, res, next);
  }

  getChallenges(req, res, next) {
    return this.queryHandler.getChallenges(req, res, next);
  }

  getMyChallenges(req, res, next) {
    return this.queryHandler.getMyChallenges(req, res, next);
  }

  getChallengeById(req, res, next) {
    return this.queryHandler.getChallengeById(req, res, next);
  }

  getStats(req, res, next) {
    return this.analyticsHandler.getStats(req, res, next);
  }

  getUpdates(req, res, next) {
    return this.analyticsHandler.getUpdates(req, res, next);
  }

  getPopularAreas(req, res, next) {
    return this.analyticsHandler.getPopularAreas(req, res, next);
  }

  triageChallenge(req, res, next) {
    return this.triageHandler.triageChallenge(req, res, next);
  }

  withdrawChallenge(req, res, next) {
    return this.triageHandler.withdrawChallenge(req, res, next);
  }

  deleteChallenge(req, res, next) {
    return this.triageHandler.deleteChallenge(req, res, next);
  }

  uploadMedia(req, res, next) {
    return this.mediaHandler.uploadMedia(req, res, next);
  }

  getMedia(req, res, next) {
    return this.mediaHandler.getMedia(req, res, next);
  }

  getChallengeMedia(req, res, next) {
    return this.mediaHandler.getChallengeMedia(req, res, next);
  }

  deleteMedia(req, res, next) {
    return this.mediaHandler.deleteMedia(req, res, next);
  }

  analyzeChallenge(req, res, next) {
    return this.aiHandler.analyzeChallenge(req, res, next);
  }

  applyAiRecommendation(req, res, next) {
    return this.aiHandler.applyRecommendation(req, res, next);
  }

  markDuplicate(req, res, next) {
    return this.aiHandler.markDuplicate(req, res, next);
  }

  batchSyncAi(req, res, next) {
    return this.aiHandler.batchSync(req, res, next);
  }

  handleAiChat(req, res, next) {
    return this.chatHandler.handleChat(req, res, next);
  }
}

export const citizenController = new CitizenController();
export default citizenController;
