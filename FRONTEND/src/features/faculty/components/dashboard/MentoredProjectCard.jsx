import React from 'react';
import { ChevronRight } from 'lucide-react';
import { computeDynamicMilestones } from '../../../../shared/utils/milestonesHelper.js';

export const MentoredProjectCard = ({ project: p, index: i, onNavigateTab }) => {
  const dynamicM = computeDynamicMilestones(p);
  const doneM = dynamicM.filter((m) => m.status === 'Completed').length;
  const progressPct = Math.round((doneM / 7) * 100);

  return (
    <div
      key={p.projectId || i}
      onClick={() => onNavigateTab('project-workspace', p.projectId || p.challengeId)}
      className="group flex items-center justify-between p-3.5 bg-white hover:bg-emerald-50/50 border-b border-slate-200/80 last:border-0 transition-all cursor-pointer"
    >
      <div className="flex items-center space-x-4 min-w-0 flex-1">
        {/* Index/Number Indicator */}
        <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#007A61] group-hover:text-white text-slate-500 flex items-center justify-center font-extrabold text-xs transition-colors shrink-0">
          {i + 1}
        </div>

        {/* Project Core Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2 mb-0.5">
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
              {p.projectId || 'PRJ-1001'}
            </span>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {p.domain || 'Innovation'}
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {p.status || 'Proposal Stage'}
            </span>
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 truncate group-hover:text-[#007A61] transition-colors">
            {p.title}
          </h3>
        </div>
      </div>

      {/* Progress & Metrics */}
      <div className="flex items-center space-x-6 shrink-0 ml-4 hidden md:flex">
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Lifecycle Progress
          </span>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#007A61] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[11px] font-extrabold font-mono text-[#007A61] min-w-[32px] text-right">
              {progressPct}%
            </span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#007A61] transition-colors" />
      </div>
    </div>
  );
};

export default MentoredProjectCard;
