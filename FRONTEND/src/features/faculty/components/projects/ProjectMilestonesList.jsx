import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ProjectMilestonesList = ({ project }) => {
  const isAllDone = project.governmentStatus === 'Approved' || project.status === 'Completed';

  return (
    <div className="space-y-2.5 pt-2 text-left">
      <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
        Work Breakdown & Task Progress
      </h3>

      {(project.milestones || []).map((m, idx) => {
        const isDone = isAllDone || m.status === 'Completed';
        const isCurrent = !isAllDone && m.status === 'In Progress';

        return (
          <div
            key={idx}
            className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isDone
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : isCurrent
                ? 'bg-amber-50/80 border-amber-300 text-amber-950 ring-1 ring-amber-300/60'
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
              <div>
                <span className="font-extrabold text-xs block leading-tight">{m.title}</span>
                <span className="text-[10px] text-slate-500">Status: {isDone ? 'Completed' : m.status}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectMilestonesList;
