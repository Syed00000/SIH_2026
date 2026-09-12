export const DEFAULT_STATE_MINISTRIES = [
  {
    deptId: 'DEPT-JH-STATE',
    name: 'State Department',
    code: 'JH-STATE',
    category: 'State Ministry',
    district: 'Ranchi',
    headName: 'Principal Secretary, GoJ',
    headRole: 'State Department Head',
    headEmail: 'statedepartment@jharkhand.gov.in',
    headPhone: '+91 94311 00001',
    description: 'Apex State Department of Jharkhand for statewide administration and civic challenge resolution.'
  }
];

export const DEFAULT_DISTRICT_DEPARTMENTS = [
  {
    deptId: 'DEPT-JH-DIST-RNC',
    name: 'Ranchi District Department',
    code: 'DIST-RANCHI',
    category: 'District Department',
    district: 'Ranchi',
    headName: 'Deputy Commissioner, Ranchi',
    headRole: 'District Department Head',
    headEmail: 'district.ranchi@jharkhand.gov.in',
    headPhone: '+91 94311 22001',
    description: 'Ranchi District Department managing district-level administrative actions and civic problem resolutions.'
  },
  {
    deptId: 'DEPT-JH-DIST-DHN',
    name: 'Dhanbad District Department',
    code: 'DIST-DHANBAD',
    category: 'District Department',
    district: 'Dhanbad',
    headName: 'Deputy Commissioner, Dhanbad',
    headRole: 'District Department Head',
    headEmail: 'district.dhanbad@jharkhand.gov.in',
    headPhone: '+91 94311 33001',
    description: 'Dhanbad District Department managing district-level administrative actions and civic problem resolutions.'
  }
];

export async function ensureDefaultAdminDepartments(repo) {
  try {
    // 1. Ensure State Department (1 single state-level department)
    for (const item of DEFAULT_STATE_MINISTRIES) {
      const found = await repo.find({ $or: [{ deptId: item.deptId }, { name: item.name }] });
      if (found.length === 0) {
        await repo.create({
          ...item,
          credentials: {
            loginId: item.deptId,
            loginEmail: item.headEmail,
            password: 'Gov@State2026',
            generatedPassword: 'Gov@State2026'
          },
          status: 'Active'
        });
      }
    }

    // 2. Ensure District Departments (Ranchi & Dhanbad)
    for (const item of DEFAULT_DISTRICT_DEPARTMENTS) {
      const found = await repo.find({ $or: [{ deptId: item.deptId }, { name: item.name }] });
      if (found.length === 0) {
        await repo.create({
          ...item,
          credentials: {
            loginId: item.deptId,
            loginEmail: item.headEmail,
            password: 'Gov@Dist2026',
            generatedPassword: 'Gov@Dist2026'
          },
          status: 'Active'
        });
      }
    }
  } catch (err) {
    console.warn('ensureDefaultAdminDepartments warning:', err.message);
  }
}
