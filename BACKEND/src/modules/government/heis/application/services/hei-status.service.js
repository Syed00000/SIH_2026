import MongooseUser from '../../../../users/infrastructure/model.js';
import MongooseRefreshToken from '../../../../auth/infrastructure/model.js';
import { NotFoundError } from '../../../../../shared/errors/AppError.js';
import logger from '../../../../../shared/logger/index.js';

export class HeiStatusService {
  constructor(repository) {
    this.repository = repository;
  }

  async toggleAccessStatus(id) {
    const university = await this.repository.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    const nextStatus = university.accessStatus === 'Enabled' ? 'Disabled' : 'Enabled';
    const nextAccountStatus = nextStatus === 'Enabled' ? 'ACTIVE' : 'SUSPENDED';

    const updated = await this.repository.update(id, {
      accessStatus: nextStatus
    });

    await this.repository.addAuditLog(id, {
      action: nextStatus === 'Enabled' ? 'ACCESS_ENABLED' : 'ACCESS_DISABLED',
      performedBy: 'Government Admin',
      details: `Portal access ${nextStatus.toLowerCase()} by administration.`
    });

    if (university.userId) {
      await MongooseUser.findByIdAndUpdate(university.userId, {
        accountStatus: nextAccountStatus
      });

      if (nextStatus === 'Disabled') {
        await MongooseRefreshToken.updateMany(
          { userId: university.userId },
          { $set: { revoked: true } }
        );
        logger.info(`🔒 Revoked active sessions for disabled university: ${university.name}`);
      }
    }

    return updated;
  }

  async updateStatus(id, status, remarks = '') {
    const university = await this.repository.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    const nextAccessStatus = status === 'Approved' ? 'Enabled' : (status === 'Rejected' ? 'Disabled' : university.accessStatus);
    const nextAccountStatus = status === 'Approved' ? 'ACTIVE' : (status === 'Rejected' ? 'SUSPENDED' : 'PENDING_VERIFICATION');

    const updated = await this.repository.update(id, {
      status,
      accessStatus: nextAccessStatus
    });

    await this.repository.addAuditLog(id, {
      action: `STATUS_${status.toUpperCase()}`,
      performedBy: 'Government Admin',
      details: remarks || `University status changed to ${status} by administration.`
    });

    if (university.userId) {
      await MongooseUser.findByIdAndUpdate(university.userId, {
        accountStatus: nextAccountStatus
      });

      if (status === 'Rejected') {
        await MongooseRefreshToken.updateMany(
          { userId: university.userId },
          { $set: { revoked: true } }
        );
        logger.info(`🔒 Session revoked for rejected university: ${university.name}`);
      }
    }

    return updated;
  }

  async deleteUniversity(id) {
    const university = await this.repository.findById(id);
    if (!university) {
      throw new NotFoundError('University not found');
    }

    try {
      if (university.userId) {
        await MongooseRefreshToken.deleteMany({ userId: university.userId }).catch(() => {});
        await MongooseUser.findByIdAndDelete(university.userId).catch(() => {});
      } else if (university.universityEmail) {
        const userDoc = await MongooseUser.findOne({ email: university.universityEmail.toLowerCase().trim() });
        if (userDoc) {
          await MongooseRefreshToken.deleteMany({ userId: userDoc._id }).catch(() => {});
          await MongooseUser.findByIdAndDelete(userDoc._id).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Cascade user deletion error during university delete:', e.message);
    }

    await this.repository.delete(id);
    return { success: true, message: 'University removed successfully' };
  }
}

export default HeiStatusService;
