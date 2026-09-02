import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const ProblemBriefAndFeedback = ({
  projects = [],
  currentProject,
  selectedProjectId,
  onProjectSelect,
  hideHeader = false
}) => {
  return (
    <div className="space-y-4">
      {/* Project Selection Dropdown */}
      {!hideHeader && (
        <div>
          <label className="block text-[10.5px] font-extrabold uppercase tracking-wider text-slate-600 mb-1">
            Select Assigned Problem Project *
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => onProjectSelect(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white shadow-2xs cursor-pointer"
          >
            {projects.map((p, i) => (
              <option key={p.projectId || i} value={p.projectId || p.challengeId}>
                {p.projectId} — {p.title} ({p.domain})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Problem Brief Card */}
      {currentProject && (
        <div className="p-3.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-900 uppercase">Assigned Problem Statement</span>
            <span className="text-[10px] font-mono font-bold bg-white border border-emerald-200 px-1.5 py-0.2 rounded text-emerald-900">
              {currentProject.projectId}
            </span>
          </div>
          <p className="text-xs text-slate-800 font-semibold line-clamp-2 leading-relaxed">
            {currentProject.problemStatement || currentProject.description || currentProject.title}
          </p>
        </div>
      )}

      {/* Government Authority Clarification / Revision Banner */}
      {currentProject?.budgetStatus === 'Changes Required by Government' && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Government Authority Requested Proposal Clarifications / Revisions</span>
          </div>
          {currentProject.governmentRemarks && (
            <p className="text-xs text-amber-800 font-medium pl-6">
              Audit Note: "{currentProject.governmentRemarks}"
            </p>
          )}
          <p className="text-[10.5px] text-amber-700 font-semibold pl-6">
            Please update the line-item budget, methodology, or milestone stages below and resubmit for Government Grant Sanction.
          </p>
        </div>
      )}

      {/* University Authority Review Feedback Banner */}
      {(Boolean(currentProject?.adminRemarks || currentProject?.universityRemarks) ||
        String(currentProject?.budgetStatus || '').toLowerCase().includes('changes required')) && (
        <div className="p-4 bg-amber-50/95 border-2 border-amber-300 rounded-2xl space-y-2 shadow-2xs animate-in fade-in duration-200 text-left">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
            <div className="flex items-center space-x-2 text-amber-950 font-black text-xs uppercase tracking-wide">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>University Authority Review Remarks / Feedback</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-2xs">
              Official Directive
            </span>
          </div>
          <div className="p-3 bg-white/90 border border-amber-200/80 rounded-xl text-xs font-bold text-amber-950 leading-relaxed italic">
            "{currentProject.adminRemarks || currentProject.universityRemarks || 'University Authority has requested technical or financial revisions.'}"
          </div>
          <p className="text-[11px] text-amber-900 font-medium">
            Please review the directives above from the University Nodal Officer and update your technical methodology, milestone stages, or itemized budget allocations accordingly.
          </p>
        </div>
      )}

      {/* Government Grant Sanctioned Banner */}
      {(currentProject?.budgetStatus === 'Grant Sanctioned by Government' || currentProject?.budgetStatus === 'Forwarded to Escrow') && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#007A61] shrink-0" />
            <span>Grant Sanctioned & Disbursed by Government Authority ✓</span>
          </div>
          <div className="pl-6 text-xs text-emerald-800 space-y-0.5">
            <div><strong>Sanction Order:</strong> <span className="font-mono font-bold">{currentProject.sanctionOrderNo || 'JH-GOV-RD-2026-8842'}</span></div>
            <div><strong>Sanctioned Grant:</strong> <span className="font-mono font-bold">{currentProject.sanctionedBudget || currentProject.proposedBudget || '₹ 75,000'}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemBriefAndFeedback;
