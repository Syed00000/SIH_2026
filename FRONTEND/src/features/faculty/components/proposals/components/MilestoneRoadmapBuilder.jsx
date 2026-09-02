import React from 'react';
import { Target, Plus, Trash2, Clock, Sparkles } from 'lucide-react';
import { ROADMAP_PRESETS } from '../presets/proposalPresets.js';

export const MilestoneRoadmapBuilder = ({
  milestoneStages = [],
  onUpdateStage,
  onAddStage,
  onRemoveStage,
  onApplyPreset
}) => {
  return (
    <div className="p-4 sm:p-5 bg-slate-50/90 border border-slate-200 rounded-2xl space-y-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#007A61] flex items-center justify-center border border-emerald-200 shadow-2xs shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-extrabold text-slate-900">
                Milestone Roadmap & Research Stages ({milestoneStages.length} Stages)
              </h3>
              <span className="text-[10px] font-bold text-[#007A61] bg-emerald-50 border border-emerald-200/80 px-2 py-0.2 rounded-full">
                Customizable
              </span>
            </div>
            <span className="text-[10.5px] text-slate-500 block">
              Faculty-defined timeline and key deliverables for Government DPR review
            </span>
          </div>
        </div>

        {/* Top Add Stage Quick Button */}
        <button
          type="button"
          onClick={onAddStage}
          className="self-start sm:self-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center space-x-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Stage</span>
        </button>
      </div>

      {/* Preset Roadmap Templates */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Roadmap Templates:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ROADMAP_PRESETS.map((preset, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => onApplyPreset(preset.stages)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-[#007A61] border border-slate-200 hover:border-emerald-300 rounded-lg text-[10.5px] font-bold transition-all shadow-2xs cursor-pointer flex items-center space-x-1"
              title={`Load preset with ${preset.stages.length} research stages`}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Editable Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        {milestoneStages.map((stage, sIdx) => (
          <div
            key={sIdx}
            className="p-3.5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl space-y-2.5 shadow-2xs transition-all flex flex-col justify-between"
          >
            {/* Stage Card Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold text-white bg-[#007A61] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-2xs">
                  Stage {stage.stage || sIdx + 1}
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 focus-within:bg-white focus-within:border-[#007A61]">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={stage.targetDays || ''}
                    onChange={(e) => onUpdateStage(sIdx, 'targetDays', e.target.value)}
                    placeholder="e.g. Days 1-30"
                    className="w-24 bg-transparent text-[10.5px] font-bold text-slate-700 text-right focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveStage(sIdx)}
                  disabled={milestoneStages.length <= 1}
                  title={milestoneStages.length <= 1 ? "At least 1 stage is required" : "Delete this stage"}
                  className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-25 disabled:hover:text-slate-400 rounded-md hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stage Title */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                Stage Title / Milestone Focus *
              </label>
              <input
                type="text"
                required
                value={stage.title || ''}
                onChange={(e) => onUpdateStage(sIdx, 'title', e.target.value)}
                placeholder="e.g. Lab CAD, Schematic Design & Circuit Rig"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Stage Deliverable & Research Paragraph (Multi-line Textarea) */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Deliverables & Research Description (Detailed DPR Paragraph) *
                </label>
              </div>
              <textarea
                rows={3}
                required
                value={stage.deliverable || ''}
                onChange={(e) => onUpdateStage(sIdx, 'deliverable', e.target.value)}
                placeholder="Detail specific experimental milestones, test metrics, component procurement, field testing protocols, and DPR verification criteria in this stage..."
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:bg-white transition-all resize-y min-h-[78px] shadow-2xs placeholder:text-slate-400"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Add Stage Action & Tips */}
      <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onAddStage}
          className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-emerald-50 text-[#007A61] border border-emerald-200 hover:border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Research Stage (Stage {milestoneStages.length + 1})</span>
        </button>

        <span className="text-[10.5px] text-slate-500 text-center sm:text-right">
          Stages are mapped directly into State JoharSetu Project Monitoring & DPR Evaluation
        </span>
      </div>
    </div>
  );
};

export default MilestoneRoadmapBuilder;
