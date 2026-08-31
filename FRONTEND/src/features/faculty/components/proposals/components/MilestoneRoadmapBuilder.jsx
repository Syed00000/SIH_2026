import React from 'react';
import { Target } from 'lucide-react';
import { ROADMAP_PRESETS } from '../presets/proposalPresets.js';

export const MilestoneRoadmapBuilder = ({
  milestoneStages = [],
  onUpdateStage,
  onApplyPreset
}) => {
  return (
    <div className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-3.5">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/80">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900">
              Milestone Roadmap & Research Stages (4 Stages)
            </h3>
            <span className="text-[10px] text-slate-500">
              Faculty-defined timeline and key deliverables for Government DPR review
            </span>
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-bold uppercase text-slate-400">Roadmap Templates:</span>
        {ROADMAP_PRESETS.map((preset, pIdx) => (
          <button
            key={pIdx}
            type="button"
            onClick={() => onApplyPreset(preset.stages)}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-200 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* 4 Editable Stages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {milestoneStages.map((stage, sIdx) => (
          <div key={sIdx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-extrabold text-[#007A61] uppercase">
                Stage {sIdx + 1}
              </span>
              <input
                type="text"
                value={stage.targetDays || ''}
                onChange={(e) => onUpdateStage(sIdx, 'targetDays', e.target.value)}
                placeholder="e.g. Days 1-30"
                className="w-24 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded text-[10px] font-bold text-slate-700 text-right focus:outline-none focus:bg-white"
              />
            </div>
            <input
              type="text"
              required
              value={stage.title || ''}
              onChange={(e) => onUpdateStage(sIdx, 'title', e.target.value)}
              placeholder="Stage Title"
              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-900 focus:outline-none focus:bg-white"
            />
            <input
              type="text"
              value={stage.deliverable || ''}
              onChange={(e) => onUpdateStage(sIdx, 'deliverable', e.target.value)}
              placeholder="Key Output / Deliverable"
              className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 focus:outline-none focus:bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneRoadmapBuilder;
