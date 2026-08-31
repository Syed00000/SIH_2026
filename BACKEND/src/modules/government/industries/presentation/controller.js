import { industryService } from '../application/service.js';
import { createCrudHandler } from './handlers/crud.handler.js';
import { createApplicationHandler } from './handlers/application.handler.js';
import { createActionsHandler } from './handlers/actions.handler.js';

export class IndustryController {
  constructor(service = industryService) {
    this.service = service;
    this.crudHandler = createCrudHandler(service);
    this.applicationHandler = createApplicationHandler(service);
    this.actionsHandler = createActionsHandler(service);
  }

  getIndustries(req, res, next) {
    return this.crudHandler.getIndustries(req, res, next);
  }

  getIndustryById(req, res, next) {
    return this.crudHandler.getIndustryById(req, res, next);
  }

  createIndustry(req, res, next) {
    return this.crudHandler.createIndustry(req, res, next);
  }

  updateIndustry(req, res, next) {
    return this.crudHandler.updateIndustry(req, res, next);
  }

  toggleStatus(req, res, next) {
    return this.actionsHandler.toggleStatus(req, res, next);
  }

  resetPassword(req, res, next) {
    return this.actionsHandler.resetPassword(req, res, next);
  }

  deleteIndustry(req, res, next) {
    return this.crudHandler.deleteIndustry(req, res, next);
  }

  applyIndustry(req, res, next) {
    return this.applicationHandler.applyIndustry(req, res, next);
  }

  approveApplication(req, res, next) {
    return this.applicationHandler.approveApplication(req, res, next);
  }

  rejectApplication(req, res, next) {
    return this.applicationHandler.rejectApplication(req, res, next);
  }

  seedAuthentic(req, res, next) {
    return this.actionsHandler.seedAuthentic(req, res, next);
  }
}

export const industryController = new IndustryController();
export default industryController;
