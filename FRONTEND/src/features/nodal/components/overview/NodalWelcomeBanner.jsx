import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

export const NodalWelcomeBanner = ({
  onNavigateChallenges,
  onNavigateUniversities,
  onReload,
  loading
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
      <div>
        <h2 className="text-base font-black text-slate-900 tracking-tight">
          State Innovation & Problem Triage Center
        </h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Review grassroots civic problems, allocate challenges to Higher Education Institutes, and monitor R&D progress.
        </p>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={onReload}
          disabled={loading}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
          title="Refresh live overview metrics"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={onNavigateChallenges}
          className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-2xs transition-all cursor-pointer"
        >
          <span>Triage Challenges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NodalWelcomeBanner;
