import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const ChallengesPagination = ({ currentCount, totalCount }) => {
  return (
    <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
      <span className="text-[10px] font-bold text-slate-400 uppercase">
        Showing 1 to {currentCount} of {totalCount} challenges
      </span>

      <div className="flex items-center space-x-1">
        <button
          className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-colors"
          disabled
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button className="w-6 h-6 rounded bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
          1
        </button>
        <button
          className="p-1 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-500 disabled:opacity-40 transition-colors"
          disabled
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ChallengesPagination;
