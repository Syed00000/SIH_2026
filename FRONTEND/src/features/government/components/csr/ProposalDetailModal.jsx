import React, { useState } from 'react';
import { ProposalOverviewTab } from './dossier/ProposalOverviewTab.jsx';
import { ProposalTechnicalTab } from './dossier/ProposalTechnicalTab.jsx';
import { ProposalBudgetTab } from './dossier/ProposalBudgetTab.jsx';
import { ProposalPaymentsTab } from './dossier/ProposalPaymentsTab.jsx';
import { ProposalDueDiligenceTab } from './dossier/ProposalDueDiligenceTab.jsx';
import { ProposalModalHeader } from './dossier/ProposalModalHeader.jsx';
import { ProposalModalFooter } from './dossier/ProposalModalFooter.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import apiClient from '../../../../infrastructure/api/client.js';

export const ProposalDetailModal = ({
  isOpen,
  onClose,
  proposal,
  onUpdateProposal,
  onInitiateDisbursal
}) => {
  if (!isOpen || !proposal) return null;

  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [localDueDiligence, setLocalDueDiligence] = useState(proposal.dueDiligence || 'Passed (Technical Review)');
  const [localBoardApproval, setLocalBoardApproval] = useState(proposal.boardApproval || 'Approved (A-Grade)');
  const [localMouExecution, setLocalMouExecution] = useState(proposal.mouExecution || 'Signed & Active');
  const [adminNote, setAdminNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeProjects = projectCsrSyncService.getActiveProjects();
  const linkedProject = activeProjects.find(
    (p) => p.id === proposal.id || p.id === proposal.id?.replace('PROP-', '') || p.id === proposal.projectId || p.title === proposal.projectTitle
  );

  const paymentLedger = projectCsrSyncService.getCsrLedger();
  const linkedPayments = paymentLedger.filter(
    (p) => p.projectRef === proposal.id || p.projectRef === proposal.projectId || p.projectRef === proposal.id?.replace('PROP-', '') || (proposal.institutionName && p.payee?.toLowerCase().includes(proposal.institutionName.toLowerCase()))
  );

  const bProp = Number(String(proposal.proposedBudget || '0').replace(/[^\d]/g, '')) || 0;
  const bAlloc = Number(String(proposal.allocatedAmount || '0').replace(/[^\d]/g, '')) || 0;
  const bFund = Number(String(proposal.fundingRequested || '0').replace(/[^\d]/g, '')) || 0;
  const bBase = Number(String(proposal.budget || linkedProject?.sanctionedGrant || '0').replace(/[^\d]/g, '')) || 0;
  const totalBudgetVal = Math.max(bProp, bAlloc, bFund, bBase, 80000);
  const rawDisbursed = linkedPayments.reduce(
    (acc, pay) => acc + (Number(pay.rawAmount) || Number(String(pay.amount || '0').replace(/[^\d]/g, '')) || 0),
    0
  );
  const remainingBudget = Math.max(0, totalBudgetVal - rawDisbursed);
  const isFullyDisbursed = totalBudgetVal > 0 && rawDisbursed >= totalBudgetVal;
  const hasTrancheRequest = Boolean(
    proposal.trancheRequest?.status === 'Pending' || linkedProject?.trancheRequest?.status === 'Pending'
  );

  const handleSaveStatus = async () => {
    const isFailed = localDueDiligence.includes('Failed') || localBoardApproval.includes('Rejected');
    const updated = {
      ...proposal,
      dueDiligence: localDueDiligence,
      dueDiligenceStatus: isFailed ? 'failed' : 'passed',
      boardApproval: localBoardApproval,
      boardApprovalStatus: isFailed ? 'rejected' : 'approved',
      mouExecution: localMouExecution,
      adminNote: adminNote || proposal.adminNote
    };
    onUpdateProposal(updated);
    setIsSaved(true);
    setTimeout(() => { setIsSaved(false); onClose(); }, 1200);
  };

  const handleApproveAndSanction = async () => {
    setIsProcessing(true);
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

    try {
      const projId = proposal.projectId || proposal.id?.replace('PROP-', '');
      if (projId) {
        await apiClient.put(`university/projects/${projId}`, {
          budgetStatus: 'Grant Sanctioned by Government',
          sanctionOrderNo,
          sanctionedBudget: sanctionedAmount,
          progressPercentage: 57,
          milestonesCompleted: 4
        });
      }
    } catch (e) {
      console.warn('Sync grant sanction error:', e);
    }

    onUpdateProposal(updated);
    setIsProcessing(false);
    setIsSaved(true);
    setTimeout(() => { setIsSaved(false); onClose(); }, 1200);
  };

  const handleDisburseSecondEmi = async () => {
    setIsProcessing(true);
    try {
      const utr = `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      const pId = proposal.projectId || proposal.id?.replace('PROP-', '') || proposal.id;
      const newPayment = {
        id: `PAY-${Math.floor(90000 + Math.random() * 9999)}`,
        payer: 'Govt State Treasury (PFMS Escrow)',
        payee: proposal.institutionName || 'Ranchi University (RU001)',
        amount: `₹ ${remainingBudget.toLocaleString('en-IN')}`,
        rawAmount: remainingBudget,
        disbursedAmount: `₹ ${remainingBudget.toLocaleString('en-IN')}`,
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
        netDisbursed: `₹ ${remainingBudget.toLocaleString('en-IN')}`,
        purpose: 'Second EMI / Final Tranche Grant Disbursal'
      };

      await projectCsrSyncService.recordDisbursal(newPayment);
      setIsSaved(true);
    } catch (e) {
      console.warn('Disburse second EMI error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestRevision = () => {
    onUpdateProposal({ ...proposal, dueDiligence: 'Revision Requested', budgetStatus: 'Changes Required' });
    onClose();
  };

  const handlePrintSanctionOrder = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden transition-all" onClick={(e) => e.stopPropagation()}>
        <ProposalModalHeader
          proposal={proposal}
          onClose={onClose}
          handlePrintSanctionOrder={handlePrintSanctionOrder}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />

        <div className="p-6 overflow-y-auto space-y-4 max-h-[calc(92vh-140px)]">
          {activeSubTab === 'overview' && <ProposalOverviewTab proposal={proposal} linkedProject={linkedProject} />}
          {activeSubTab === 'methodology' && <ProposalTechnicalTab proposal={proposal} />}
          {activeSubTab === 'budget' && <ProposalBudgetTab proposal={proposal} />}
          {activeSubTab === 'payments' && <ProposalPaymentsTab proposal={proposal} linkedPayments={linkedPayments} onInitiateDisbursal={onInitiateDisbursal} />}
          {activeSubTab === 'statutory' && (
            <ProposalDueDiligenceTab
              localBoardApproval={localBoardApproval} setLocalBoardApproval={setLocalBoardApproval}
              localDueDiligence={localDueDiligence} setLocalDueDiligence={setLocalDueDiligence}
              localMouExecution={localMouExecution} setLocalMouExecution={setLocalMouExecution}
              adminNote={adminNote} setAdminNote={setAdminNote}
            />
          )}
        </div>

        <ProposalModalFooter
          onClose={onClose}
          isSaved={isSaved}
          isProcessing={isProcessing}
          isFullyDisbursed={isFullyDisbursed}
          hasTrancheRequest={hasTrancheRequest}
          remainingBudget={remainingBudget}
          handleSaveStatus={handleSaveStatus}
          handleRequestRevision={handleRequestRevision}
          handleApproveAndSanction={handleApproveAndSanction}
          handleDisburseSecondEmi={handleDisburseSecondEmi}
        />
      </div>
    </div>
  );
};

export default ProposalDetailModal;
