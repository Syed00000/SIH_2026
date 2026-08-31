import React from 'react';
import { Lock, FileText } from 'lucide-react';

export const ProblemBriefBanner = ({
  showStatement,
  setShowStatement,
  challenge
}) => {
  return (
    <>
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-1.5 text-[10.5px] text-slate-500 truncate">
          <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span>Messages auto-delete 12 hours after being viewed by both parties</span>
        </div>

        <button
          type="button"
          onClick={() => setShowStatement(!showStatement)}
          className="flex items-center space-x-1 text-[11px] font-bold text-[#007A61] hover:underline cursor-pointer shrink-0 ml-2"
        >
          <FileText className="w-3.5 h-3.5 text-[#007A61]" />
          <span>{showStatement ? 'Hide Brief' : 'Problem Brief'}</span>
        </button>
      </div>

      {showStatement && challenge && (
        <div className="bg-amber-50/60 px-4 py-2.5 border-b border-amber-200/80 text-xs text-slate-800 italic flex-shrink-0 animate-in slide-in-from-top-1 duration-150">
          <strong className="text-amber-900">Problem Statement:</strong> "{challenge.problemStatement || challenge.description || challenge.title}"
        </div>
      )}
    </>
  );
};

export default ProblemBriefBanner;
