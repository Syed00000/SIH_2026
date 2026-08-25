import bcrypt from 'bcryptjs';
import config from '../../../shared/config/index.js';
import logger from '../../../shared/logger/index.js';
import MongoUserRepository from '../../../modules/users/infrastructure/repository.js';

const userRepository = new MongoUserRepository();

export const seedGovtAdmin = async () => {
  try {
    const adminEmail = config.GOVT_ADMIN_EMAIL?.toLowerCase()?.trim();
    const adminPassword = config.GOVT_ADMIN_PASSWORD;
    const adminName = config.GOVT_ADMIN_NAME || 'Government Admin';
    const adminMobile = config.GOVT_ADMIN_MOBILE || '9876543210';

    if (!adminEmail || !adminPassword) {
      logger.info('ℹ️ GOVT_ADMIN_EMAIL or GOVT_ADMIN_PASSWORD not set in environment. Skipping admin seed.');
      return false;
    }

    const existingUser = await userRepository.findByEmail(adminEmail);
    const passwordHash = await bcrypt.hash(adminPassword, 12);

    const adminProfile = {
      preferredLanguage: 'HINDI',
      institutionName: 'Department of Higher and Technical Education, Jharkhand',
      nodalOfficerDesignation: 'Super Admin',
      organizationName: 'Government of Jharkhand'
    };

    if (existingUser) {
      await userRepository.update(existingUser.id, {
        fullName: adminName,
        mobileNumber: adminMobile,
        passwordHash,
        role: 'GOVERNMENT',
        profile: adminProfile,
        accountStatus: 'ACTIVE',
        emailVerification: { verified: true, verifiedAt: new Date() },
        emailVerificationCode: null,
        emailVerificationExpires: null
      });
      logger.info(`🏛️ Government Admin account synced successfully: ${adminEmail}`);
    } else {
      await userRepository.save({
        fullName: adminName,
        mobileNumber: adminMobile,
        email: adminEmail,
        passwordHash,
        role: 'GOVERNMENT',
        profile: adminProfile,
        accountStatus: 'ACTIVE',
        emailVerification: { verified: true, verifiedAt: new Date() },
        emailVerificationCode: null,
        emailVerificationExpires: null,
        lastLoginAt: null
      });
      logger.info(`🏛️ Government Admin account created & seeded successfully: ${adminEmail}`);
    }
    return true;
  } catch (error) {
    logger.error('Failed to seed Government Admin user', error);
    return false;
  }
};

export default seedGovtAdmin;
