import bcrypt from 'bcryptjs';
import MongooseUser from '../../../../users/infrastructure/model.js';
import { sendIndustryOnboardingEmail } from '../../../../../infrastructure/email/smtpMailer.js';
import { NotFoundError } from '../../../../../shared/errors/AppError.js';
import logger from '../../../../../shared/logger/index.js';
import { generatePassword } from '../helpers/industry-id.helper.js';
import { revokeIndustrySessions, syncIndustryUserUpdate } from '../helpers/industry-user-sync.helper.js';

export class IndustryLifecycleService {
  constructor(repository) {
    this.repository = repository;
  }

  async updateIndustry(id, updateData) {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Industry organization not found');

    const updated = await this.repository.update(id, {
      ...updateData,
      $push: {
        auditLogs: {
          action: 'UPDATED',
          performedBy: 'Government Admin',
          timestamp: new Date(),
          details: 'Industry parameters modified by administration.'
        }
      }
    });

    if (existing.userId) {
      await syncIndustryUserUpdate(existing.userId, updateData);
    }

    return updated;
  }

  async toggleStatus(id) {
    const industry = await this.repository.findById(id);
    if (!industry) throw new NotFoundError('Industry organization not found');

    const nextStatus = industry.status === 'Active' ? 'Disabled' : 'Active';
    const nextAccessStatus = nextStatus === 'Active' ? 'Enabled' : 'Disabled';
    const nextAccountStatus = nextStatus === 'Active' ? 'ACTIVE' : 'SUSPENDED';

    const updated = await this.repository.update(id, {
      status: nextStatus,
      accessStatus: nextAccessStatus
    });

    await this.repository.addAuditLog(id, {
      action: nextStatus === 'Active' ? 'ACCOUNT_ENABLED' : 'ACCOUNT_DISABLED',
      performedBy: 'Government Admin',
      details: `Industry access ${nextStatus.toLowerCase()} by administration.`
    });

    if (industry.userId) {
      await MongooseUser.findByIdAndUpdate(industry.userId, { accountStatus: nextAccountStatus });
      if (nextStatus === 'Disabled') {
        await revokeIndustrySessions(industry.userId, industry.legalName);
      }
    }

    return updated;
  }

  async resetPassword(id) {
    const industry = await this.repository.findById(id);
    if (!industry) throw new NotFoundError('Industry organization not found');

    const rawPassword = generatePassword(10);
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const updated = await this.repository.update(id, {
      'credentials.generatedPassword': rawPassword,
      'credentials.passwordHash': passwordHash
    });

    await this.repository.addAuditLog(id, {
      action: 'PASSWORD_RESET',
      performedBy: 'Government Admin',
      details: 'Password regenerated and security key updated by administration.'
    });

    if (industry.userId) {
      await MongooseUser.findByIdAndUpdate(industry.userId, { passwordHash });
      await revokeIndustrySessions(industry.userId, industry.legalName);
    }

    try {
      await sendIndustryOnboardingEmail({
        email: industry.officialEmail,
        organizationName: industry.legalName,
        spocName: industry.spocName,
        industryId: industry.industryId,
        loginEmail: industry.credentials?.loginEmail || industry.officialEmail,
        temporaryPassword: rawPassword
      });
    } catch (err) {
      logger.warn({ msg: 'Reset email notification skipped', error: err.message });
    }

    return {
      success: true,
      industryId: industry.industryId,
      legalName: industry.legalName,
      email: industry.officialEmail,
      password: rawPassword,
      message: 'New credentials generated successfully.'
    };
  }

  async deleteIndustry(id) {
    const industry = await this.repository.findById(id);
    if (!industry) throw new NotFoundError('Industry organization not found');

    if (industry.userId) {
      await MongooseUser.findByIdAndUpdate(industry.userId, { accountStatus: 'BLOCKED' });
      await revokeIndustrySessions(industry.userId, industry.legalName);
    }

    await this.repository.delete(id);
    return { success: true, message: 'Industry organization removed successfully' };
  }
}

export default IndustryLifecycleService;
