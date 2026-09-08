import React from 'react';
import { Sparkles, Layers } from 'lucide-react';

export const ProblemScopeTabs = ({ activeTab = 'big', onTabChange, totalCount = 0 }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
      <div className="flex items-center gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60">
        {/* Big Problems Tab */}
        <button
          type="button"
          onClick={() => onTabChange('big')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'big'
              ? 'bg-[#007A61] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Big Problems</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'big' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Small Problems Tab */}
        <button
          type="button"
          onClick={() => onTabChange('small')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'small'
              ? 'bg-[#007A61] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Small Problems</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'small' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {totalCount}
          </span>
        </button>
      </div>

      <div className="text-[11px] text-slate-500 font-semibold px-2">
        {activeTab === 'big' ? (
          <span className="text-[#007A61] font-bold">
            🏢 Showing Big Scale / State R&D & Academic Innovation Challenges
          </span>
        ) : (
          <span className="text-amber-700 font-bold">
            🏘️ Showing Small Scale / Grassroots & Local District Grievances
          </span>
        )}
      </div>
    </div>
  );
};

export default ProblemScopeTabs;
