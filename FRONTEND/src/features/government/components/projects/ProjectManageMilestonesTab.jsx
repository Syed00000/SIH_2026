import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const ProjectManageMilestonesTab = ({ project, onUpdateMilestoneStatus }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Overall Milestone Progress</span>
          <div className="text-base font-black text-slate-900 mt-0.5">{project.milestonePhase}</div>
        </div>
        <div className="text-right">
          <span className="text-lg font-black text-slate-900">{project.milestoneProgress || 50}%</span>
          <span className="text-[10px] text-slate-500 block">Completed</span>
        </div>
      </div>

      <div className="space-y-3">
        {(project.milestones || []).map((m) => {
          const isDone = m.status === 'Completed';
          const isInProg = m.status === 'In Progress';

          return (
            <div
              key={m.id}
              className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                    isDone
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isInProg
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {m.id}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-slate-900">{m.title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isInProg
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 italic">"{m.remarks}"</p>
                  {m.date && <span className="text-[10px] text-slate-400 font-mono">Date: {m.date}</span>}
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                {!isDone && (
                  <button
                    type="button"
                    onClick={() => onUpdateMilestoneStatus && onUpdateMilestoneStatus(project.id, m.id, 'Completed')}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mark Complete</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectManageMilestonesTab;
