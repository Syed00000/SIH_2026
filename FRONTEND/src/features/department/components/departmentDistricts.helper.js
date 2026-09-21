export const MASKED_CREDENTIAL = '••••••••••••';
export const MASKED_SHORT = '••••••••';

export const getSectionTitle = (isBlockDept, isDistrictDept) => {
  if (isBlockDept) return 'Ward Commissioners';
  if (isDistrictDept) return 'Block & Tehsil Offices';
  return 'District Departments';
};

export const getJurisdictionLabel = (isBlockDept, isDistrictDept) => {
  if (isBlockDept) return 'Ward';
  if (isDistrictDept) return 'Block / Jurisdiction';
  return 'District';
};

export const getJurisdictionValue = (dist, isBlockDept, isDistrictDept) => {
  if (!dist) return 'District Territory';
  if (isBlockDept) {
    return dist.ward || dist.applicableJurisdiction || dist.district || 'Ward Office';
  }
  if (isDistrictDept) {
    return dist.block || dist.applicableJurisdiction || dist.district || 'Block Office';
  }
  return dist.district || 'District Territory';
};
