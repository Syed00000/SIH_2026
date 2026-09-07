import React from 'react';
import { X, Clock } from 'lucide-react';

const statusPill = (s = '') => {
  if (s === 'Deployed') return 'bg-teal-50 text-teal-800 border-teal-300';
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

export const ApprovalDrawerHeader = ({ approval, onClose }) => {
  return (
    <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 shrink-0">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="font-mono font-black text-slate-900 text-sm">
              {approval.approvalId}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${statusPill(approval.status)}`}>
              {approval.status}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-full ${typePill(approval.type)}`}>
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
  );
};

export default ApprovalDrawerHeader;
