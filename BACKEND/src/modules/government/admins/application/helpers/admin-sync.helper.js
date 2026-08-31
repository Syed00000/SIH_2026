import MongooseUser from '../../../../users/infrastructure/model.js';
import logger from '../../../../../shared/logger/index.js';

export async function syncAdminUserAuth(newAdmin, passwordHash) {
  const authRole = newAdmin.role.toLowerCase().includes('nodal') ? 'NODAL' : 'GOVERNMENT';
  await MongooseUser.findOneAndUpdate(
    { email: newAdmin.email },
    {
      fullName: newAdmin.fullName,
      mobileNumber: newAdmin.mobileNumber,
      passwordHash,
      role: authRole,
      accountStatus: newAdmin.status === 'Active' ? 'ACTIVE' : 'SUSPENDED',
      emailVerification: { verified: true, verifiedAt: new Date() },
      profile: {
        institutionName: newAdmin.assignedDepartment,
        nodalOfficerDesignation: newAdmin.role,
        preferredLanguage: 'HINDI'
      }
    },
    { upsert: true, new: true }
  );

  logger.info({ msg: 'Admin created & user auth synchronized successfully in MongoDB', adminId: newAdmin._id, email: newAdmin.email });
}

export default syncAdminUserAuth;
