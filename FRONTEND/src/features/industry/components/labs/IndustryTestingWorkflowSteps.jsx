import React from 'react';
import { CheckCircle2, PlayCircle, Clock, FileCheck, Layers } from 'lucide-react';

export const IndustryTestingWorkflowSteps = ({
  stages = [],
  onUpdateStage,
  savingStage = false
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-slate-700" />
            <span>Complete Testing Workflow &amp; Steps</span>
          </h4>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
            Stage-wise validation protocols and spectrometer verification
          </p>
        </div>
        {savingStage && (
          <span className="text-xs text-emerald-600 font-bold animate-pulse">
            Syncing...
          </span>
        )}
      </div>

      <div className="space-y-3.5">
        {stages.map((stage, idx) => {
          const isCompleted = stage.status === 'Completed';
          const isInProgress = stage.status === 'In Progress';

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-50/20 border-emerald-200'
                  : isInProgress
                  ? 'bg-slate-50/50 border-slate-300 ring-1 ring-slate-300/60'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              {/* Header: Stage Number, Title, Duration */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isInProgress
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    Stage {stage.stageNumber || idx + 1}
                  </span>
                  <h5 className="text-xs font-bold text-slate-900">{stage.title}</h5>
                </div>

                <div className="flex items-center space-x-1 text-[10.5px] font-semibold text-slate-500 shrink-0">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{stage.expectedDays || '7 Days'}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed font-medium mt-2">
                {stage.description}
              </p>

              {/* Results & Verification Status */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-100 text-[11px]">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Status</span>
                  <span className={`font-black mt-0.5 block ${
                    isCompleted ? 'text-emerald-700' : isInProgress ? 'text-blue-700' : 'text-slate-600'
                  }`}>
                    {isCompleted ? '✓ Completed' : isInProgress ? '⏳ In Progress' : '○ Pending'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase block">Verification</span>
                  <span className="font-bold text-slate-700 mt-0.5 block">
                    {isCompleted ? 'Lab Certified' : isInProgress ? 'Under Evaluation' : 'Awaiting Schedule'}
                  </span>
                </div>
              </div>

              {/* Findings / Metrics Input & Action Button */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Findings &amp; Metrics
                  </label>
                  <input
                    type="text"
                    placeholder="Enter lab findings, sensor readings, or remarks..."
                    defaultValue={stage.notes || ''}
                    onBlur={(e) => onUpdateStage(idx, stage.status, e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div className="flex items-center justify-end pt-1">
                  {isCompleted ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-black flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Passed &amp; Verified</span>
                    </span>
                  ) : isInProgress ? (
                    <button
                      type="button"
                      onClick={() => onUpdateStage(idx, 'Completed')}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Mark Stage Completed</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onUpdateStage(idx, 'In Progress')}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Start Stage Testing</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IndustryTestingWorkflowSteps;
