export function matchOfficersAndProblems(dept, allAdmins = [], allChallenges = []) {
  const deptNameLower = (dept.name || '').toLowerCase().replace(/department of |dept\. of /i, '').replace(/&/g, 'and').trim();
  const deptCodeLower = (dept.code || '').toLowerCase();

  const matchedOfficers = allAdmins.filter((a) => {
    const adminDept = (a.assignedDepartment || '').toLowerCase().replace(/&/g, 'and').trim();
    return adminDept && (adminDept.includes(deptCodeLower) || deptNameLower.includes(adminDept) || adminDept.includes(deptNameLower));
  });

  const matchedChallenges = allChallenges.filter((c) => {
    const assignedDeptId = c.assignedDepartment?.deptId || c.assignedDepartment?.id;
    if (assignedDeptId && (assignedDeptId === dept.deptId || assignedDeptId === dept.id || assignedDeptId === dept._id?.toString())) {
      return true;
    }
    if (c.assignedDepartment?.name && c.assignedDepartment.name.toLowerCase() === dept.name.toLowerCase()) {
      return true;
    }
    const domainClean = (c.domain || '').toLowerCase().replace(/&/g, 'and').trim();
    return domainClean && (domainClean.includes(deptCodeLower) || deptNameLower.includes(domainClean) || domainClean.includes(deptNameLower));
  });

  const raw = typeof dept?.toJSON === 'function' ? dept.toJSON() : dept;
  return {
    ...raw,
    id: raw._id?.toString() || raw.id || raw.deptId,
    officers: matchedOfficers,
    problems: matchedChallenges,
    officersCount: matchedOfficers.length,
    problemsCount: matchedChallenges.length,
    activeProjectsCount: matchedChallenges.filter((p) => p.status === 'Deployed' || p.status === 'In Progress').length
  };
}

export default matchOfficersAndProblems;
