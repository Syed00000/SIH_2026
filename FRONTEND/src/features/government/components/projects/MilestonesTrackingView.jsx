import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

export const MilestonesTrackingView = ({ projects = [], onManageProject }) => {
  const [selectedPhase, setSelectedPhase] = useState('All Phases');

  const allMilestones = projects.flatMap((p) =>
    (p.milestones || []).map((m) => ({
      ...m,
      projectId: p.id,
      projectTitle: p.title,
      hei: p.hei,
      sector: p.sector,
      district: p.district,
      trlLevel: p.trlLevel,
      parentProject: p
    }))
  );

  const filteredMilestones = allMilestones.filter((m) => {
    if (selectedPhase === 'All Phases') return true;
    if (selectedPhase === 'Completed') return m.status === 'Completed';
    if (selectedPhase === 'In Progress') return m.status === 'In Progress';
    if (selectedPhase === 'Pending') return m.status === 'Pending';
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">
            Milestones & Stage Gate Compliance
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Deliverables audit trail and technical milestone sign-offs for sanctioned innovations
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['All Phases', 'In Progress', 'Completed', 'Pending'].map((phase) => (
            <button
              key={phase}
              type="button"
              onClick={() => setSelectedPhase(phase)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                selectedPhase === phase
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {phase}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filteredMilestones.map((m, idx) => {
          const isCompleted = m.status === 'Completed';
          const isInProgress = m.status === 'In Progress';

          return (
            <div
              key={`${m.projectId}-${m.id}-${idx}`}
              className="bg-white border border-slate-200 rounded-2xl p-4 transition-all duration-150 hover:shadow-xs hover:border-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : isInProgress
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : isInProgress ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500">{m.id}:</span>
                    <h3 className="text-xs font-bold text-slate-900">{m.title}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : isInProgress
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {m.status} ({m.progress}%)
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-slate-500 mt-1">
                    <span className="font-semibold text-slate-800">
                      {m.projectTitle} ({m.projectId})
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{m.hei}</span>
                    </span>
                    <span>•</span>
                    <span>{m.district}</span>
                    <span>•</span>
                    <span className="text-slate-600 italic">"{m.remarks}"</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => onManageProject && onManageProject(m.parentProject)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>Audit Stage</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MilestonesTrackingView;
