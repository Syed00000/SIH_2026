import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Users,
  User,
  Calendar,
  Banknote,
  Tag,
  Clock,
  Send,
  Building2,
  FileText,
  Layers,
  Sparkles,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

const statusBadge = (s = '') => {
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
  onRequestChanges
}) => {
  const [remarks, setRemarks] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setRemarks(approval?.adminRemarks || '');
  }, [approval?.approvalId]);

  if (!isOpen || !approval) return null;

  const canAct = approval.status === 'Pending' || approval.status === 'Changes Required';

  const handleAction = async (actionFn) => {
    setIsProcessing(true);
    try {
      await actionFn(approval, remarks);
      onClose();
    } catch (err) {
      console.error('Approval action error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono font-black text-sm tracking-wider text-emerald-400">
                  {approval.approvalId}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${statusBadge(
                    approval.status
                  )}`}
                >
                  {approval.status}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold border border-slate-700 bg-slate-800 text-slate-300 rounded-full">
                  University Authority Review
                </span>
              </div>
              <h2 className="text-sm font-extrabold text-white mt-0.5 line-clamp-1">
                {approval.project}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Modal Content ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#fafafa]">
          {/* Top Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Challenge & Project ID */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-1 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Challenge Identifier
              </span>
              <p className="font-mono font-bold text-xs text-slate-900">
                {approval.challengeId || 'CHL-JH-2026'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                {approval.project}
              </p>
            </div>

            {/* Faculty Investigator */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-1 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Lead Faculty Investigator
              </span>
              <p className="font-bold text-xs text-slate-900">
                {approval.faculty?.name || approval.requestedBy || 'Dr. Binod Kumar'}
              </p>
              <p className="text-[11px] text-[#007A61] font-semibold">
                {approval.faculty?.department || approval.requestedByDept || 'Engineering'}
              </p>
            </div>

            {/* Student Innovation Team */}
            <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-1 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Student Research Team
              </span>
              <p className="font-bold text-xs text-slate-900">
                {approval.team?.name || 'Smart Aqua Innovators'}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                {approval.team?.membersCount || 4} Student Researchers
              </p>
            </div>
          </div>

          {/* Re-Proposal Revised Notice Banner */}
          {(approval.isRevised || approval.type?.includes('Re-Proposal') || (approval.revisionCount && approval.revisionCount > 1)) && (
            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-xl space-y-1 shadow-2xs">
              <div className="flex items-center space-x-2 text-purple-950 font-bold text-xs">
                <RotateCcw className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Re-Proposal Submitted (Revision #{approval.revisionCount || 2})</span>
              </div>
              <p className="text-[11px] text-purple-800 pl-6 font-medium leading-relaxed">
                The Lead Faculty Mentor has revised and updated the research methodology and line-item budget in response to the University Authority's review directives.
              </p>
            </div>
          )}

          {/* Technical Methodology & Research Plan */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-[#007A61]" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Technical Methodology & Research Plan
              </h3>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50/80 p-3 rounded-lg border border-slate-200/60 whitespace-pre-wrap">
              {approval.methodology || 'No detailed methodology provided by mentor.'}
            </div>
          </div>

          {/* Faculty Milestone Roadmap & Stages */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
              <Layers className="w-4 h-4 text-[#007A61]" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Faculty Milestone Roadmap & Research Stages
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              {(Array.isArray(approval.milestoneRoadmap) && approval.milestoneRoadmap.length > 0
                ? approval.milestoneRoadmap
                : [
                    { stage: 1, title: 'Lab CAD & Circuit Rig', targetDays: 'Days 1-30', deliverable: 'Component procurement, PCB milling, sensor bench test' },
                    { stage: 2, title: 'Field Ground Testing', targetDays: 'Days 31-75', deliverable: 'Telemetry calibration in rural pilot site' },
                    { stage: 3, title: 'NABL Lab Certification', targetDays: 'Days 76-120', deliverable: 'Safety and quality standard test report' },
                    { stage: 4, title: 'Public Rollout & Scale', targetDays: 'Days 121-180', deliverable: 'Deployment and handover to district administration' }
                  ]
              ).map((stage, sIdx) => (
                <div key={sIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold text-[#007A61] uppercase">Stage {stage.stage || sIdx + 1}</span>
                    <span className="font-bold text-slate-500">{stage.targetDays || `Phase ${sIdx + 1}`}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-snug">{stage.title}</div>
                  {stage.deliverable && (
                    <div className="text-[10px] text-slate-500 line-clamp-2">{stage.deliverable}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Itemized Line-Item Budget Table */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#007A61]" />
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Itemized Line-Item Budget Allocation
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Total Grant Requested
                </span>
                <span className="text-base font-black font-mono text-[#007A61]">
                  {approval.proposedBudget || approval.estimatedBudget || '₹ 80,000'}
                </span>
              </div>
            </div>

            {Array.isArray(approval.budgetBreakdown) && approval.budgetBreakdown.length > 0 ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {approval.budgetBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-xs"
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-4">
                      <span className="w-6 h-6 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200 text-[11px] font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">
                        {item.category || item.title}
                      </span>
                    </div>
                    <span className="font-mono font-extrabold text-slate-900 text-xs shrink-0">
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 text-center rounded-xl text-xs text-slate-500 font-semibold">
                Single grant allocation of {approval.proposedBudget || approval.estimatedBudget || '₹ 80,000'}
              </div>
            )}
          </div>

          {/* University Authority Feedback & Remarks */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-2">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700">
              University Authority Remarks / Feedback for Faculty & Government *
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              maxLength={500}
              placeholder="e.g. Approved. Proposal aligns with state rural electrification standards. Forwarded for grant sanction."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white resize-none"
            />
            <div className="text-[10px] text-slate-400 text-right">
              {remarks.length}/500
            </div>
          </div>
        </div>

        {/* ── Action Footer ── */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Current Status: <strong>{approval.status}</strong>
          </div>

          {canAct ? (
            <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => handleAction(onReject)}
                disabled={isProcessing}
                className="px-4 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                <span>Reject</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onRequestChanges)}
                disabled={isProcessing}
                className="px-4 py-2 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Request Revision</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction(onApprove)}
                disabled={isProcessing}
                className="px-5 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Approve & Forward to Government</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
            >
              Close Dossier
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApprovalDetailModal;
