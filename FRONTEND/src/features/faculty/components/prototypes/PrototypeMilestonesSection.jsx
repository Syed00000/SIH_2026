import React from 'react';
import { Map, Lock, Calendar } from 'lucide-react';

const StageCard = ({ stage, index }) => (
  <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3.5 space-y-2 text-left">
    <div className="flex items-center justify-between gap-2 flex-wrap">
      <div className="flex items-center space-x-2">
        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#007A61] text-white rounded-full shrink-0">
          Stage {stage.stage || index + 1}
        </span>
        <h5 className="text-xs font-bold text-slate-900 leading-snug">
          {stage.title || `Stage ${stage.stage || index + 1}`}
        </h5>
      </div>
      {stage.targetDays && (
        <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-slate-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg shrink-0 font-mono shadow-2xs">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>{stage.targetDays}</span>
        </span>
      )}
    </div>
    {stage.deliverable && (
      <p className="text-[11px] font-normal text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/70">
        {stage.deliverable}
      </p>
    )}
  </div>
);

export const PrototypeMilestonesSection = ({ stages = [] }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3 text-left">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Map className="w-4 h-4 text-[#007A61]" />
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <span>3. Research Stages &amp; Milestone Roadmap</span>
            <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-[#007A61] rounded-full border border-emerald-200">
              {stages.length} Stage{stages.length !== 1 ? 's' : ''}
            </span>
          </h4>
        </div>
        <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>Locked from Sanctioned Proposal (Read-Only)</span>
        </div>
      </div>

      {stages.length === 0 ? (
        <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-xs font-bold text-slate-600">No research stages linked to this prototype.</p>
          <p className="text-[10.5px] text-slate-400 mt-0.5">Proposal milestone stages will automatically appear here once approved.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {stages.map((stage, i) => (
            <StageCard key={i} stage={stage} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PrototypeMilestonesSection;
