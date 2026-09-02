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
      {currentProject?.budgetStatus === 'Changes Required by University' && (
        <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl space-y-1">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>University Authority Requested Revisions</span>
          </div>
          {currentProject.adminRemarks && (
            <p className="text-xs text-amber-800 font-medium pl-6">
              Authority Note: "{currentProject.adminRemarks}"
            </p>
          )}
          <p className="text-[10.5px] text-amber-700 font-semibold pl-6">
            Please adjust the technical methodology or budget allocations below and resubmit.
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
