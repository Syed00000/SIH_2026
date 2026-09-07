import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export const PrototypePreviewCard = ({ problem, tool }) => {
  if (!problem) return null;

  const protoTechLower = (problem.techStack || '').toLowerCase();
  const matchedTags = (tool?.techStackTags || []).filter((tag) =>
    protoTechLower.includes(tag.toLowerCase())
  );
  const isMatch = matchedTags.length > 0;

  return (
    <div className="p-3.5 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-teal-50/40 border border-emerald-200 rounded-2xl space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-[#007A61] flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Prototype Technical Blueprint</span>
        </span>
        <span className="text-[10px] font-mono font-extrabold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
          {problem.projectId}
        </span>
      </div>

      <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-1">
        <div className="text-[10px] font-extrabold uppercase text-slate-400">Prototype Tech Stack:</div>
        <div className="text-xs font-mono font-bold text-slate-900">
          {problem.techStack || 'Hardware Telemetry Array, Python, Cloud Sync'}
        </div>
        {isMatch ? (
          <div className="flex items-center space-x-1 text-[10.5px] font-bold text-emerald-700 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>⚡ Direct Match Found for: {matchedTags.join(', ')}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 text-[10px] text-slate-500 pt-0.5">
            <span>💡 Industry tool can be adapted as an R&D extension for this project</span>
          </div>
        )}
      </div>

      {problem.mechanism && (
        <p className="text-[11px] text-slate-600 italic line-clamp-2 px-1">
          "{problem.mechanism}"
        </p>
      )}
    </div>
  );
};

export default PrototypePreviewCard;
