import { projectCsrSyncService } from '../../../services/projectCsrSyncService.js';
import apiClient from '../../../../../infrastructure/api/client.js';

export async function executeTrancheDisbursal({
  proposal,
  linkedProject,
  amountToSend,
  disburseAmount,
  rawDisbursed = 0,
  totalBudgetVal = 80000,
  trancheReq,
  onUpdateProposal
}) {
  const sendAmount = Number(amountToSend || disburseAmount) || 40000;
  const currentDisbursedNum = rawDisbursed || Number(String(proposal.disbursedAmount || linkedProject?.disbursedAmount || '0').replace(/[^\d]/g, '')) || 0;
  const newCumulative = currentDisbursedNum + sendAmount;
  const totalBudget = Math.max(
    Number(String(totalBudgetVal || '0').replace(/[^\d]/g, '')) || 0,
    Number(String(proposal.proposedBudget || proposal.allocatedAmount || proposal.fundingRequested || '0').replace(/[^\d]/g, '')) || 0,
    80000
  );
  const isFullNow = newCumulative >= totalBudget;
  const isFirst = currentDisbursedNum === 0;
  const utr = `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const pId = proposal.projectId || proposal.id?.replace('PROP-', '') || proposal.id;
  const uniCode = proposal.universityCode || linkedProject?.universityCode || 'RU001';
  const sanctionOrderNo = proposal.sanctionOrderNo || linkedProject?.sanctionOrderNo || `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newPayment = {
    id: `PAY-${Math.floor(90000 + Math.random() * 9999)}`,
    payer: 'Govt State Treasury (PFMS Escrow)',
    payee: proposal.institutionName || proposal.hei || 'Ranchi University (RU001)',
    amount: `₹ ${sendAmount.toLocaleString('en-IN')}`,
    rawAmount: sendAmount,
    disbursedAmount: `₹ ${sendAmount.toLocaleString('en-IN')}`,
    mode: 'Direct PFMS',
    utrNumber: utr,
    makerCheckerSign: 'Authorized by State Nodal Officer',
    makerCheckerStatus: 'Approved',
    bankAckStatus: 'Credited to University Escrow',
    bankStatus: 'success',
    timestamp: new Date().toLocaleDateString('en-IN'),
    scheme: proposal.sourceScheme || 'State Innovation Grant',
    projectRef: pId,
    projectTitle: proposal.projectTitle || proposal.title,
    challengeId: proposal.challengeId || '',
    tdsAmount: '₹ 0',
    netDisbursed: `₹ ${sendAmount.toLocaleString('en-IN')}`,
    sanctionOrderNo,
    purpose: isFirst
      ? 'First Tranche Disbursal (Initial Grant Release)'
      : isFullNow
      ? 'Final Tranche Full Settlement'
      : 'Milestone Tranche Grant Disbursal'
  };

  await projectCsrSyncService.recordDisbursal(newPayment);

  const updatePayload = {
    universityCode: uniCode,
    sanctionedBudget: `₹ ${totalBudget.toLocaleString('en-IN')}`,
    disbursedAmount: `₹ ${newCumulative.toLocaleString('en-IN')}`,
    budgetStatus: isFullNow ? 'Grant Fully Disbursed' : 'Grant Disbursed',
    sanctionOrderNo,
    status: 'In Progress',
    progressPercentage: isFullNow ? 100 : 71,
    milestonesCompleted: isFullNow ? 7 : 5,
    trancheRequest: { status: 'Disbursed', amount: sendAmount, disbursedAt: new Date() }
  };

  if (pId) {
    try {
      await apiClient.put(`university/projects/${pId}?universityCode=${uniCode}`, updatePayload);
      await apiClient.patch(`university/approvals/${pId}?universityCode=${uniCode}`, updatePayload).catch(() => {});
      if (!pId.startsWith('APP-')) {
        await apiClient.patch(`university/approvals/APP-${pId}?universityCode=${uniCode}`, updatePayload).catch(() => {});
      }
      projectCsrSyncService.updateProposalTrancheRequest(pId, { status: 'Disbursed' });
    } catch (err) {
      console.warn('Sync project disbursal error to MongoDB:', err);
    }
  }

  const updatedProposal = {
    ...proposal,
    status: 'In Progress',
    budgetStatus: isFullNow ? 'Grant Fully Disbursed' : 'Grant Disbursed',
    disbursedAmount: `₹ ${newCumulative.toLocaleString('en-IN')}`,
    sanctionedAmount: `₹ ${totalBudget.toLocaleString('en-IN')}`,
    sanctionOrderNo,
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Approved (A-Grade)',
    boardApprovalStatus: 'approved',
    mouExecution: 'Signed & Active',
    progressPercentage: isFullNow ? 100 : 71,
    milestonesCompleted: isFullNow ? 7 : 5
  };

  if (onUpdateProposal) {
    onUpdateProposal(updatedProposal);
  }

  return {
    success: true,
    newDisbursedTotal: newCumulative,
    isFullNow,
    newPayment,
    updatedProposal
  };
}

export async function executeApproveAndSanction({
  proposal,
  linkedProject,
  disburseAmount = 40000,
  localDueDiligence,
  localBoardApproval,
  localMouExecution,
  adminNote,
  onUpdateProposal
}) {
  const sanctionOrderNo = proposal.sanctionOrderNo || linkedProject?.sanctionOrderNo || `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const sanctionedAmount = proposal.fundingRequested || proposal.allocatedAmount || proposal.budget || '₹ 80,000';
  const pId = proposal.projectId || proposal.id?.replace('PROP-', '') || proposal.id;
  const uniCode = proposal.universityCode || linkedProject?.universityCode || 'RU001';

  const updated = {
    ...proposal,
    status: 'In Progress',
    dueDiligence: localDueDiligence || 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: localBoardApproval || 'Approved (A-Grade)',
    boardApprovalStatus: 'approved',
    mouExecution: localMouExecution || 'Signed & Active',
    budgetStatus: 'Grant Disbursed',
    sanctionOrderNo,
    sanctionedAmount,
    reviewerNotes: adminNote || proposal.reviewerNotes,
    progressPercentage: 71,
    milestonesCompleted: 5
  };

  if (pId) {
    try {
      await apiClient.put(`university/projects/${pId}?universityCode=${uniCode}`, {
        universityCode: uniCode,
        budgetStatus: 'Grant Disbursed',
        sanctionOrderNo,
        sanctionedBudget: sanctionedAmount,
        status: 'In Progress',
        progressPercentage: 71,
        milestonesCompleted: 5,
        adminRemarks: adminNote || 'Grant Sanctioned and Approved by Government Review Board.'
      });
    } catch (e) {
      console.warn('Sync grant sanction error:', e);
    }
  }

  await projectCsrSyncService.approveProposalFromProjects(updated);
  if (onUpdateProposal) {
    onUpdateProposal(updated);
  }

  return updated;
}

export default { executeTrancheDisbursal, executeApproveAndSanction };
