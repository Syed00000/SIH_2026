import { createIndustryEntity } from './industry-create.service.js';
import { applyIndustryApplication } from './industry-apply.service.js';

export class IndustryOnboardingService {
  constructor(repository) {
    this.repository = repository;
  }

  async createIndustry(data) {
    return createIndustryEntity(this.repository, data);
  }

  async applyIndustry(payload) {
    return applyIndustryApplication(this.repository, payload);
  }
}

export default IndustryOnboardingService;
