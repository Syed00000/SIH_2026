import React from 'react';
import { RotateCcw } from 'lucide-react';

export const ApprovalModalMetadata = ({ approval }) => {
  return (
    <>
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
            {approval.faculty?.name || approval.requestedBy || 'Unassigned Faculty'}
          </p>
          <p className="text-[11px] text-[#007A61] font-semibold">
            {approval.faculty?.department || approval.requestedByDept || 'Department Not Specified'}
          </p>
        </div>

        {/* Student Innovation Team */}
        <div className="p-3.5 bg-white border border-slate-200/90 rounded-xl space-y-1 shadow-2xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Student Research Team
          </span>
          <p className="font-bold text-xs text-slate-900">
            {approval.teamName || approval.team?.name || 'Unassigned Team'}
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            {approval.teamMembersCount || approval.team?.members?.length || approval.team?.membersCount || '—'} Student Researchers
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
    </>
  );
};

export default ApprovalModalMetadata;
