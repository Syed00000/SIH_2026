import { wardRepository } from '../infrastructure/ward.repository.js';
import { NotFoundError, ValidationError } from '../../../../shared/errors/AppError.js';

export class WardService {
  constructor(repo = wardRepository) {
    this.repo = repo;
  }

  async getAllWards(query = {}) {
    return await this.repo.findAll(query);
  }

  async getWardById(id) {
    const ward = await this.repo.findById(id);
    if (!ward) throw new NotFoundError(`Ward not found with ID: ${id}`);
    return ward;
  }

  async createWard(data) {
    if (!data.name?.trim()) throw new ValidationError('Ward name is required');
    const district = data.district?.trim() || 'Ranchi';
    const wardNumber = Number(data.wardNumber) || 1;

    const existing = await this.repo.findByWardNumber(wardNumber, district);
    if (existing) {
      throw new ValidationError(`Ward Number ${wardNumber} already exists in ${district}`);
    }

    const count = await this.repo.count(district);
    const code = String(wardNumber || count + 1).padStart(2, '0');
    const wardId = data.wardId?.trim() || `WRD-JH-RN-${code}`;

    const localities = Array.isArray(data.localities)
      ? data.localities.map((l) => l.trim()).filter(Boolean)
      : (data.localities || '').split(',').map((l) => l.trim()).filter(Boolean);

    const councillorEmail = data.councillorEmail?.trim()?.toLowerCase() || '';
    const loginEmail = data.loginEmail?.trim()?.toLowerCase() || councillorEmail || `ward${code}.ranchi@jharkhand.gov.in`;
    const loginId = data.loginId?.trim() || loginEmail;
    const password = data.password?.trim() || `Ward@${code}2026`;

    const saved = await this.repo.create({
      ...data,
      wardId,
      wardNumber,
      name: data.name.trim(),
      district,
      blockId: data.blockId || '',
      blockName: data.blockName || '',
      councillorName: data.councillorName?.trim() || '',
      councillorEmail,
      councillorPhone: data.councillorPhone?.trim() || '',
      officeAddress: data.officeAddress?.trim() || '',
      population: Number(data.population) || 0,
      localities,
      assignedBlocks: Array.isArray(data.assignedBlocks) ? data.assignedBlocks : [],
      credentials: { loginId, loginEmail, password },
      status: data.status || 'Active'
    });

    try {
      const bcrypt = (await import('bcryptjs')).default;
      const User = (await import('../../../users/infrastructure/model.js')).default;
      const passwordHash = await bcrypt.hash(password, 10);
      await User.findOneAndUpdate(
        { email: loginEmail.toLowerCase() },
        {
          $set: {
            fullName: data.name.trim(),
            email: loginEmail.toLowerCase(),
            passwordHash,
            role: 'WARD',
            accountStatus: 'ACTIVE',
            emailVerification: { verified: true, verifiedAt: new Date() },
            profile: {
              preferredLanguage: 'HINDI',
              organizationName: data.name.trim(),
              institutionName: `Ward ${wardNumber}, ${district}`
            }
          }
        },
        { upsert: true, new: true }
      );
    } catch (userErr) {
      console.warn('Ward user sync warning:', userErr.message);
    }

    return saved;
  }

  async updateWard(id, updates) {
    if (updates.localities && typeof updates.localities === 'string') {
      updates.localities = updates.localities.split(',').map((l) => l.trim()).filter(Boolean);
    }
    if (updates.wardNumber) updates.wardNumber = Number(updates.wardNumber);
    if (updates.password || updates.loginId || updates.loginEmail) {
      const existing = await this.repo.findById(id);
      const prevCreds = existing?.credentials || {};
      updates.credentials = {
        loginId: updates.loginId?.trim() || prevCreds.loginId || '',
        loginEmail: updates.loginEmail?.trim()?.toLowerCase() || prevCreds.loginEmail || '',
        password: updates.password?.trim() || prevCreds.password || 'Ward@2026'
      };
    }
    const updated = await this.repo.update(id, updates);
    if (!updated) throw new NotFoundError('Ward not found for update');
    return updated;
  }

  async deleteWard(id) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundError('Ward not found for deletion');
    return { success: true, message: `Ward ${id} removed successfully` };
  }
}

export const wardService = new WardService();
export default wardService;
