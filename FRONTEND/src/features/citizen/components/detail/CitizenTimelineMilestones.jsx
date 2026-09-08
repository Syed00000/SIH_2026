import React from 'react';
import { CheckCircle2, Loader2, Wrench, GraduationCap } from 'lucide-react';
import { getChallengeMilestones } from '../helpers/challengeMilestones.helper.js';

export const CitizenTimelineMilestones = ({ milestones, challenge = null }) => {
  const activeMilestones = (milestones && milestones.length > 0)
    ? milestones
    : getChallengeMilestones(challenge || {});

  const isBlockTrack = Boolean(
    challenge?.assignedDepartment?.name ||
    challenge?.assignedDepartment?.block ||
    challenge?.assignedBlock
  );

  return (
    <div className="space-y-3 pt-1 select-none text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Resolution Progress Timeline
          </span>
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
            isBlockTrack ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            {isBlockTrack ? <Wrench className="w-3 h-3 text-blue-600" /> : <GraduationCap className="w-3 h-3 text-emerald-600" />}
            <span>{isBlockTrack ? 'Block & Civic Remediation' : 'University R&D Track'}</span>
          </span>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">{activeMilestones.length} Stages</span>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-4 space-y-4 shadow-2xs">
        {activeMilestones.map((ms, idx) => {
          const isCompleted = ms.status === 'COMPLETED';
          const isCurrent = ms.status === 'CURRENT';

          return (
            <div key={idx} className="flex items-start space-x-3 relative">
              {idx < activeMilestones.length - 1 && (
                <div
                  className={`absolute left-[13px] top-[26px] bottom-[-16px] w-[2px] ${
                    isCompleted ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 font-bold text-xs ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isCurrent
                    ? 'bg-[#007A61] text-white shadow-sm ring-4 ring-emerald-100'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>{ms.step || idx + 1}</span>
                )}
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xs font-bold ${isCompleted || isCurrent ? 'text-slate-900' : 'text-slate-500'}`}>
                    {ms.title}
                  </h4>
                  {isCompleted && (
                    <span className="text-[10px] text-emerald-700 font-bold">Done</span>
                  )}
                  {isCurrent && (
                    <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-800 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      <span>In Progress</span>
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5 font-medium">{ms.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CitizenTimelineMilestones;

