import React from 'react';
import { CheckCircle2, PlayCircle } from 'lucide-react';

export const IndustryTestingStageCard = ({ stage, idx, onUpdateStage }) => {
  const isCompleted = stage.status === 'Completed';
  const isInProgress = stage.status === 'In Progress';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : isInProgress
                ? 'bg-blue-100 text-blue-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Stage {stage.stageNumber || idx + 1}
          </span>
          <h5 className="text-xs font-bold text-slate-900">{stage.title}</h5>
        </div>
        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
          {stage.expectedDays || '7 Days'}
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed font-medium">
        {stage.description}
      </p>

      {/* Observations / Notes Input */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          placeholder="Add lab findings / spectrometer metrics..."
          defaultValue={stage.notes || ''}
          onBlur={(e) => onUpdateStage(idx, stage.status, e.target.value)}
          className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007A61]"
        />

        {/* Action Buttons */}
        {isCompleted ? (
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-[11px] font-black flex items-center space-x-1 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Passed & Verified</span>
          </span>
        ) : isInProgress ? (
          <button
            type="button"
            onClick={() => onUpdateStage(idx, 'Completed')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer shrink-0"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete Stage</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onUpdateStage(idx, 'In Progress')}
            className="px-3 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white rounded-lg text-[11px] font-bold flex items-center space-x-1 shadow-2xs cursor-pointer shrink-0"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Start Stage Testing</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default IndustryTestingStageCard;
