import bcrypt from 'bcryptjs';
import config from '../../../shared/config/index.js';
import logger from '../../../shared/logger/index.js';
import MongoUserRepository from '../../../modules/users/infrastructure/repository.js';

const userRepository = new MongoUserRepository();

export const seedGovtAdmin = async () => {
  try {
    const adminEmail = (config.GOVT_ADMIN_EMAIL || 'admin@dtejharkhand.gov.in').toLowerCase().trim();
    const adminPassword = config.GOVT_ADMIN_PASSWORD || 'Admin@123456';
    const adminName = config.GOVT_ADMIN_NAME || 'Super Admin';
    const adminMobile = config.GOVT_ADMIN_MOBILE || '9876543210';

    const defaultUsers = [
      {
        fullName: adminName,
        email: adminEmail,
        password: adminPassword,
        mobileNumber: adminMobile,
        role: 'GOVERNMENT',
        profile: {
          preferredLanguage: 'HINDI',
          institutionName: 'Department of Higher and Technical Education, Jharkhand',
          nodalOfficerDesignation: 'Super Admin',
          organizationName: 'Government of Jharkhand'
        }
      },
      {
        fullName: 'Tauqueer Wasi',
        email: 'citizen@joharsetu.gov.in',
        password: 'Citizen@123456',
        mobileNumber: '9998887776',
        role: 'CITIZEN',
        profile: {
          preferredLanguage: 'HINDI'
        }
      }
    ];

    for (const u of defaultUsers) {
      try {
        const existingUser = await userRepository.findByEmail(u.email);
        const passwordHash = await bcrypt.hash(u.password, 12);

        if (existingUser) {
          await userRepository.update(existingUser.id, {
            fullName: u.fullName,
            mobileNumber: u.mobileNumber,
            passwordHash,
            role: u.role,
            profile: u.profile,
            accountStatus: 'ACTIVE',
            emailVerification: { verified: true, verifiedAt: new Date() },
            emailVerificationCode: null,
            emailVerificationExpires: null
          });
          logger.info(`🏛️ Seed user synchronized: ${u.email} (${u.role})`);
        } else {
          await userRepository.save({
            fullName: u.fullName,
            mobileNumber: u.mobileNumber,
            email: u.email,
            passwordHash,
            role: u.role,
            profile: u.profile,
            accountStatus: 'ACTIVE',
            emailVerification: { verified: true, verifiedAt: new Date() },
            emailVerificationCode: null,
            emailVerificationExpires: null,
            lastLoginAt: null
          });
          logger.info(`🏛️ Seed user created: ${u.email} (${u.role})`);
        }
      } catch (userErr) {
        logger.error(`Error seeding ${u.email}:`, userErr.message);
      }
    }
    return true;
  } catch (error) {
    logger.error('Failed to seed default users', error);
    return false;
  }
};

export default seedGovtAdmin;
