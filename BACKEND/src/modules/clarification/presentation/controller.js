import clarificationRepository from '../infrastructure/repository.js';
import { createMessageHandler } from './handlers/message.handler.js';
import { createDeletionHandler } from './handlers/deletion.handler.js';
import { createStatsHandler } from './handlers/stats.handler.js';

export class ClarificationController {
  constructor(repository = clarificationRepository) {
    this.repository = repository;
    this.messageHandler = createMessageHandler(repository);
    this.deletionHandler = createDeletionHandler(repository);
    this.statsHandler = createStatsHandler(repository);
  }

  getMessages(req, res, next) {
    return this.messageHandler.getMessages(req, res, next);
  }

  sendMessage(req, res, next) {
    return this.messageHandler.sendMessage(req, res, next);
  }

  markRead(req, res, next) {
    return this.messageHandler.markRead(req, res, next);
  }

  deleteMessage(req, res, next) {
    return this.deletionHandler.deleteMessage(req, res, next);
  }

  clearChat(req, res, next) {
    return this.deletionHandler.clearChat(req, res, next);
  }

  getUnreadCount(req, res, next) {
    return this.statsHandler.getUnreadCount(req, res, next);
  }

  getChallengeStats(req, res, next) {
    return this.statsHandler.getChallengeStats(req, res, next);
  }
}

export const clarificationController = new ClarificationController();
export default clarificationController;
