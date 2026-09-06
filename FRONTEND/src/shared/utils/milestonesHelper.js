export function computeDynamicMilestones(project) {
  if (!project) return [];
  const hasFaculty = Boolean(project.teamLead || project.leadMentor || project.facultyMentor?.name || project.faculty);
  const facultyName = project.teamLead || project.leadMentor || project.facultyMentor?.name || project.faculty?.name || project.faculty || 'binod';
  const hasProposal = Boolean(
    (project.budgetBreakdown && project.budgetBreakdown.length > 0) ||
    project.methodology ||
    project.proposedBudget ||
    project.sentToGovernment ||
    (project.milestonesCompleted || 0) >= 3
  );
  const isForwarded = Boolean(project.sentToGovernment || project.forwardedToGovAt || (project.milestonesCompleted || 0) >= 4);
  const disbNum = Number(String(project.disbursedAmount || project.disbursedGrant || '0').replace(/[^\d]/g, '')) || 0;
  const isFunded = disbNum > 0 || project.budgetStatus === 'Grant Sanctioned by Government' || project.budgetStatus === 'Grant Disbursed' || (project.milestonesCompleted || 0) >= 5;
  const isPrototypeDone = Boolean(
    project.prototypeStatus === 'Approved' ||
    project.prototypeStatus === 'Ready for Deployment' ||
    project.testingCompleted ||
    project.testingReportPdfUrl ||
    (project.milestonesCompleted || 0) >= 6
  );
  const isDeployed = Boolean(project.isDeployed || project.status === 'Deployed' || (project.milestonesCompleted || 0) >= 7 || (project.progress || 0) >= 100);

  const s1 = 'Completed';
  const s2 = hasFaculty ? 'Completed' : 'In Progress';
  const s3 = hasProposal ? 'Completed' : (hasFaculty ? 'In Progress' : 'Pending');
  const s4 = isForwarded ? 'Completed' : (hasProposal ? 'In Progress' : 'Pending');
  const s5 = isFunded ? 'Completed' : (isForwarded ? 'In Progress' : 'Pending');
  const s6 = isPrototypeDone ? 'Completed' : (isFunded ? 'In Progress' : 'Pending');
  const s7 = isDeployed ? 'Completed' : (isPrototypeDone ? 'In Progress' : 'Pending');

  return [
    { id: 1, title: 'Problem Statement Allocated & Scoped', status: s1, description: 'Phase 1 deliverable execution' },
    { id: 2, title: `Lead Faculty Mentor Assigned (${facultyName})`, status: s2, description: 'Phase 2 deliverable execution' },
    { id: 3, title: 'Faculty Solution Analysis & Budget Proposal', status: s3, description: 'Phase 3 deliverable execution' },
    { id: 4, title: 'University Review & Submission to Government', status: s4, description: 'Phase 4 deliverable execution' },
    { id: 5, title: 'Government Budget Sanction & Grant Disbursal', status: s5, description: 'Phase 5 deliverable execution' },
    { id: 6, title: 'Prototype Development & Field Testing', status: s6, description: 'Phase 6 deliverable execution' },
    { id: 7, title: 'Government Handover & Final Audit', status: s7, description: 'Phase 7 deliverable execution' }
  ];
}

export default computeDynamicMilestones;
