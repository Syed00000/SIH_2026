import { universityRepository } from '../infrastructure/repository.js';
import { generatePassword } from './helpers/password.helper.js';
import { HeiOnboardingService } from './services/hei-onboarding.service.js';
import { HeiStatusService } from './services/hei-status.service.js';
import { HeiQueryService } from './services/hei-query.service.js';

export class UniversityService {
  constructor(repository = universityRepository) {
    this.repository = repository;
    this.onboardingService = new HeiOnboardingService(repository);
    this.statusService = new HeiStatusService(repository);
    this.queryService = new HeiQueryService(repository);
  }

  generatePassword(length = 10) {
    return generatePassword(length);
  }

  async createUniversity(data) {
    return this.onboardingService.createUniversity(data);
  }

  async getUniversities(queryParams) {
    return this.queryService.getUniversities(queryParams);
  }

  async getUniversityById(id) {
    return this.queryService.getUniversityById(id);
  }

  async updateUniversity(id, updateData) {
    return this.queryService.updateUniversity(id, updateData);
  }

  async toggleAccessStatus(id) {
    return this.statusService.toggleAccessStatus(id);
  }

  async updateStatus(id, status, remarks = '') {
    return this.statusService.updateStatus(id, status, remarks);
  }

  async deleteUniversity(id) {
    return this.statusService.deleteUniversity(id);
  }
}

export const universityService = new UniversityService();
export default universityService;
