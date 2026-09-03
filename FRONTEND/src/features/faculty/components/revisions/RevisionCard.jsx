import React from 'react';
import { AlertTriangle, Clock, Building2, FileEdit, Send } from 'lucide-react';

export const RevisionCard = ({ item, onOpenResubmit, onNavigateWorkspace }) => {
  const isChangesRequired =
    item.status === 'Changes Required' || item.status === 'Changes Requested';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 transition-all hover:border-slate-300 space-y-3.5">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {item.approvalId || item.projectId}
          </span>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#007A61] border border-emerald-200">
            {item.domain}
          </span>
          <span className="text-[11px] font-bold text-slate-400">
            • {item.type}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {isChangesRequired ? (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center space-x-1.5 shadow-2xs">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Changes Required by University Authority</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Resubmitted • Under Review</span>
            </span>
          )}
        </div>
      </div>

      {/* Project Title and details */}
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          {item.projectTitle}
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
          <span className="flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Origin: <strong>University Authority Review Cell</strong></span>
          </span>
          <span>•</span>
          <span>Grant Budget: <strong className="text-slate-900">{item.budget}</strong></span>
          {item.additionalAmount > 0 && (
            <span className="text-[#007A61] font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              +₹ {Number(item.additionalAmount).toLocaleString('en-IN')} Extra Grant
            </span>
          )}
          <span>•</span>
          <span>Lead PI: <strong>{item.requestedBy}</strong></span>
        </div>
      </div>

      {/* University Authority Remarks Box */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-3.5 space-y-1.5">
        <div className="flex items-center space-x-1.5 text-amber-900 font-bold text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>University Authority Directives & Remarks:</span>
        </div>
        <p className="text-xs text-amber-950 font-medium leading-relaxed pl-5 italic">
          "{item.adminRemarks}"
        </p>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-[11px] text-slate-400 flex items-center space-x-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Review decision logged in official university governance dossier.</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onNavigateWorkspace(item.projectId)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <FileEdit className="w-3.5 h-3.5 text-slate-600" />
            <span>Open Project Workspace & Revise</span>
          </button>

          {isChangesRequired && (
            <button
              type="button"
              onClick={() => onOpenResubmit(item)}
              className="px-4 py-1.5 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Send className="w-3.5 h-3.5 text-emerald-300" />
              <span>Resubmit to University Authority</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevisionCard;
