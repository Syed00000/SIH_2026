import config from '../../shared/config/index.js';
import logger from '../../shared/logger/index.js';

let bootstrapExecuted = false;

export const bootstrapAdmins = async () => {
  if (bootstrapExecuted) return;

  try {
    const { Admin } = await import('../../modules/government/admins/infrastructure/model.js');
    const { syncAdminUserAuth } = await import('../../modules/government/admins/application/helpers/admin-sync.helper.js');

    const existingAdmin = await Admin.findOne({ email: 'admin@jharkhand.gov.in' });
    if (!existingAdmin) {
      const superAdminPassword = config.GOVT_ADMIN_PASSWORD || process.env.GOVT_ADMIN_PASSWORD || 'Admin@12345';
      const superAdmin = new Admin({
        fullName: 'Government Super Administrator',
        username: 'admin',
        email: 'admin@jharkhand.gov.in',
        password: superAdminPassword,
        mobileNumber: config.GOVT_ADMIN_MOBILE || '9876543210',
        role: 'State Government Admin',
        primaryRole: 'Super Administrator',
        accessLevel: 'State Level Access',
        district: 'Ranchi',
        assignedDepartment: 'Higher & Technical Education',
        status: 'Active'
      });
      await superAdmin.save();
      await syncAdminUserAuth(superAdmin);
      logger.info('Default Super Admin initialized: admin@jharkhand.gov.in');
    }

    const existingNodal = await Admin.findOne({ email: 'nodal@jharkhand.gov.in' });
    if (!existingNodal) {
      const nodalPassword = config.DEFAULT_NODAL_PASSWORD || process.env.DEFAULT_NODAL_PASSWORD || 'Nodal@12345';
      const defaultAdmin = new Admin({
        fullName: 'State Nodal Administrator',
        username: 'nodal_admin',
        email: 'nodal@jharkhand.gov.in',
        password: nodalPassword,
        mobileNumber: '9876543211',
        role: 'State Nodal Officer',
        primaryRole: 'State Level Administrator',
        accessLevel: 'State Level Access',
        district: 'Ranchi',
        assignedDepartment: 'Higher & Technical Education',
        status: 'Active'
      });
      await defaultAdmin.save();
      await syncAdminUserAuth(defaultAdmin);
      logger.info('Default Nodal Administrator initialized: nodal@jharkhand.gov.in');
    }

    bootstrapExecuted = true;
  } catch (adminInitErr) {
    logger.warn('Admin bootstrap notice: ' + adminInitErr.message);
  }
};

export default bootstrapAdmins;
