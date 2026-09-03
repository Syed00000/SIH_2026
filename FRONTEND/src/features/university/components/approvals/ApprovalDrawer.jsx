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
  Sparkles
} from 'lucide-react';

const statusPill = (s = '') => {
  if (s === 'Approved') return 'bg-emerald-50 text-emerald-800 border-emerald-300';
  if (s === 'Pending') return 'bg-amber-50 text-amber-800 border-amber-300';
  if (s === 'Rejected') return 'bg-rose-50 text-rose-800 border-rose-300';
  if (s === 'Changes Required') return 'bg-orange-50 text-orange-800 border-orange-300';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const typePill = (t = '') => {
  if (t.includes('Project')) return 'bg-blue-50 text-blue-800 border-blue-200';
  if (t.includes('Proposal')) return 'bg-emerald-50 text-[#007A61] border-emerald-200';
  if (t.includes('Partnership')) return 'bg-amber-50 text-amber-800 border-amber-200';
  if (t.includes('Payment')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const historyDot = (action = '') => {
  if (action.includes('Approved')) return 'bg-emerald-500';
  if (action.includes('Rejected')) return 'bg-rose-500';
  if (action.includes('Changes')) return 'bg-orange-400';
  if (action.includes('Submitted')) return 'bg-[#007A61]';
  return 'bg-slate-400';
};

export const ApprovalDrawer = ({
  approval,
  onClose,
  onApprove,
  onReject,
  onRequestChanges
}) => {
  const [remarks, setRemarks] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setRemarks('');
  }, [approval?.approvalId]);

  if (!approval) return null;

  const canAct = approval.status === 'Pending' || approval.status === 'Changes Required';

  const history = Array.isArray(approval.history) && approval.history.length > 0
    ? approval.history
    : [
        {
          action: 'Proposal Submitted by Faculty',
          performedBy: approval.requestedBy || 'Faculty Mentor',
          timestamp: `${approval.date}, ${approval.dateTime || '10:30 AM'}`,
          note: `Itemized R&D Budget of ${approval.proposedBudget || approval.estimatedBudget || '₹ 80,000'} submitted for review.`
        }
      ];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = () => {
    onApprove(approval, remarks);
    setRemarks('');
    showToast('Proposal Approved & Forwarded to Government for Grant Sanction.');
  };

  const handleReject = () => {
    onReject(approval, remarks);
    setRemarks('');
    showToast('Proposal rejected.', 'error');
  };

  const handleChanges = () => {
    onRequestChanges(approval, remarks);
    setRemarks('');
    showToast('Revision requested from Faculty Mentor.', 'warn');
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all max-h-[85vh]">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`p-2.5 text-xs font-bold text-center text-white transition-all ${
            toast.type === 'error'
              ? 'bg-rose-600'
              : toast.type === 'warn'
              ? 'bg-amber-600'
              : 'bg-[#007A61]'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* ── Sticky Header ── */}
      <div className="px-5 py-3.5 bg-gradient-to-r from-slate-50 to-emerald-50/40 border-b border-slate-200 shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="font-mono font-black text-slate-900 text-sm">
                {approval.approvalId}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${statusPill(
                  approval.status
                )}`}
              >
                {approval.status}
              </span>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${typePill(
                  approval.type
                )}`}
              >
                {approval.type}
              </span>
            </div>
            <h2 className="text-xs font-extrabold text-slate-900 line-clamp-1 leading-snug">
              {approval.project}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200/60 cursor-pointer transition-colors shrink-0"
            title="Close dossier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1.5 text-slate-500 mt-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-[10.5px] font-medium">
            Submitted on {approval.date}
            {approval.dateTime ? `, ${approval.dateTime}` : ''}
          </span>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Project & Research Team Overview Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#007A61] flex items-center justify-center font-bold text-xs">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-extrabold text-slate-900">
                R&D Project & Investigator Dossier
              </span>
            </div>
            {approval.challengeId && (
              <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                {approval.challengeId}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Lead Faculty Mentor
              </span>
              <p className="font-bold text-slate-900">
                {approval.faculty?.name || approval.requestedBy}
              </p>
              <p className="text-[10.5px] text-slate-500 font-medium">
                {approval.faculty?.department || approval.requestedByDept || 'Engineering'}
              </p>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Student Research Team
              </span>
              <p className="font-bold text-slate-900">
                {approval.team?.name || 'Student Research Team'}
              </p>
              <p className="text-[10.5px] text-slate-500 font-medium">
                {approval.team?.membersCount || 4} Student Researchers
              </p>
            </div>
          </div>
        </div>

        {/* Technical Methodology & Research Plan */}
        {approval.methodology && (
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-[#007A61]" />
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#007A61]">
                Technical Methodology & Research Plan
              </p>
            </div>
            <div className="text-xs text-slate-800 leading-relaxed font-sans bg-slate-50/70 p-3.5 border border-slate-200 rounded-xl whitespace-pre-wrap">
              {approval.methodology}
            </div>
          </div>
        )}

        {/* Itemized Line-Item Budget Allocation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#007A61]" />
              <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-700">
                Itemized Line-Item Budget
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">
                Total Grant Requested
              </span>
              <span className="text-sm font-mono font-black text-[#007A61]">
                {approval.proposedBudget || approval.estimatedBudget || '₹ 80,000'}
              </span>
            </div>
          </div>

          {Array.isArray(approval.budgetBreakdown) && approval.budgetBreakdown.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white divide-y divide-slate-100 text-xs">
              {approval.budgetBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200 text-[10px] font-black flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 truncate">
                      {item.category || item.title}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 shrink-0">
                    {item.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 font-semibold">
              Total Proposed Grant: {approval.proposedBudget || approval.estimatedBudget || '₹ 80,000'}
            </div>
          )}
        </div>

        {/* Support Request */}
        <div className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold">
            <Sparkles className="w-4 h-4 text-[#007A61]" />
            <span>Requested Government Support:</span>
          </div>
          <span className="font-semibold text-[#007A61]">
            Direct Research Grant Disbursal
          </span>
        </div>

        {/* Approval Remarks Input */}
        <div className="space-y-1.5">
          <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600">
            Nodal Authority Remarks & Feedback
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Add university comments or directives for the government grant committee..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white resize-none"
          />
          <div className="text-[10px] text-slate-400 text-right">
            {remarks.length}/500
          </div>
        </div>

        {/* Approval History */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Audit Trail
          </p>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="flex items-start space-x-2.5 text-xs">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${historyDot(
                    h.action
                  )}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{h.action}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {h.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {h.performedBy} — {h.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Action Footer ── */}
      {canAct && (
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={handleApprove}
              className="py-2.5 px-3 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer sm:col-span-1"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Approve & Forward</span>
            </button>

            <button
              onClick={handleChanges}
              className="py-2.5 px-3 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer sm:col-span-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Request Revision</span>
            </button>

            <button
              onClick={handleReject}
              className="py-2.5 px-3 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-all shadow-2xs cursor-pointer sm:col-span-1"
            >
              <XCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Reject</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalDrawer;
