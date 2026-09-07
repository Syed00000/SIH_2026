import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ProjectMilestonesTab = ({ milestonesList, completedMilestones, totalMilestones, calculatedPercentage }) => (
  <div className="space-y-2.5">
    <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
      <span className="font-bold text-slate-700">R&D Lifecycle Milestones</span>
      <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
        {completedMilestones} of {totalMilestones} Steps Completed ({calculatedPercentage}%)
      </span>
    </div>

    {milestonesList.map((m, idx) => {
      const isDone = m.status === 'Completed';
      const isCurrent = m.status === 'In Progress' || m.status === 'CURRENT';
      return (
        <div
          key={idx}
          className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
            isDone
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-2xs'
              : isCurrent
              ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs ring-1 ring-amber-300/60'
              : 'bg-slate-50/80 border-slate-200 text-slate-600'
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-black shrink-0 ${
                isDone
                  ? 'bg-[#007A61] text-white shadow-xs'
                  : isCurrent
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-xs leading-tight truncate">{m.title}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                {m.completedAt
                  ? `Completed on ${new Date(m.completedAt).toLocaleDateString('en-GB')}`
                  : m.dueDate && m.dueDate !== 'N/A'
                  ? `Target: ${m.dueDate}`
                  : 'Status: ' + (isDone ? 'Completed' : isCurrent ? 'Active Milestone' : 'Pending')}
              </div>
            </div>
          </div>
          <span
            className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md border shrink-0 ${
              isDone
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : isCurrent
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
          </span>
        </div>
      );
    })}
  </div>
);

export default ProjectMilestonesTab;
