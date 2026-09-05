import React, { useState } from 'react';
import { ProposalOverviewTab } from './dossier/ProposalOverviewTab.jsx';
import { ProposalTechnicalTab } from './dossier/ProposalTechnicalTab.jsx';
import { ProposalBudgetTab } from './dossier/ProposalBudgetTab.jsx';
import { ProposalPaymentsTab } from './dossier/ProposalPaymentsTab.jsx';
import { ProposalDueDiligenceTab } from './dossier/ProposalDueDiligenceTab.jsx';
import { ProposalModalHeader } from './dossier/ProposalModalHeader.jsx';
import { ProposalModalFooter } from './dossier/ProposalModalFooter.jsx';
import { executeTrancheDisbursal, executeApproveAndSanction } from './dossier/disbursalActionHelper.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

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
  const trancheReq = proposal.trancheRequest || linkedProject?.trancheRequest;
  const hasTrancheRequest = Boolean(trancheReq?.status === 'Pending');
  const reqAmt = Number(trancheReq?.amount) || 0;

  // User-adjusted disbursal amount (auto-fills to University requested amount if pending)
  const [disburseAmount, setDisburseAmount] = useState(
    hasTrancheRequest && reqAmt > 0 ? reqAmt : rawDisbursed === 0 ? Math.round(remainingBudget * 0.5) : remainingBudget
  );

  React.useEffect(() => {
    if (hasTrancheRequest && reqAmt > 0) {
      setDisburseAmount(reqAmt);
    } else {
      setDisburseAmount(rawDisbursed === 0 ? Math.round(remainingBudget * 0.5) : remainingBudget);
    }
  }, [proposal.id, remainingBudget, rawDisbursed, hasTrancheRequest, reqAmt]);

  const handleSaveStatus = async () => {
    const isFailed = localDueDiligence.includes('Failed') || localBoardApproval.includes('Rejected');
    onUpdateProposal({
      ...proposal,
      dueDiligence: localDueDiligence,
      dueDiligenceStatus: isFailed ? 'failed' : 'passed',
      boardApproval: localBoardApproval,
      boardApprovalStatus: isFailed ? 'rejected' : 'approved',
      mouExecution: localMouExecution,
      adminNote: adminNote || proposal.adminNote
    });
    setIsSaved(true);
    setTimeout(() => { setIsSaved(false); onClose(); }, 1200);
  };

  const handleApproveAndSanction = async () => {
    setIsProcessing(true);
    try {
      const updated = await executeApproveAndSanction({ proposal });
      onUpdateProposal(updated);
      setIsSaved(true);
      setTimeout(() => { setIsSaved(false); onClose(); }, 1200);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisburseTranche = async () => {
    setIsProcessing(true);
    try {
      const amountToSend = Math.min(remainingBudget, Math.max(1000, Number(disburseAmount) || remainingBudget));
      const res = await executeTrancheDisbursal({
        proposal,
        amountToSend,
        rawDisbursed,
        totalBudgetVal
      });
      if (res?.success) {
        onUpdateProposal({
          ...proposal,
          disbursedAmount: `₹ ${res.newDisbursedTotal.toLocaleString('en-IN')}`,
          budgetStatus: res.isFullNow ? 'Grant Fully Disbursed' : 'Grant Disbursed'
        });
        setIsSaved(true);
        setTimeout(() => { setIsSaved(false); onClose(); }, 1200);
      }
    } catch (e) {
      console.warn('Disburse tranche error:', e);
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
          {activeSubTab === 'overview' && (
            <ProposalOverviewTab
              proposal={proposal}
              linkedProject={linkedProject}
              disburseAmount={disburseAmount}
              setDisburseAmount={setDisburseAmount}
            />
          )}
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
          rawDisbursed={rawDisbursed}
          disburseAmount={disburseAmount}
          setDisburseAmount={setDisburseAmount}
          handleSaveStatus={handleSaveStatus}
          handleRequestRevision={handleRequestRevision}
          handleApproveAndSanction={handleApproveAndSanction}
          handleDisburseSecondEmi={handleDisburseTranche}
        />
      </div>
    </div>
  );
};

export default ProposalDetailModal;
