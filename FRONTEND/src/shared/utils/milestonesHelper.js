export function computeDynamicMilestones(project) {
  if (!project) return [];
  const hasFaculty = Boolean(project.teamLead || project.leadMentor || project.facultyMentor?.name || project.faculty);
  const facultyName = project.teamLead || project.leadMentor || project.facultyMentor?.name || project.faculty?.name || project.faculty || 'Faculty Mentor';

  const hasProposalSubmitted = Boolean(
    project.budgetStatus === 'Submitted to University for Review' ||
    project.sentToGovernment ||
    project.forwardedToGovAt ||
    project.sanctionOrderNo ||
    (project.disbursedAmount && project.disbursedAmount !== '₹ 0') ||
    (project.budgetBreakdown && project.budgetBreakdown.length > 0 && project.methodology)
  );

  const isForwardedToGov = Boolean(
    project.sentToGovernment === true ||
    project.forwardedToGovAt ||
    project.governmentStatus === 'Under State Evaluation' ||
    project.governmentStatus === 'Approved' ||
    project.sanctionOrderNo
  );

  const disbNum = Number(String(project.disbursedAmount || project.disbursedGrant || '0').replace(/[^\d]/g, '')) || 0;
  const isGrantDisbursed = disbNum > 0 || project.budgetStatus === 'Grant Disbursed' || project.budgetStatus === 'Grant Fully Disbursed' || Boolean(project.sanctionOrderNo && disbNum > 0);

  const isPrototypeApproved = Boolean(
    project.prototypeStatus === 'Approved' ||
    project.prototypeStatus === 'Ready for Deployment' ||
    project.testingCompleted === true ||
    project.isDeployed === true
  );

  const isPrototypeInProgress = Boolean(
    !isPrototypeApproved && (
      project.prototypeStatus === 'In Review' ||
      project.prototypeWorkRequested === true ||
      project.prototypeData?.pdfUrl ||
      isGrantDisbursed
    )
  );

  const isDeployed = Boolean(
    project.isDeployed === true ||
    project.status === 'Deployed' ||
    (project.status === 'Completed' && project.governmentStatus === 'Approved')
  );

  const s1 = 'Completed';
  const s2 = hasFaculty ? 'Completed' : 'In Progress';
  const s3 = hasProposalSubmitted ? 'Completed' : (hasFaculty ? 'In Progress' : 'Pending');
  const s4 = isForwardedToGov ? 'Completed' : (hasProposalSubmitted ? 'In Progress' : 'Pending');
  const s5 = isGrantDisbursed ? 'Completed' : (isForwardedToGov ? 'In Progress' : 'Pending');
  const s6 = isPrototypeApproved ? 'Completed' : (isPrototypeInProgress ? 'In Progress' : 'Pending');
  const s7 = isDeployed ? 'Completed' : (isPrototypeApproved ? 'In Progress' : 'Pending');

  const desc1 = 'Problem statement verified and allocated to University Node';
  const desc2 = hasFaculty ? `Lead Faculty Mentor assigned: ${facultyName}` : 'Assigning Departmental Research Mentor';
  const desc3 = hasProposalSubmitted ? 'Research methodology & DPR line-item budget submitted' : 'Faculty formulation of methodology & budget in progress';
  const desc4 = isForwardedToGov ? 'University Authority evaluated and forwarded dossier to State Government' : (hasProposalSubmitted ? 'Under evaluation by University Technical Review Board' : 'Awaiting Faculty Proposal');
  const desc5 = isGrantDisbursed ? `Grant sanctioned and ₹ ${disbNum.toLocaleString('en-IN')} disbursed via PFMS Escrow` : (isForwardedToGov ? 'Under State Government CSR Grants Committee evaluation' : 'Pending University Forwarding');
  const desc6 = isPrototypeApproved ? 'Prototype verified and approved by University Review Committee' : (project.prototypeStatus === 'In Review' ? 'Prototype blueprint submitted • University Review in progress' : isGrantDisbursed ? 'Prototype R&D and field testing commenced' : 'Pending Grant Disbursal');
  const desc7 = isDeployed ? 'State certified and publicly deployed (TRL-9)' : (isPrototypeApproved ? 'Awaiting final State Handover & public deployment audit' : 'Pending Prototype Completion');

  return [
    { id: 1, title: 'Problem Statement Allocated & Scoped', status: s1, description: desc1 },
    { id: 2, title: `Lead Faculty Mentor Assigned (${facultyName})`, status: s2, description: desc2 },
    { id: 3, title: 'Faculty Solution Analysis & Budget Proposal', status: s3, description: desc3 },
    { id: 4, title: 'University Review & Submission to Government', status: s4, description: desc4 },
    { id: 5, title: 'Government Budget Sanction & Grant Disbursal', status: s5, description: desc5 },
    { id: 6, title: 'Prototype Development & Field Testing', status: s6, description: desc6 },
    { id: 7, title: 'Government Handover & Final Audit', status: s7, description: desc7 }
  ];
}

export default computeDynamicMilestones;
