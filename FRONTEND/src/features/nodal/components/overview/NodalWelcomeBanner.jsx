import React from 'react';
import { ArrowRight, RotateCcw } from 'lucide-react';

export const NodalWelcomeBanner = ({
  onNavigateChallenges,
  onNavigateUniversities,
  onReload,
  loading,
  nodalDistrict = ''
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            {nodalDistrict ? `${nodalDistrict} District Innovation & Triage Center` : 'State Innovation & Problem Triage Center'}
          </h2>
          {nodalDistrict && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold flex items-center gap-1">
              <span>📍</span> <span>{nodalDistrict}</span>
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {nodalDistrict
            ? `Review and triage grassroots civic problems registered in ${nodalDistrict} District and assign to Higher Education Institutes.`
            : 'Review grassroots civic problems, allocate challenges to Higher Education Institutes, and monitor R&D progress.'}
        </p>
      </div>

      <div className="flex items-center space-x-2 shrink-0">
        <button
          onClick={onReload}
          disabled={loading}
          className="p-2 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
          title="Refresh live overview metrics"
        >
          <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => onNavigateChallenges && onNavigateChallenges('Under Review')}
          className="flex items-center space-x-1.5 bg-[#0f4b3a] hover:bg-[#0c382b] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <span>Triage Challenges</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NodalWelcomeBanner;
