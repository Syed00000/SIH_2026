import MongooseUser from '../../../../users/infrastructure/model.js';
import logger from '../../../../../shared/logger/index.js';

export async function syncAdminUserAuth(admin, passwordHash = null, oldEmail = null) {
  try {
    const authRole = (admin.role || '').toLowerCase().includes('nodal') ? 'NODAL' : 'GOVERNMENT';
    const targetEmail = (oldEmail || admin.email).toLowerCase().trim();

    let user = await MongooseUser.findOne({
      $or: [
        { email: targetEmail },
        { email: admin.email.toLowerCase().trim() }
      ]
    });

    if (!user && admin.mobileNumber) {
      user = await MongooseUser.findOne({ mobileNumber: admin.mobileNumber });
    }

    const updateFields = {
      fullName: admin.fullName,
      email: admin.email.toLowerCase().trim(),
      mobileNumber: admin.mobileNumber,
      role: authRole,
      accountStatus: admin.status === 'Active' ? 'ACTIVE' : 'SUSPENDED',
      emailVerification: { verified: true, verifiedAt: new Date() },
      profile: {
        institutionName: admin.assignedDepartment || 'Higher & Technical Education',
        nodalOfficerDesignation: admin.role,
        district: admin.district || '',
        preferredLanguage: 'HINDI'
      }
    };

    if (passwordHash) {
      updateFields.passwordHash = passwordHash;
    }

    if (user) {
      Object.assign(user, updateFields);
      await user.save();
    } else {
      user = new MongooseUser({
        ...updateFields,
        passwordHash: passwordHash || admin.passwordHash
      });
      await user.save();
    }

    logger.info({
      msg: 'Admin & user auth synchronized successfully in MongoDB',
      adminId: admin._id || admin.id,
      email: admin.email
    });
  } catch (err) {
    logger.warn({ msg: 'Failed to sync admin to user auth', error: err.message });
  }
}

export default syncAdminUserAuth;
