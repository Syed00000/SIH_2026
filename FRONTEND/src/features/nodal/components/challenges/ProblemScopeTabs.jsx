import React from 'react';
import { Sparkles } from 'lucide-react';

export const ProblemScopeTabs = ({ totalCount = 0 }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
      <div className="flex items-center gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-[#007A61] text-white shadow-xs select-none">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Citizen Challenges</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white">
            {totalCount}
          </span>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 font-semibold px-2">
        <span className="text-[#007A61] font-bold">
          🏛️ All Citizen Ground Truth Submissions & Innovation Challenges
        </span>
      </div>
    </div>
  );
};

export default ProblemScopeTabs;
