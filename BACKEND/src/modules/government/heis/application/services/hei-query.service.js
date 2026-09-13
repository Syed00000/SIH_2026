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

    const newPass = (
      updateData.credentials?.password ||
      updateData.credentials?.generatedPassword ||
      updateData.initialPassword ||
      updateData.loginPassword ||
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
      $push: { auditLogs: auditEntry }
    });

    if (newPass && passwordHash) {
      const targetEmail = (
        updateData.nodalOfficer?.email ||
        updateData.credentials?.loginEmail ||
        existing.nodalOfficer?.email ||
        existing.credentials?.loginEmail ||
        existing.universityEmail
      )?.toLowerCase().trim();

      try {
        let user = existing.userId ? await MongooseUser.findById(existing.userId) : null;
        if (!user && targetEmail) {
          user = await MongooseUser.findOne({ email: targetEmail });
        }

        if (user) {
          user.passwordHash = passwordHash;
          user.role = 'UNIVERSITY';
          user.accountStatus = 'ACTIVE';
          user.emailVerification = { verified: true, verifiedAt: new Date() };
          await user.save();
          if (!existing.userId) {
            await this.repository.update(id, { userId: user._id });
          }
        } else if (targetEmail) {
          const mobile = (updateData.nodalOfficer?.phone || existing.nodalOfficer?.phone || '').replace(/\D/g, '').slice(-10) || `98${Math.floor(10000000 + Math.random() * 90000000)}`;
          user = new MongooseUser({
            fullName: updateData.nodalOfficer?.name || existing.nodalOfficer?.name || existing.name,
            email: targetEmail,
            mobileNumber: mobile,
            passwordHash,
            role: 'UNIVERSITY',
            accountStatus: 'ACTIVE',
            emailVerification: { verified: true, verifiedAt: new Date() },
            profile: {
              institutionName: existing.name,
              aisheCode: existing.code,
              institutionType: existing.universityType || 'State University'
            }
          });
          await user.save();
          await this.repository.update(id, { userId: user._id });
        }
      } catch (userErr) {
        console.warn('University user password sync warning:', userErr.message);
      }
    }

    return updated;
  }
}

export default HeiQueryService;
