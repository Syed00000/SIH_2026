export function getChallengeMilestones(challenge = {}) {
  const steps = [];
  const isResolved = challenge.status === 'Resolved' || challenge.status === 'Deployed';
  let stepIndex = 1;

  // Step 1: Submission
  steps.push({
    step: stepIndex++,
    title: 'Problem Submitted',
    description: 'Filed with citizen location & category classification.',
    status: 'COMPLETED'
  });

  // Step 2: Nodal Review
  const hasFurtherAssignment = Boolean(
    challenge.assignedUniversity?.name || challenge.assignedUniversity?.universityName ||
    challenge.assignedDepartment?.name || challenge.assignedDepartment?.deptId ||
    challenge.assignedBlock?.name || challenge.assignedBlock ||
    challenge.assignedWard?.name || challenge.assignedWard
  );

  steps.push({
    step: stepIndex++,
    title: 'State Nodal Review',
    description: 'State Nodal team evaluating and routing the problem.',
    status: hasFurtherAssignment ? 'COMPLETED' : (isResolved ? 'COMPLETED' : 'CURRENT')
  });

  if (!hasFurtherAssignment && !isResolved) {
    return steps;
  }

  // 3. Assignments
  if (challenge.assignedUniversity?.name || challenge.assignedUniversity?.universityName) {
    const uniName = challenge.assignedUniversity.name || challenge.assignedUniversity.universityName;
    steps.push({
      step: stepIndex++,
      title: 'University Lab Assigned',
      description: `Allocated to ${uniName} for R&D.`,
      status: 'COMPLETED'
    });

    if (challenge.assignedFaculty?.name) {
      steps.push({
        step: stepIndex++,
        title: 'Prototype Solution Development',
        description: `Faculty & student researchers building working prototype under ${challenge.assignedFaculty.name}.`,
        status: isResolved ? 'COMPLETED' : 'CURRENT'
      });
    } else if (!isResolved) {
      steps.push({
        step: stepIndex++,
        title: 'Prototype Solution Development',
        description: 'Awaiting lab allocation and faculty assignment.',
        status: 'CURRENT'
      });
    }
  }

  if (challenge.assignedWard?.name) {
    steps.push({
      step: stepIndex++,
      title: 'Ward Commissioner Assigned',
      description: `Triage assigned to ${challenge.assignedWard.name}.`,
      status: 'COMPLETED'
    });
  }

  if (challenge.assignedBlock?.name || typeof challenge.assignedBlock === 'string') {
    const bName = typeof challenge.assignedBlock === 'string' ? challenge.assignedBlock : challenge.assignedBlock.name;
    steps.push({
      step: stepIndex++,
      title: 'Block / Tehsil Assigned',
      description: `Problem routed to ${bName}.`,
      status: 'COMPLETED'
    });
  }

  if (challenge.assignedDepartment?.name) {
    const deptName = challenge.assignedDepartment.name;
    steps.push({
      step: stepIndex++,
      title: 'Department Assigned',
      description: `Problem escalated to ${deptName}.`,
      status: 'COMPLETED'
    });
  }

  // 4. Escalation Chain
  if (challenge.escalationEvidence && challenge.escalationEvidence.length > 0) {
    challenge.escalationEvidence.forEach(esc => {
      steps.push({
        step: stepIndex++,
        title: esc.level === 'Department' ? `Forwarded to ${esc.authorityName || 'Department'}` : `Escalated: ${esc.authorityName || 'Higher Authority'}`,
        description: esc.remarks || 'Problem routed to further department for action.',
        status: 'COMPLETED'
      });
    });
  }

  // 5. Technician
  const assignedTech = challenge.assignedTechnician;
  const hasTechnician = Boolean(assignedTech?.name || assignedTech?.technicianId || assignedTech?.phone);

  if (hasTechnician) {
    const techAccepted = assignedTech.status === 'Accepted' || assignedTech.status === 'Completed';
    steps.push({
      step: stepIndex++,
      title: techAccepted ? 'Field Technician Accepted' : 'Field Technician Dispatched',
      description: techAccepted
        ? `${assignedTech.name} accepted • Ph: ${assignedTech.phone}`
        : `Assigned to ${assignedTech.name}. Awaiting technician acceptance.`,
      status: techAccepted ? 'COMPLETED' : 'CURRENT'
    });

    if (techAccepted || assignedTech.status === 'In Progress' || isResolved) {
      steps.push({
        step: stepIndex++,
        title: 'Field Remediation in Progress',
        description: isResolved ? 'On-ground maintenance and repair work completed.' : 'Technician active on ground for site repair.',
        status: isResolved ? 'COMPLETED' : 'CURRENT'
      });
    }
  }

  // 6. Resolution
  if (isResolved) {
    steps.push({
      step: stepIndex++,
      title: challenge.status === 'Deployed' ? 'Field Deployment & Resolved' : 'Civic Problem Resolved',
      description: challenge.status === 'Deployed' ? 'Certified prototype deployed on ground for societal impact.' : 'Resolution verified and closed with evidence.',
      status: 'COMPLETED'
    });
  } else if (hasFurtherAssignment && !steps.some(s => s.status === 'CURRENT')) {
    steps.push({
      step: stepIndex++,
      title: 'Resolution in Progress',
      description: 'Awaiting completion verification.',
      status: 'CURRENT'
    });
  }

  return steps;
}

export default getChallengeMilestones;
