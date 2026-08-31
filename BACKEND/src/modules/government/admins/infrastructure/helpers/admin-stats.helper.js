import Admin from '../model.js';

export const calculateStats = async () => {
  try {
    const [total, active, suspended, removed] = await Promise.all([
      Admin.countDocuments(),
      Admin.countDocuments({ status: 'Active' }),
      Admin.countDocuments({ status: 'Suspended' }),
      Admin.countDocuments({ status: { $in: ['Removed', 'Restricted'] } })
    ]);
    return { totalAdmins: total, activeAdmins: active, suspendedAdmins: suspended, removedAdmins: removed };
  } catch {
    return { totalAdmins: 0, activeAdmins: 0, suspendedAdmins: 0, removedAdmins: 0 };
  }
};

export default calculateStats;
