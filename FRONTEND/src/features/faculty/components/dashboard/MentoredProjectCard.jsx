import React from 'react';
import { ProjectFundingBreakdown } from './ProjectFundingBreakdown.jsx';

export const MentoredProjectCard = ({ project: p, index: i, onNavigateTab }) => {
  const milestonesDone = p.milestonesCompleted || 1;
  const totalM = p.milestonesTotal || 7;
  const progressPct = p.progressPercentage || Math.round((milestonesDone / totalM) * 100);

  return (
    <div
      key={p.projectId || i}
      onClick={() => onNavigateTab('project-workspace', p.projectId || p.challengeId)}
      className="p-3.5 bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-200/80 hover:border-emerald-200 rounded-xl transition-all cursor-pointer shadow-2xs space-y-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
              {p.projectId || 'PRJ-1001'}
            </span>
            <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {p.domain || 'Innovation'}
            </span>
            {p.disbursedAmount && p.disbursedAmount !== '₹ 0' && p.disbursedAmount !== '0' && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center space-x-1">
                <span>{p.disbursedAmount} Sanctioned</span>
              </span>
            )}
          </div>
          <h3 className="text-xs font-extrabold text-slate-900 mt-1 line-clamp-1">
            {p.title}
          </h3>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
          {p.status || 'Proposal Stage'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-1 pt-1">
        <div className="flex justify-between items-center text-[10.5px]">
          <span className="font-semibold text-slate-600">R&D Lifecycle</span>
          <span className="font-extrabold font-mono text-[#007A61]">
            {progressPct}% ({milestonesDone}/{totalM} Milestones)
          </span>
        </div>
        <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-[#007A61] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Financial Breakdown */}
      <ProjectFundingBreakdown project={p} />
    </div>
  );
};

export default MentoredProjectCard;
