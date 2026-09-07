import React, { useState, useEffect } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { universityApiService } from '../../services/universityApiService.js';
import { PrototypeLabTestingSection } from './PrototypeLabTestingSection.jsx';
import { GovernmentGrantStatusCard } from './GovernmentGrantStatusCard.jsx';
import { PrototypePhasesView } from './PrototypePhasesView.jsx';
import { ProposalDetailSections } from './ProposalDetailSections.jsx';
import { ApprovalModalMetadata } from './ApprovalModalMetadata.jsx';
import { ApprovalModalActions } from './ApprovalModalActions.jsx';
import { projectCsrSyncService } from '../../../government/services/projectCsrSyncService.js';

const statusBadge = (s = '') => {
  if (s === 'Deployed') return 'bg-teal-50 text-teal-800 border-teal-300';
  if (s === 'Approved') return 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (s === 'Pending') return 'bg-amber-50 text-amber-800 border-amber-300';
  if (s === 'Rejected') return 'bg-rose-50 text-rose-800 border-rose-300';
  if (s === 'Changes Required') return 'bg-orange-50 text-orange-800 border-orange-300';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

export const ApprovalDetailModal = ({
  approval,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
  onDelete
}) => {
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [forwarded, setForwarded] = useState(false);
  const [isForwarding, setIsForwarding] = useState(false);

  useEffect(() => {
    setRemarks('');
    setForwarded(Boolean(approval?.sentToGovernment));
  }, [approval?.approvalId, isOpen]);

  if (!isOpen || !approval) return null;

  const canAct = approval.status === 'Pending' || approval.status === 'Changes Required';

  const lineItemsSum = Array.isArray(approval?.budgetBreakdown) && approval.budgetBreakdown.length > 0
    ? approval.budgetBreakdown.reduce((sum, item) => sum + (typeof item.amount === 'number' ? item.amount : Number(String(item.amount || '0').replace(/[^\d]/g, '')) || 0), 0)
    : 0;
  const effectiveTotalNum = lineItemsSum > 0 ? lineItemsSum : (Number(String(approval?.proposedBudget || approval?.estimatedBudget || '80000').replace(/[^\d]/g, '')) || 80000);
  const baselineBudget = Number(String(approval?.baselineBudget || '80000').replace(/[^\d]/g, '')) || 80000;
  const effectiveExtraNum = Math.max(0, effectiveTotalNum - baselineBudget);
  const totalFormatted = `₹ ${effectiveTotalNum.toLocaleString('en-IN')}`;

  const handleSendToGovernment = async () => {
    setIsForwarding(true);
    try {
      const projId = approval.projectId || approval.challengeId || approval.projectRef || approval.approvalId;
      await universityApiService.forwardPrototypeToGovernment(projId, 'RU001', remarks);
      if (onApprove) {
        await onApprove(approval, remarks, {
          sentToGovernment: true,
          governmentStatus: 'Under State Evaluation',
          status: 'Approved',
          prototypeStatus: 'Approved'
        });
      }
      try { await projectCsrSyncService.initializeFromBackend(); } catch {}
      setForwarded(true);
      setRemarks('');
      onClose();
    } catch (err) {
      console.error('Failed to send prototype to government:', err);
    } finally {
      setIsForwarding(false);
    }
  };

  const handleAction = async (actionFn, fallbackStatus = 'Approved') => {
    setIsProcessing(true);
    try {
      const isApproved = fallbackStatus === 'Approved';
      const payloadExtra = {
        budget: totalFormatted,
        proposedBudget: totalFormatted,
        additionalAmount: effectiveExtraNum,
        budgetBreakdown: approval.budgetBreakdown,
        sentToGovernment: isApproved,
        governmentStatus: isApproved ? 'Under State Evaluation' : undefined,
        budgetStatus: isApproved ? 'Forwarded to CSR Grants Pipeline' : (fallbackStatus === 'Changes Required' ? 'Changes Required by University' : undefined)
      };

      if (typeof actionFn === 'function') {
        await actionFn(approval, remarks, payloadExtra);
      }
      setRemarks('');
      onClose();
    } catch (err) {
      console.error('Approval action error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setRemarks('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-sm tracking-wider text-emerald-400">{approval.approvalId}</span>
                <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${statusBadge(approval.status)}`}>{approval.status}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold border border-slate-700 bg-slate-800 text-slate-300 rounded-full">University Authority Review</span>
              </div>
              <h2 className="text-sm font-extrabold text-white mt-0.5 line-clamp-1">{approval.project}</h2>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" title="Close dossier">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#fafafa]">
          <ApprovalModalMetadata approval={approval} />

          {approval.type === 'Prototype Approval' ? (
            <div className="space-y-4">
              <PrototypeLabTestingSection approval={approval} />
              <PrototypePhasesView approval={approval} />
            </div>
          ) : (
            <>
              <ProposalDetailSections approval={approval} totalFormatted={totalFormatted} effectiveExtraNum={effectiveExtraNum} />
              <GovernmentGrantStatusCard approval={approval} />
            </>
          )}

          {/* Feedback & Remarks */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
                University Authority Remarks / Feedback for Faculty &amp; Government *
              </label>
              {approval.adminRemarks && (
                <span className="text-[10px] text-slate-400 italic truncate max-w-[280px]" title={approval.adminRemarks}>
                  Last Sent: "{approval.adminRemarks}"
                </span>
              )}
            </div>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="Enter new remarks/feedback for this action..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white resize-none"
            />
            <div className="text-[10px] text-slate-400 text-right">{remarks.length}/500</div>
          </div>
        </div>

        {/* Action Footer */}
        <ApprovalModalActions
          approval={approval}
          remarks={remarks}
          setRemarks={setRemarks}
          isProcessing={isProcessing}
          isForwarding={isForwarding}
          forwarded={forwarded}
          canAct={canAct}
          handleAction={handleAction}
          onRequestChanges={onRequestChanges}
          onReject={onReject}
          onApprove={onApprove}
          onDelete={onDelete}
          handleSendToGovernment={handleSendToGovernment}
          handleClose={handleClose}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default ApprovalDetailModal;
