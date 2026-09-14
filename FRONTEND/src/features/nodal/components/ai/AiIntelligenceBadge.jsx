import React from 'react';
import { Sparkles, AlertTriangle, Building, CheckCircle2 } from 'lucide-react';

export const AiIntelligenceBadge = ({ aiIntelligence, onClick, compact = false }) => {
  if (!aiIntelligence) return null;

  const isDuplicate = aiIntelligence.deduplication?.isDuplicate;
  const simScore = Math.round((aiIntelligence.deduplication?.similarityScore || 0) * 100);
  const deptName = aiIntelligence.recommendedDepartment?.name;
  const deptConf = aiIntelligence.recommendedDepartment?.confidence;

  if (isDuplicate) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-all cursor-pointer shadow-2xs group"
        title={`AI Duplicate Warning: ${simScore}% similarity with ${aiIntelligence.deduplication?.matchedChallengeId || 'existing problem'}`}
      >
        <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 group-hover:scale-110 transition-transform" />
        <span>{compact ? `${simScore}% Dup` : `⚠️ Duplicate Alert (${simScore}%)`}</span>
      </button>
    );
  }

  if (deptName) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs group"
        title={`AI Routing: ${deptName} (${deptConf || 88}% confidence)`}
      >
        <Sparkles className="w-3 h-3 text-emerald-700 shrink-0 group-hover:rotate-12 transition-transform" />
        <span className="truncate max-w-[135px] font-medium text-slate-800">{compact ? deptName : `AI: ${deptName}`}</span>
        {deptConf ? <span className="text-[10px] text-emerald-700 font-mono font-bold">({deptConf}%)</span> : null}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
      <Sparkles className="w-2.5 h-2.5 text-slate-400" />
      <span>AI Analyzed</span>
    </span>
  );
};

export default AiIntelligenceBadge;
