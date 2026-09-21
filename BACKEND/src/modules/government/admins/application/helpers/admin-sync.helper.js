import bcrypt from 'bcryptjs';
import MongooseUser from '../../../../users/infrastructure/model.js';
import logger from '../../../../../shared/logger/index.js';

export async function syncAdminUserAuth(admin, passwordHash = null, oldEmail = null) {
  try {
    const authRole = (admin.role || '').toLowerCase().includes('nodal') ? 'NODAL' : 'GOVERNMENT';
    const targetEmail = (oldEmail || admin.email).toLowerCase().trim();

    // 1. Sanitize and validate mobile number to conform to Indian 10-digit format
    let cleanMobile = (admin.mobileNumber || '').toString().replace(/[^0-9]/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      cleanMobile = '98' + Math.floor(10000000 + Math.random() * 90000000);
    }

    // 2. Ensure reliable passwordHash is present
    let finalHash = passwordHash || admin.passwordHash;
    if (!finalHash && admin.password) {
      finalHash = await bcrypt.hash(admin.password, 10);
    }
    if (!finalHash) {
      const fallbackPass = process.env.DEFAULT_NODAL_PASSWORD || '';
      finalHash = fallbackPass ? await bcrypt.hash(fallbackPass, 10) : '';
    }

    // 3. Find user by email
    let user = await MongooseUser.findOne({
      $or: [
        { email: targetEmail },
        { email: admin.email.toLowerCase().trim() }
      ]
    }).select('+passwordHash');

    // 4. Resolve mobile collision if needed
    if (cleanMobile) {
      const existingMobileUser = await MongooseUser.findOne({ mobileNumber: cleanMobile });
      if (existingMobileUser && (!user || existingMobileUser._id.toString() !== user._id.toString())) {
        // Reassign cleanMobile to avoid duplicate key error
        cleanMobile = '99' + Math.floor(10000000 + Math.random() * 90000000);
      }
    }

    const updateFields = {
      fullName: admin.fullName,
      email: admin.email.toLowerCase().trim(),
      mobileNumber: cleanMobile,
      role: authRole,
      passwordHash: finalHash,
      accountStatus: admin.status === 'Active' ? 'ACTIVE' : 'SUSPENDED',
      emailVerification: { verified: true, verifiedAt: new Date() },
      profile: {
        institutionName: admin.assignedDepartment || 'Higher & Technical Education',
        nodalOfficerDesignation: admin.role,
        district: admin.district || '',
        preferredLanguage: 'HINDI'
      }
    };

    if (user) {
      Object.assign(user, updateFields);
      await user.save();
    } else {
      user = new MongooseUser(updateFields);
      await user.save();
    }

    logger.info({
      msg: 'Admin & user auth synchronized successfully in MongoDB',
      adminId: admin._id || admin.id,
      email: admin.email,
      role: authRole
    });
    return user;
  } catch (err) {
    logger.error({ msg: 'Failed to sync admin to user auth', error: err.message, stack: err.stack });
    throw err;
  }
}

export default syncAdminUserAuth;
