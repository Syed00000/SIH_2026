import React from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

export const UniversitiesPanelHeader = ({ onReload, loading, toastMsg }) => {
  return (
    <div className="space-y-3">
      {toastMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-[#064e3b] text-xs font-bold rounded-lg flex items-center space-x-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#047857] shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-lg p-5 shadow-2xs">
        <div>
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Accredited Universities & Higher Education Institutes
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor institutional capacity, review problem allocation loads, and assign grassroots challenges.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={onReload}
            disabled={loading}
            className="flex items-center space-x-1.5 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Refresh Universities"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Directory</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversitiesPanelHeader;
