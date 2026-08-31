import { NotFoundError } from '../../../../../shared/errors/AppError.js';

export class IndustryQueryService {
  constructor(repository) {
    this.repository = repository;
  }

  async getIndustries(queryParams) {
    const result = await this.repository.findAll(queryParams);
    const kpis = await this.repository.getKpis();
    return {
      ...result,
      kpis
    };
  }

  async getIndustryById(id) {
    const industry = await this.repository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry organization not found');
    }
    return industry;
  }
}

export default IndustryQueryService;
