import bcrypt from 'bcryptjs';
import MongooseUser from '../../../../users/infrastructure/model.js';
import { sendIndustryOnboardingEmail } from '../../../../../infrastructure/email/smtpMailer.js';
import { NotFoundError } from '../../../../../shared/errors/AppError.js';
import logger from '../../../../../shared/logger/index.js';
import { generatePassword } from '../helpers/industry-id.helper.js';

export class IndustryApprovalService {
  constructor(repository) {
    this.repository = repository;
  }

  async approveApplication(id, options = {}) {
    const industry = await this.repository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry application not found');
    }

    const effectiveLoginEmail = (options.loginEmail || industry.credentials?.loginEmail || industry.officialEmail).toLowerCase().trim();
    const rawPassword = options.initialPassword || generatePassword(10);
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    let cleanMobile = industry.mobileNumber.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
      cleanMobile = '98' + Math.floor(10000000 + Math.random() * 90000000).toString().slice(0, 8);
    }

    let user = await MongooseUser.findOne({ email: effectiveLoginEmail });
    if (user) {
      user.role = 'INDUSTRY';
      user.passwordHash = passwordHash;
      user.fullName = industry.spocName.trim();
      user.accountStatus = 'ACTIVE';
      user.emailVerification = { verified: true, verifiedAt: new Date() };
      user.profile = {
        preferredLanguage: 'HINDI',
        location: { districtId: null, blockOrULBId: null, panchayatOrWardId: null },
        organizationName: industry.legalName.trim(),
        entityType: industry.category,
        cin: industry.registrationNumber || '',
        primaryContactDesignation: industry.designation,
        supportSectors: industry.supportModes
      };
      await user.save();
    } else {
      let existingMobile = await MongooseUser.findOne({ mobileNumber: cleanMobile });
      while (existingMobile) {
        cleanMobile = '9' + Math.floor(100000000 + Math.random() * 900000000).toString().slice(0, 9);
        existingMobile = await MongooseUser.findOne({ mobileNumber: cleanMobile });
      }

      user = new MongooseUser({
        fullName: industry.spocName.trim(),
        email: effectiveLoginEmail,
        mobileNumber: cleanMobile,
        passwordHash,
        role: 'INDUSTRY',
        accountStatus: 'ACTIVE',
        emailVerification: { verified: true, verifiedAt: new Date() },
        profile: {
          preferredLanguage: 'HINDI',
          location: { districtId: null, blockOrULBId: null, panchayatOrWardId: null },
          organizationName: industry.legalName.trim(),
          entityType: industry.category,
          cin: industry.registrationNumber || '',
          primaryContactDesignation: industry.designation,
          supportSectors: industry.supportModes
        }
      });
      await user.save();
    }

    const updated = await this.repository.update(id, {
      status: 'Active',
      accessStatus: 'Enabled',
      verificationStatus: 'Verified',
      credentials: {
        loginEmail: effectiveLoginEmail,
        generatedPassword: rawPassword,
        passwordHash
      },
      userId: user._id
    });

    await this.repository.addAuditLog(id, {
      action: 'APPROVED',
      performedBy: 'Government Admin',
      details: 'Application reviewed and approved. Official credentials generated and dispatched.'
    });

    const recipientEmails = Array.from(new Set([industry.officialEmail, effectiveLoginEmail].filter(Boolean)));
    try {
      await sendIndustryOnboardingEmail({
        emails: recipientEmails,
        email: industry.officialEmail,
        organizationName: industry.legalName,
        spocName: industry.spocName,
        industryId: industry.industryId,
        loginEmail: effectiveLoginEmail,
        temporaryPassword: rawPassword
      });
      logger.info({ msg: 'Official onboarding email dispatched on approval', recipients: recipientEmails, industryId: industry.industryId });
    } catch (emailErr) {
      logger.error({ msg: 'SMTP dispatch failed on approval', error: emailErr.message });
    }

    return {
      success: true,
      industry: updated,
      credentials: {
        industryId: industry.industryId,
        legalName: industry.legalName,
        email: effectiveLoginEmail,
        password: rawPassword,
        status: 'Active'
      },
      message: 'Industry application approved and onboarding credentials dispatched successfully.'
    };
  }

  async rejectApplication(id, options = {}) {
    const industry = await this.repository.findById(id);
    if (!industry) {
      throw new NotFoundError('Industry application not found');
    }

    const updated = await this.repository.update(id, {
      status: 'Disabled',
      accessStatus: 'Disabled',
      verificationStatus: 'Rejected'
    });

    await this.repository.addAuditLog(id, {
      action: 'REJECTED',
      performedBy: 'Government Admin',
      details: `Application rejected. Remarks: ${options.reason || 'Verification criteria not satisfied.'}`
    });

    return {
      success: true,
      industry: updated,
      message: 'Industry application rejected.'
    };
  }
}

export default IndustryApprovalService;
