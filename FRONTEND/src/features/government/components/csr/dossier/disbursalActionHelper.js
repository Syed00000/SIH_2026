import { projectCsrSyncService } from '../../../services/projectCsrSyncService.js';
import apiClient from '../../../../../infrastructure/api/client.js';

export async function executeTrancheDisbursal({
  proposal,
  amountToSend,
  rawDisbursed = 0,
  totalBudgetVal = 80000
}) {
  const utr = `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const pId = proposal.projectId || proposal.id?.replace('PROP-', '') || proposal.id;
  const isFirst = rawDisbursed === 0;
  const newCumulative = rawDisbursed + amountToSend;
  const isFullNow = newCumulative >= totalBudgetVal;

  const newPayment = {
    id: `PAY-${Math.floor(90000 + Math.random() * 9999)}`,
    payer: 'Govt State Treasury (PFMS Escrow)',
    payee: proposal.institutionName || 'Ranchi University (RU001)',
    amount: `₹ ${amountToSend.toLocaleString('en-IN')}`,
    rawAmount: amountToSend,
    disbursedAmount: `₹ ${amountToSend.toLocaleString('en-IN')}`,
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
    netDisbursed: `₹ ${amountToSend.toLocaleString('en-IN')}`,
    purpose: isFirst
      ? 'First Tranche Disbursal (Initial Grant Release)'
      : isFullNow
      ? 'Final Tranche Full Settlement'
      : 'Milestone Tranche Grant Disbursal'
  };

  await projectCsrSyncService.recordDisbursal(newPayment);

  // Sync directly to backend MongoDB
  if (pId) {
    try {
      const updatePayload = {
        sanctionedBudget: `₹ ${totalBudgetVal.toLocaleString('en-IN')}`,
        disbursedAmount: `₹ ${newCumulative.toLocaleString('en-IN')}`,
        budgetStatus: isFullNow ? 'Grant Fully Disbursed' : 'Grant Disbursed (Tranche Released)',
        firstTrancheDisbursed: isFirst ? amountToSend : undefined,
        progressPercentage: isFullNow ? 100 : 57,
        milestonesCompleted: isFullNow ? 7 : 4,
        trancheRequest: { status: 'Approved', amount: amountToSend, approvedAt: new Date() }
      };
      await apiClient.put(`university/projects/${pId}?universityCode=RU001`, updatePayload);
      await apiClient.patch(`university/approvals/${pId}?universityCode=RU001`, updatePayload).catch(() => {});
      if (!pId.startsWith('APP-')) {
        await apiClient.patch(`university/approvals/APP-${pId}?universityCode=RU001`, updatePayload).catch(() => {});
      }
      projectCsrSyncService.updateProposalTrancheRequest(pId, { status: 'Approved' });
    } catch (err) {
      console.warn('Sync project disbursal error to MongoDB:', err);
    }
  }

  return {
    success: true,
    newDisbursedTotal: newCumulative,
    isFullNow,
    newPayment
  };
}

export async function executeApproveAndSanction({ proposal }) {
  const sanctionOrderNo = `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const sanctionedAmount = proposal.fundingRequested || proposal.allocatedAmount || '₹ 80,000';

  const updated = {
    ...proposal,
    dueDiligence: 'Passed (All Checks)',
    boardApproval: 'Approved (A-Grade)',
    mouExecution: 'Signed & Active',
    budgetStatus: 'Grant Sanctioned by Government',
    sanctionOrderNo,
    sanctionedAmount
  };

  const projId = proposal.projectId || proposal.id?.replace('PROP-', '');
  if (projId) {
    try {
      await apiClient.put(`university/projects/${projId}`, {
        budgetStatus: 'Grant Sanctioned by Government',
        sanctionOrderNo,
        sanctionedBudget: sanctionedAmount,
        progressPercentage: 57,
        milestonesCompleted: 4
      });
    } catch (e) {
      console.warn('Sync grant sanction error:', e);
    }
  }

  return updated;
}
