/**
 * Helper utilities for faculty roster calculations and filtering.
 * Strictly adheres to RULE.md (< 200 lines, real database data).
 */

export const enrichFacultyList = (fList = [], pList = [], cList = []) => {
  return fList.map((f) => {
    const facProjects = pList.filter((p) =>
      p.leadMentor === f.name ||
      (p.facultyMentor && (p.facultyMentor.name === f.name || p.facultyMentor.email === f.email)) ||
      (f.assignedChallenges && f.assignedChallenges.some((ac) => ac.challengeId === p.challengeId || ac.challengeId === p.projectId))
    );

    const facChallenges = cList.filter((c) =>
      (c.assignedFaculty && (c.assignedFaculty.name === f.name || c.assignedFaculty.email === f.email)) ||
      (f.assignedChallenges && f.assignedChallenges.some((ac) => ac.challengeId === c.challengeId || ac.challengeId === c.id))
    );

    // Active ongoing projects (in-progress / active R&D)
    const activeOngoingProjects = facProjects.filter((p) =>
      !p.isDeployed && !p.isLocked && p.status !== 'Deployed' && p.status !== 'Resolved' && p.status !== 'Completed' && p.status !== 'Archived'
    );
    const hasActiveOngoing = activeOngoingProjects.length > 0;

    // Completed or deployed solutions mentored by this faculty
    const deployedProjects = facProjects.filter((p) =>
      p.status === 'Deployed' || Boolean(p.isDeployed) || Boolean(p.isLocked) || p.status === 'Completed' || p.status === 'Resolved'
    );

    // Availability status: Available, In Project, or On Leave
    let availabilityStatus = f.availabilityStatus || 'Available';
    if (f.status === 'On Leave' || availabilityStatus === 'On Leave') {
      availabilityStatus = 'On Leave';
    } else if (hasActiveOngoing) {
      availabilityStatus = 'In Project';
    } else {
      availabilityStatus = 'Available';
    }

    // Faculty account status: Active, Inactive, On Leave (NEVER 'Deployed')
    const status = f.status === 'Inactive' ? 'Inactive' : (f.status === 'On Leave' ? 'On Leave' : 'Active');

    return {
      ...f,
      status,
      availabilityStatus,
      hasActiveOngoing,
      activeProjectsCount: activeOngoingProjects.length,
      deliveredSolutionsCount: deployedProjects.length,
      facProjects,
      facChallenges
    };
  });
};

export const filterFacultyList = (facultyList = [], { deptFilter, domainFilter, availabilityFilter, statusFilter, search }) => {
  return facultyList.filter((f) => {
    if (deptFilter && deptFilter !== 'All' && f.department !== deptFilter) return false;
    if (availabilityFilter && availabilityFilter !== 'All' && f.availabilityStatus !== availabilityFilter) return false;
    if (statusFilter && statusFilter !== 'All' && f.status !== statusFilter) return false;

    if (domainFilter && domainFilter !== 'All') {
      const specs = Array.isArray(f.specialization)
        ? f.specialization
        : typeof f.specialization === 'string'
        ? f.specialization.split(',').map((s) => s.trim()).filter(Boolean)
        : [];
      if (!specs.some((s) => s.toLowerCase().includes(domainFilter.toLowerCase()))) return false;
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      return (
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.department && f.department.toLowerCase().includes(q)) ||
        (f.email && f.email.toLowerCase().includes(q))
      );
    }
    return true;
  });
};
