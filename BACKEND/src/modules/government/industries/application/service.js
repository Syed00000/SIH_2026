import { industryRepository } from '../infrastructure/repository.js';
import { generateNextIndustryId, generatePassword } from './helpers/industry-id.helper.js';
import { IndustryOnboardingService } from './services/industry-onboarding.service.js';
import { IndustryApprovalService } from './services/industry-approval.service.js';
import { IndustryLifecycleService } from './services/industry-lifecycle.service.js';
import { IndustryQueryService } from './services/industry-query.service.js';
import { AUTHENTIC_INDUSTRIES_SEED_DATA } from './data/industry-seed.data.js';

export class IndustryService {
  constructor(repository = industryRepository) {
    this.repository = repository;
    this.onboardingService = new IndustryOnboardingService(repository);
    this.approvalService = new IndustryApprovalService(repository);
    this.lifecycleService = new IndustryLifecycleService(repository);
    this.queryService = new IndustryQueryService(repository);
  }

  async generateNextIndustryId() {
    return generateNextIndustryId(this.repository);
  }

  generatePassword(length = 12) {
    return generatePassword(length);
  }

  async createIndustry(data) {
    return this.onboardingService.createIndustry(data);
  }

  async applyIndustry(payload) {
    return this.onboardingService.applyIndustry(payload);
  }

  async approveApplication(id, options = {}) {
    return this.approvalService.approveApplication(id, options);
  }

  async rejectApplication(id, options = {}) {
    return this.approvalService.rejectApplication(id, options);
  }

  async getIndustries(queryParams) {
    return this.queryService.getIndustries(queryParams);
  }

  async getIndustryById(id) {
    return this.queryService.getIndustryById(id);
  }

  async updateIndustry(id, updateData) {
    return this.lifecycleService.updateIndustry(id, updateData);
  }

  async toggleStatus(id) {
    return this.lifecycleService.toggleStatus(id);
  }

  async resetPassword(id) {
    return this.lifecycleService.resetPassword(id);
  }

  async deleteIndustry(id) {
    return this.lifecycleService.deleteIndustry(id);
  }

  async seedAuthenticIndustries() {
    const { MongooseIndustry } = await import('../infrastructure/model.js');
    await MongooseIndustry.deleteMany({});

    for (const item of AUTHENTIC_INDUSTRIES_SEED_DATA) {
      await this.createIndustry(item);
    }
    return { success: true, count: AUTHENTIC_INDUSTRIES_SEED_DATA.length };
  }
}

export const industryService = new IndustryService();
export default industryService;
