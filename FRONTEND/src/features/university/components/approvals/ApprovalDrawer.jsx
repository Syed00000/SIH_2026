import React, { useState, useEffect } from 'react';
import {
  X, CheckCircle2, RotateCcw, XCircle, Paperclip,
  Users, User, Calendar, Banknote, Tag, Clock, ChevronRight
} from 'lucide-react';

const statusPill = (s = '') => {
  if (s === 'Approved') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (s === 'Pending') return 'bg-amber-100 text-amber-800 border-amber-300';
  if (s === 'Rejected') return 'bg-rose-100 text-rose-800 border-rose-300';
  if (s === 'Changes Required') return 'bg-orange-100 text-orange-800 border-orange-300';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const typePill = (t = '') => {
  if (t.includes('Project')) return 'bg-blue-100 text-blue-800 border-blue-200';
  if (t.includes('Proposal')) return 'bg-purple-100 text-purple-800 border-purple-200';
  if (t.includes('Partnership')) return 'bg-amber-100 text-amber-800 border-amber-200';
  if (t.includes('Payment')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  return 'bg-slate-100 text-slate-700 border-slate-200';
};

const historyDot = (action = '') => {
  if (action.includes('Approved')) return 'bg-emerald-500';
  if (action.includes('Rejected')) return 'bg-rose-500';
  if (action.includes('Changes')) return 'bg-orange-400';
  if (action.includes('Submitted')) return 'bg-blue-500';
  return 'bg-slate-400';
};

const Row = ({ icon: Icon, label, children }) => (
  <div className="flex items-start py-2 border-b border-slate-100 last:border-0">
    <div className="flex items-center space-x-2 w-36 shrink-0 text-slate-500">
      <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
      <span className="text-[11px] font-semibold">{label}</span>
    </div>
    <div className="flex-1 text-right">{children}</div>
  </div>
);

export const ApprovalDrawer = ({ approval, onClose, onApprove, onReject, onRequestChanges }) => {
  const [remarks, setRemarks] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setRemarks(approval?.adminRemarks || '');
  }, [approval?.approvalId]);

  if (!approval) return null;

  const canAct = approval.status === 'Pending' || approval.status === 'Changes Required';

  const history = Array.isArray(approval.history) && approval.history.length > 0
    ? approval.history
    : [
        { action: 'Request Submitted', performedBy: approval.requestedBy, timestamp: `${approval.date}, ${approval.dateTime || '10:30 AM'}`, note: `${approval.type} submitted for review.` },
        { action: 'Under Review', performedBy: 'Dr. Ankit Verma', timestamp: `${approval.date}, 11:05 AM`, note: 'Assigned to nodal authority for evaluation.' }
      ];

  const supportTypes = Array.isArray(approval.supportTypes) && approval.supportTypes.length > 0
    ? approval.supportTypes
    : ['Funding', 'Equipment'];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleApprove = () => {
    onApprove(approval, remarks);
    showToast('Approval submitted successfully.');
  };
  const handleReject = () => {
    onReject(approval, remarks);
    showToast('Request rejected.', 'error');
  };
  const handleChanges = () => {
    onRequestChanges(approval, remarks);
    showToast('Changes requested from faculty.', 'warn');
  };

  return (
    <div className="bg-white border border-slate-200 shadow-lg rounded-none flex flex-col" style={{ maxHeight: 'calc(100vh - 180px)' }}>

      {/* ── Header ── */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 shrink-0">
        <div className="flex items-start justify-between mb-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="font-mono font-black text-slate-900 text-sm">{approval.approvalId}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-none ${statusPill(approval.status)}`}>
                {approval.status}
              </span>
            </div>
            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold border rounded-none ${typePill(approval.type)}`}>
              {approval.type}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-none text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-500">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-[10.5px] font-medium">Requested on {approval.date}{approval.dateTime ? `, ${approval.dateTime}` : ''}</span>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto">

        {/* Project Details */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Project Details</p>
          <Row icon={Tag} label="Project">
            <span className="text-xs font-bold text-slate-900 leading-snug">{approval.project}</span>
          </Row>
          {approval.challengeId && (
            <Row icon={Tag} label="Challenge ID">
              <span className="text-xs font-mono font-bold text-slate-900">{approval.challengeId}</span>
            </Row>
          )}
          <Row icon={User} label="Faculty">
            <div>
              <div className="text-xs font-bold text-slate-900">{approval.faculty?.name || approval.requestedBy}</div>
              <div className="text-[10.5px] text-slate-500 font-medium">{approval.faculty?.department || approval.requestedByDept}</div>
            </div>
          </Row>
          <Row icon={Users} label="Team">
            <div>
              <div className="text-xs font-bold text-slate-900">{approval.team?.name || 'Smart Aqua Innovators'}</div>
              <div className="text-[10.5px] text-slate-500 font-medium">({approval.team?.membersCount || 5} Members)</div>
            </div>
          </Row>
          <Row icon={User} label="Requested By">
            <span className="text-xs font-bold text-slate-900">{approval.requestedBy}</span>
          </Row>
          <Row icon={Calendar} label="Start Date">
            <span className="text-xs font-bold text-slate-900">{approval.startDate || '20 May 2026'}</span>
          </Row>
          <Row icon={Banknote} label="Est. Budget">
            <span className="text-xs font-mono font-bold text-slate-900">{approval.estimatedBudget || '₹ 75,000'}</span>
          </Row>
          <Row icon={Tag} label="Req. Support">
            <div className="flex flex-wrap gap-1 justify-end">
              {supportTypes.map((s) => (
                <span key={s} className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-800 rounded-none">{s}</span>
              ))}
            </div>
          </Row>
          <Row icon={Paperclip} label="Documents">
            <div className="flex items-center space-x-1.5 justify-end">
              <span className="text-xs font-bold text-slate-900">{approval.documentsCount || 4} Files</span>
              <button className="text-[10px] font-bold text-blue-700 underline cursor-pointer">View All</button>
            </div>
          </Row>
        </div>

        {/* Divider */}
        <div className="mx-4 border-t border-dashed border-slate-200 my-3" />

        {/* Remarks */}
        <div className="px-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Approval Remarks</p>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Add your remarks here..."
            className="w-full px-3 py-2.5 bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:border-slate-900 rounded-none font-medium"
          />
          <div className="text-[10px] text-slate-400 text-right mt-0.5">{remarks.length}/500</div>
        </div>

        {/* Action Buttons */}
        {canAct && (
          <div className="px-4 mt-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Action</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleApprove}
                className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors rounded-none"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
              <button
                onClick={handleChanges}
                className="py-2 bg-white hover:bg-amber-50 border border-amber-400 text-amber-800 text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-colors rounded-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px]">Request Changes</span>
              </button>
              <button
                onClick={handleReject}
                className="py-2 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 text-[11px] font-bold flex items-center justify-center space-x-1.5 cursor-pointer transition-colors rounded-none"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="mx-4 border-t border-dashed border-slate-200 my-3" />

        {/* History */}
        <div className="px-4 pb-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2.5">Approval History</p>
          <div className="space-y-3 relative">
            <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-100" />
            {history.map((h, i) => (
              <div key={i} className="flex items-start space-x-3 relative">
                <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 z-10 ring-2 ring-white ${historyDot(h.action)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">{h.action}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-500 font-medium">By {h.performedBy}</div>
                  <div className="text-[10px] text-slate-400">{h.timestamp}</div>
                  {h.note && <div className="text-[10.5px] text-slate-500 mt-0.5 leading-relaxed">{h.note}</div>}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-3 text-[11px] font-bold text-slate-700 hover:text-slate-900 underline cursor-pointer flex items-center space-x-0.5">
            <span>View Full History</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`px-4 py-2.5 text-xs font-bold border-t shrink-0
          ${toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
            toast.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' :
            'bg-amber-50 text-amber-800 border-amber-200'}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default ApprovalDrawer;
