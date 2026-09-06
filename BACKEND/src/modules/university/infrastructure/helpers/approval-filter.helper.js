export function isChallengeAcceptedByUniversity(chl) {
  if (!chl || chl.isDeleted || chl.status === 'Declined') return false;
  const accStatus = chl.assignedUniversity?.acceptanceStatus || chl.acceptanceStatus;
  if (accStatus === 'Accepted') return true;
  return chl.status === 'Accepted' || chl.status === 'In Progress' || chl.status === 'Active R&D';
}

export function isApprovalEligible({ a, proj, chl }) {
  if (a.type?.includes('Prototype')) {
    return Boolean(a.testingCompleted || proj?.testingCompleted);
  }

  if (!proj || proj.isDeleted || proj.status === 'Transferred' || proj.status === 'Declined') {
    return false;
  }

  // If tied to a challenge, university must have accepted the challenge
  if (a.challengeId || proj.challengeId) {
    if (!chl || !isChallengeAcceptedByUniversity(chl)) return false;
  }

  const hasFaculty = Boolean(a.requestedBy || a.faculty?.name || proj.leadMentor || proj.facultyMentor?.name);
  const isSubmitted = (
    a.budgetStatus === 'Submitted to University for Review' ||
    a.budgetStatus === 'Grant Sanctioned by Government' ||
    a.budgetStatus === 'Grant Disbursed' ||
    a.budgetStatus === 'Changes Required by Government' ||
    proj.budgetStatus === 'Submitted to University for Review' ||
    proj.budgetStatus === 'Grant Sanctioned by Government' ||
    proj.budgetStatus === 'Grant Disbursed' ||
    proj.budgetStatus === 'Changes Required by Government' ||
    a.isRevised || proj.isRevised ||
    (a.milestoneRoadmap?.length > 0 && a.budgetBreakdown?.length > 0) ||
    (proj.milestoneRoadmap?.length > 0 && proj.budgetBreakdown?.length > 0)
  );

  return hasFaculty && isSubmitted;
}

export function formatApprovalRecord(a, proj) {
  const roadmap = (a.milestoneRoadmap?.length) ? a.milestoneRoadmap : (proj?.milestoneRoadmap || []);
  const bBreakdown = (a.budgetBreakdown?.length) ? a.budgetBreakdown : (proj?.budgetBreakdown || []);
  const bSum = bBreakdown.reduce((s, it) => s + (typeof it.amount === 'number' ? it.amount : Number(String(it.amount || '0').replace(/[^\d]/g, '')) || 0), 0);
  const bTotal = bSum > 0 ? `₹ ${bSum.toLocaleString('en-IN')}` : (a.proposedBudget || a.estimatedBudget || proj?.proposedBudget || '₹ 80,000');
  const bExtra = bSum > 0 ? Math.max(0, bSum - 80000) : (a.additionalAmount || proj?.additionalAmount || 0);

  const isSanctioned = proj?.budgetStatus === 'Grant Sanctioned by Government' || proj?.budgetStatus === 'Grant Disbursed' || a.budgetStatus === 'Grant Sanctioned by Government' || a.budgetStatus === 'Grant Disbursed' || Boolean(a.sanctionOrderNo || proj?.sanctionOrderNo);
  const isChanges = proj?.budgetStatus === 'Changes Required by Government' || a.budgetStatus === 'Changes Required by Government' || a.status === 'Changes Required';
  const isRejected = proj?.status === 'Rejected' || proj?.budgetStatus === 'Rejected' || a.status === 'Rejected';
  const realStatus = isSanctioned ? 'Approved' : isChanges ? 'Changes Required' : isRejected ? 'Rejected' : 'Pending';

  return {
    ...a,
    status: realStatus,
    budgetBreakdown: bBreakdown,
    proposedBudget: bTotal,
    estimatedBudget: bTotal,
    sanctionedBudget: isSanctioned ? (a.sanctionedBudget || proj?.sanctionedBudget || bTotal) : null,
    disbursedAmount: a.disbursedAmount || proj?.disbursedAmount || '₹ 0',
    budgetStatus: isSanctioned ? (a.budgetStatus || proj?.budgetStatus || 'Grant Sanctioned by Government') : (proj?.budgetStatus || a.budgetStatus || 'Pending Review'),
    trancheRequest: a.trancheRequest || proj?.trancheRequest || null,
    additionalAmount: bExtra,
    milestoneRoadmap: roadmap,
    methodology: a.methodology || proj?.methodology || ''
  };
}
