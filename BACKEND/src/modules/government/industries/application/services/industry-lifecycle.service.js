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

    const newPass = (
      updateData.credentials?.password ||
      updateData.credentials?.generatedPassword ||
      updateData.initialPassword ||
      updateData.password
    )?.toString().trim();

    let passwordHash = null;
    if (newPass) {
      passwordHash = await bcrypt.hash(newPass, 10);
      if (!updateData.credentials) updateData.credentials = {};
      updateData.credentials.passwordHash = passwordHash;
      updateData.credentials.generatedPassword = newPass;
    }

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

    const finalUserId = await syncIndustryUserUpdate(existing.userId, updateData, existing, passwordHash);
    if (finalUserId && !existing.userId) {
      await this.repository.update(id, { userId: finalUserId });
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

    try {
      const MongooseRefreshToken = (await import('../../../../auth/infrastructure/model.js')).default;
      if (industry.userId) {
        await MongooseRefreshToken.deleteMany({ userId: industry.userId }).catch(() => {});
        await MongooseUser.findByIdAndDelete(industry.userId).catch(() => {});
      } else if (industry.officialEmail) {
        const userDoc = await MongooseUser.findOne({ email: industry.officialEmail.toLowerCase().trim() });
        if (userDoc) {
          await MongooseRefreshToken.deleteMany({ userId: userDoc._id }).catch(() => {});
          await MongooseUser.findByIdAndDelete(userDoc._id).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Cascade user deletion error during industry delete:', e.message);
    }

    await this.repository.delete(id);
    return { success: true, message: 'Industry organization removed successfully' };
  }
}

export default IndustryLifecycleService;
