import { universityApiService } from '../../../../university/services/universityApiService.js';

export const saveProposalDraft = async ({ currentProject, totalCalculatedBudget, budgetItems, methodology, milestoneStages }) => {
  const budgetFormatted = `₹ ${totalCalculatedBudget.toLocaleString('en-IN')}`;
  const budgetBreakdown = budgetItems.map((item) => ({
    category: item.title || 'Custom Line Item',
    amount: `₹ ${Number(item.amount || 0).toLocaleString('en-IN')}`,
    amountNumber: Number(item.amount || 0)
  }));

  return universityApiService.updateProject(currentProject.projectId || currentProject._id, {
    ...currentProject,
    methodology,
    milestoneRoadmap: milestoneStages,
    budget: budgetFormatted,
    budgetBreakdown,
    proposedBudget: budgetFormatted
  });
};

export const submitProposalFinal = async ({ currentProject, totalCalculatedBudget, budgetItems, methodology, milestoneStages }) => {
  const budgetFormatted = `₹ ${totalCalculatedBudget.toLocaleString('en-IN')}`;
  const budgetBreakdown = budgetItems.map((item) => ({
    category: item.title || 'Custom Line Item',
    amount: `₹ ${Number(item.amount || 0).toLocaleString('en-IN')}`,
    amountNumber: Number(item.amount || 0)
  }));

  const isRevision = currentProject.budgetStatus?.includes('Changes Required') || (currentProject.revisionCount || 0) > 0;
  const nextRevCount = isRevision ? Number(currentProject.revisionCount || 1) + 1 : 1;

  const updatedMilestones = currentProject.milestones?.length
    ? currentProject.milestones.map((m, idx) => {
        if (idx <= 2) return { ...m, status: 'Completed', completedAt: m.completedAt || new Date() };
        if (idx === 3 && m.status === 'Pending') return { ...m, status: 'In Progress' };
        return m;
      })
    : [];

  return universityApiService.updateProject(currentProject.projectId || currentProject._id, {
    ...currentProject,
    adminRemarks: '',
    universityRemarks: '',
    methodology,
    milestoneRoadmap: milestoneStages,
    budget: budgetFormatted,
    budgetBreakdown,
    proposedBudget: budgetFormatted,
    budgetStatus: 'Submitted to University for Review',
    isRevised: isRevision,
    revisionCount: nextRevCount,
    milestones: updatedMilestones,
    milestonesCompleted: 3,
    progressPercentage: 43
  });
};
