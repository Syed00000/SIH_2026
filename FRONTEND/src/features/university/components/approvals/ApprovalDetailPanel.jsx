import React, { useState } from 'react';
import {
  CheckCircle2, RotateCcw, XCircle, Eye,
  Lock, Send
} from 'lucide-react';
import { FullPageDetailPanel } from '../../../../shared/components/layout/FullPageDetailPanel.jsx';
import { GovernmentGrantStatusCard } from './GovernmentGrantStatusCard.jsx';
import { PrototypeLabTestingSection } from './PrototypeLabTestingSection.jsx';
import { IndustryMentorApprovalCard } from './IndustryMentorApprovalCard.jsx';

export const ApprovalDetailPanel = ({
  approval,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
  onViewProblemDossier
}) => {
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeActionTab, setActiveActionTab] = useState(null);

  if (!approval) return null;

  const isDeployed = Boolean(
    approval.isDeployed || approval.isLocked || approval.status === 'Deployed' ||
    approval.governmentStatus === 'Approved' || approval.governmentStatus === 'Approved & Deployed'
  );
  const isForwarded = Boolean(
    approval.sentToGovernment || approval.governmentStatus === 'Under State Evaluation' || approval.governmentStatus === 'Approved'
  );
  const isApproved = approval.status === 'Approved' || isForwarded || isDeployed;
  const isProto = approval.type === 'Prototype Approval';

  const handleAction = async (type) => {
    if (isDeployed || isApproved) return;
    setIsProcessing(true);
    try {
      if (type === 'approve') await onApprove?.(approval, remarks, { remarks });
      if (type === 'reject') await onReject?.(approval, remarks, { remarks });
      if (type === 'changes') await onRequestChanges?.(approval, remarks, { remarks });
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <FullPageDetailPanel
      onBack={onClose}
      backLabel="Back to Approvals Queue"
      breadcrumbs={['University Approvals & Vetting', approval.type || 'Budget Approval', approval.approvalId || approval._id]}
      idBadge={approval.approvalId || approval._id}
      statusBadge={
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border flex items-center space-x-1 ${
          isDeployed ? 'bg-teal-50 text-teal-800 border-teal-300' :
          isForwarded ? 'bg-blue-50 text-blue-800 border-blue-300' :
          isApproved ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'
        }`}>
          {isDeployed ? (<><Lock className="w-3 h-3 text-teal-700" /><span>✓ Deployed & Locked</span></>) :
           isForwarded ? (<><CheckCircle2 className="w-3 h-3 text-blue-700" /><span>✓ Forwarded to Govt</span></>) :
           (<span>{approval.status || 'Pending Vetting'}</span>)}
        </span>
      }
      title={approval.title}
      subtitle={`Submitted by ${approval.teamLead || 'Lead Mentor'} · Quoted Budget: ${approval.amount || approval.budget || '₹ 80,000'}`}
      stickyFooter={
        <div className="w-full flex items-center justify-between">
          <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">
            Back to Approvals
          </button>
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={() => onViewProblemDossier && onViewProblemDossier(approval)}
              className="px-3.5 py-2 text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl cursor-pointer flex items-center space-x-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-teal-700" />
              <span>Inspect Problem Dossier</span>
            </button>
            {isDeployed ? (
              <span className="px-5 py-2 text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center space-x-1.5">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>✓ Deployed Statewide · Changes Locked</span>
              </span>
            ) : (
              <>
                <button type="button" onClick={() => setActiveActionTab(activeActionTab === 'changes' ? null : 'changes')} className="px-3.5 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl cursor-pointer flex items-center space-x-1">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" /><span>Revisions</span>
                </button>
                <button type="button" onClick={() => setActiveActionTab(activeActionTab === 'reject' ? null : 'reject')} className="px-3.5 py-2 text-xs font-bold text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer flex items-center space-x-1">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" /><span>Reject</span>
                </button>
                {!isApproved ? (
                  <button type="button" onClick={() => handleAction('approve')} disabled={isProcessing} className="px-5 py-2 text-xs font-black text-white bg-[#007A61] hover:bg-[#00604c] rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer disabled:opacity-50">
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" /><span>{isProcessing ? 'Approving...' : 'Approve & Forward to Govt'}</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>✓ Forwarded to State</span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      }
    >
      {activeActionTab && (
        <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 animate-fadeIn">
          <span className="text-xs font-bold text-emerald-400 block uppercase">
            {activeActionTab === 'changes' ? 'Revision Instructions:' : 'Reason for Rejection:'}
          </span>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            placeholder="Type official directive remarks..."
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
          />
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setActiveActionTab(null)} className="px-3 py-1.5 text-xs text-slate-300 hover:text-white cursor-pointer">Cancel</button>
            <button type="button" onClick={() => handleAction(activeActionTab)} disabled={isProcessing || !remarks.trim()} className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl cursor-pointer disabled:opacity-40 flex items-center space-x-1">
              <Send className="w-3.5 h-3.5" /><span>Confirm</span>
            </button>
          </div>
        </div>
      )}

      {/* Meta Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Category</span>
          <span className="text-xs font-black text-slate-900 block truncate">{approval.type || 'Budget Grant'}</span>
          <span className="text-[10.5px] text-slate-500 font-mono">Stage 1 Vetting</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Quoted Budget</span>
          <span className="text-xs font-black text-emerald-700 block font-mono">{approval.amount || approval.budget || '₹ 80,000'}</span>
          <span className="text-[10.5px] text-slate-500">First Installment: 50%</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Lead Faculty Mentor</span>
          <span className="text-xs font-black text-slate-900 block truncate">{approval.teamLead || 'Faculty Guide'}</span>
          <span className="text-[10.5px] text-[#007A61]">Department Mentor</span>
        </div>
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Associated Reference</span>
          <span className="text-xs font-black text-slate-900 block font-mono">{approval.projectId || 'PRJ-RU-2026'}</span>
          <span className="text-[10.5px] text-slate-500">{approval.challengeId || 'CHL-JH-2026'}</span>
        </div>
      </div>

      <GovernmentGrantStatusCard approval={approval} />

      {isProto && <IndustryMentorApprovalCard approval={approval} />}
      {isProto && <PrototypeLabTestingSection approval={approval} />}

      {/* Citizen Problem Statement & Scope with Direct Dossier Link */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-slate-400">Citizen Problem Statement & Scope</span>
          <button
            type="button"
            onClick={() => onViewProblemDossier && onViewProblemDossier(approval)}
            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-[#007A61] border border-emerald-200 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Problem Evidence Dossier</span>
          </button>
        </div>
        <h3 className="text-sm font-bold text-slate-900 leading-relaxed">"{approval.title}"</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          {approval.description || approval.metadata?.problemStatement || 'R&D investigation allocated under Jharkhand State Innovation Framework for civic problem resolution.'}
        </p>
      </div>
    </FullPageDetailPanel>
  );
};

export default ApprovalDetailPanel;
