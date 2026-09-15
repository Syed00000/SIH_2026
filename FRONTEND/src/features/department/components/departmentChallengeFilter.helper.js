export function filterDepartmentChallenges(allChls = [], matched = null) {
  if (!matched) return [];
  const targetId = (matched.deptId || matched.id || '').toUpperCase();
  const targetName = (matched.name || '').toLowerCase();

  return allChls.filter((c) => {
    const checkAssignment = (assignmentObj) => {
      if (!assignmentObj) return false;
      const aId = (assignmentObj.deptId || assignmentObj.id || assignmentObj.wardId || assignmentObj.blockId || '').toUpperCase();
      if (aId && (aId === targetId || aId === matched._id?.toString().toUpperCase())) return true;
      const aName = (assignmentObj.name || '').toLowerCase();
      if (aName && (aName === targetName || targetName.includes(aName) || aName.includes(targetName))) return true;
      return false;
    };

    if (checkAssignment(c.assignedDepartment)) return true;
    if (checkAssignment(c.assignedWard)) return true;
    if (checkAssignment(c.assignedBlock)) return true;

    const isDeptNameMatch = (dept1, dept2) => {
      if (!dept1 || !dept2) return false;
      const clean1 = String(dept1).toLowerCase().replace(/\([^)]*\)/g, '').replace(/department/g, '').trim();
      const clean2 = String(dept2).toLowerCase().replace(/\([^)]*\)/g, '').replace(/department/g, '').trim();
      if (!clean1 || !clean2) return false;
      return clean1.includes(clean2) || clean2.includes(clean1);
    };

    const resDept = (c.resolutionDossier?.department || c.handoverDepartment || '').toLowerCase();
    if (resDept && (resDept === targetName || targetName.includes(resDept) || resDept.includes(targetName) || isDeptNameMatch(resDept, targetName))) return true;

    const domainClean = (c.domain || '').toLowerCase().replace(/&/g, 'and').trim();
    const targetNameClean = targetName.replace(/&/g, 'and');
    const isDomainMatch = domainClean && (domainClean.includes(targetNameClean) || targetNameClean.includes(domainClean) || (matched.code && domainClean.includes(matched.code.toLowerCase())));

    const isBlockDept = matched.category === 'Block / Tehsil Office' || matched.category === 'Block Department';
    const cBlock = (c.location?.block || c.assignedBlock?.name || '').toLowerCase();
    const dBlock = (matched.block || '').toLowerCase();

    if (isBlockDept && cBlock && dBlock && (cBlock.includes(dBlock) || dBlock.includes(cBlock))) {
      if (c.assignedBlock && c.assignedBlock.status === 'Escalated') return true;
      if (isDomainMatch) return true;
    }

    const isDistrictDept = matched.category === 'District Department' || (!dBlock && !targetNameClean.includes('block') && !targetNameClean.includes('panchayat'));
    if (isDistrictDept) {
      const cDistrict = (c.location?.district || c.district || '').toLowerCase();
      const dDistrict = (matched.district || '').toLowerCase();
      if (cDistrict && dDistrict && (cDistrict.includes(dDistrict) || dDistrict.includes(cDistrict))) {
        if (c.assignedDepartment && c.assignedDepartment.status === 'Escalated' && (c.assignedDepartment.level === 'District Department' || c.assignedDepartment.category === 'District Department')) {
          return true;
        }
        if (isDomainMatch) return true;
      }
    }

    if (isDomainMatch) {
      if (cBlock && (dBlock && (cBlock.includes(dBlock) || dBlock.includes(cBlock)) || targetNameClean.includes(cBlock))) {
        return true;
      }
    }

    return false;
  });
}

export default filterDepartmentChallenges;
