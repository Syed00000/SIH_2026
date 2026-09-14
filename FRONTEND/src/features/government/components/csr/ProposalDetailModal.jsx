import React, { useState, useEffect } from 'react';
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
  isOpen = true,
  onClose,
  proposal,
  onUpdateProposal,
  onInitiateDisbursal
}) => {
  if (!proposal) return null;

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

  const [disburseAmount, setDisburseAmount] = useState(
    hasTrancheRequest && reqAmt > 0 ? reqAmt : rawDisbursed === 0 ? Math.round(remainingBudget * 0.5) : remainingBudget
  );

  useEffect(() => {
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
      reviewerNotes: adminNote || proposal.reviewerNotes
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleApproveAndSanction = async () => {
    setIsProcessing(true);
    try {
      const updated = await executeApproveAndSanction({
        proposal,
        linkedProject,
        disburseAmount,
        localDueDiligence,
        localBoardApproval,
        localMouExecution,
        adminNote,
        onUpdateProposal
      });
      if (updated) {
        setIsSaved(true);
        setTimeout(() => { setIsSaved(false); onClose(); }, 1200);
      }
    } catch (e) {
      console.warn('Approve & Sanction error:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDisburseTranche = async () => {
    setIsProcessing(true);
    try {
      const updated = await executeTrancheDisbursal({
        proposal,
        linkedProject,
        disburseAmount,
        rawDisbursed,
        totalBudgetVal,
        trancheReq,
        onUpdateProposal
      });
      if (updated) {
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

  return (
    <div className="w-full space-y-4 max-w-7xl mx-auto pb-12 select-none animate-fadeIn text-left">
      <div className="bg-white border border-slate-300 rounded-md shadow-sm flex flex-col overflow-hidden transition-all">
        <ProposalModalHeader
          proposal={proposal}
          onClose={onClose}
          handlePrintSanctionOrder={() => window.print()}
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
        />

        <div className="p-6 sm:p-8 space-y-6 min-h-[500px]">
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
          {activeSubTab === 'payments' && (
            <ProposalPaymentsTab
              proposal={proposal}
              linkedPayments={linkedPayments}
              onInitiateDisbursal={onInitiateDisbursal}
            />
          )}
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
