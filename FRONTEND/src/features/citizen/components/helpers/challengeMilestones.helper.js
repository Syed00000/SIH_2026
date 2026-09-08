export function getChallengeMilestones(challenge = {}) {
  const isResolved = challenge.status === 'Resolved' || challenge.status === 'Deployed';
  const assignedDept = challenge.assignedDepartment;
  const isBlockAssigned = Boolean(
    assignedDept?.name || assignedDept?.deptId || assignedDept?.block || challenge.assignedBlock
  );
  const assignedTech = challenge.assignedTechnician;
  const hasTechnician = Boolean(assignedTech?.name || assignedTech?.technicianId || assignedTech?.phone);
  const assignedUni = challenge.assignedUniversity || {};
  const isUniAssigned = Boolean(assignedUni?.name || assignedUni?.universityName);

  if (isBlockAssigned) {
    const blockName = assignedDept?.block || challenge.assignedBlock || 'Block Office';
    const deptName = assignedDept?.name || 'Civic Department';

    return [
      {
        step: 1,
        title: 'Problem Submitted',
        description: 'Filed with citizen geo-location & grievance verification.',
        status: 'COMPLETED'
      },
      {
        step: 2,
        title: 'Block & Department Assigned',
        description: `Triage assigned to ${blockName} • ${deptName}.`,
        status: 'COMPLETED'
      },
      {
        step: 3,
        title: (hasTechnician && (assignedTech.status === 'Accepted' || assignedTech.status === 'Completed'))
          ? 'Field Technician Accepted' : 'Field Technician Dispatched',
        description: (hasTechnician && (assignedTech.status === 'Accepted' || assignedTech.status === 'Completed'))
          ? `${assignedTech.name} (${assignedTech.specialization || 'Field Tech'}) accepted • Ph: ${assignedTech.phone}`
          : (hasTechnician ? `Assigned to ${assignedTech.name}. Awaiting technician acceptance.` : 'Department in-charge reviewing problem for technician allocation.'),
        status: (hasTechnician && (assignedTech.status === 'Accepted' || assignedTech.status === 'Completed'))
          ? 'COMPLETED' : (hasTechnician ? 'CURRENT' : (isResolved ? 'COMPLETED' : 'PENDING'))
      },
      {
        step: 4,
        title: 'Field Remediation in Progress',
        description: isResolved
          ? 'On-ground maintenance and repair work completed.'
          : ((hasTechnician && (assignedTech.status === 'Accepted' || assignedTech.status === 'In Progress'))
            ? 'Technician active on ground for site repair.' : 'Pending technician acceptance & site work.'),
        status: isResolved ? 'COMPLETED' : ((hasTechnician && (assignedTech.status === 'Accepted' || assignedTech.status === 'In Progress')) ? 'CURRENT' : 'PENDING')
      },
      {
        step: 5,
        title: 'Civic Problem Resolved',
        description: isResolved ? 'Ground remediation verified and closed.' : 'Awaiting completion verification.',
        status: isResolved ? 'COMPLETED' : 'PENDING'
      }
    ];
  }

  // University / R&D Lifecycle
  return [
    {
      step: 1,
      title: 'Problem Submitted',
      description: 'Filed with citizen location & category classification.',
      status: 'COMPLETED'
    },
    {
      step: 2,
      title: 'State Nodal Review',
      description: 'State Nodal team evaluating societal innovation scope.',
      status: (challenge.status === 'Submitted' && !isUniAssigned) ? 'CURRENT' : 'COMPLETED'
    },
    {
      step: 3,
      title: 'University Lab Assigned',
      description: isUniAssigned
        ? `Allocated to ${assignedUni.name || 'University Lab'} for R&D.`
        : 'Matching with university research departments & faculty mentors.',
      status: isUniAssigned ? 'COMPLETED' : 'PENDING'
    },
    {
      step: 4,
      title: 'Prototype Solution Development',
      description: isResolved
        ? 'Operational prototype tested and certified.'
        : (isUniAssigned ? 'Faculty & student researchers building working prototype.' : 'Awaiting lab allocation.'),
      status: isResolved ? 'COMPLETED' : (isUniAssigned ? 'CURRENT' : 'PENDING')
    },
    {
      step: 5,
      title: 'Field Deployment & Resolved',
      description: isResolved ? 'Certified prototype deployed on ground for societal impact.' : 'Pending field testing rollout.',
      status: isResolved ? 'COMPLETED' : 'PENDING'
    }
  ];
}

export default getChallengeMilestones;
