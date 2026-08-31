import bcrypt from 'bcryptjs';
import MongooseUser from '../../../../users/infrastructure/model.js';
import { NotFoundError } from '../../../../../shared/errors/AppError.js';

export class HeiQueryService {
  constructor(repository) {
    this.repository = repository;
  }

  async getUniversities(queryParams) {
    const result = await this.repository.findAll(queryParams);
    const kpis = await this.repository.getKpis();
    return { ...result, kpis };
  }

  async getUniversityById(id) {
    const university = await this.repository.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }
    return university;
  }

  async updateUniversity(id, updateData) {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new NotFoundError('University not found');
    }

    const auditEntry = {
      action: 'UPDATED',
      performedBy: 'Government Admin',
      timestamp: new Date(),
      details: 'University parameters modified by administration.'
    };

    const updated = await this.repository.update(id, {
      ...updateData,
      $push: { auditLogs: auditEntry }
    });

    if (updateData.credentials?.generatedPassword && existing.userId) {
      const passwordHash = await bcrypt.hash(updateData.credentials.generatedPassword, 10);
      await MongooseUser.findByIdAndUpdate(existing.userId, { passwordHash });
    }

    return updated;
  }
}

export default HeiQueryService;
