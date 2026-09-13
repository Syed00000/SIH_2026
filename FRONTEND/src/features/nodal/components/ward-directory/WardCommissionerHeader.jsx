import React from 'react';
import { Building2, RefreshCw, ShieldCheck, MapPin } from 'lucide-react';

export const WardCommissionerHeader = ({ wardDept, loading, onReload, onOpenDirectory }) => {
  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0 border border-[#007A61]/20">
          <Building2 className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-black text-slate-900 leading-none">
              {wardDept?.name || 'ward commissioner'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
              {wardDept?.category || 'Ward Commissioner'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1 flex-wrap">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#007A61]" />
              <span>{wardDept?.headName || 'mukesh'} ({wardDept?.headRole || 'Department Officer'})</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{wardDept?.district || '133'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {onOpenDirectory && (
          <button
            type="button"
            onClick={onOpenDirectory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Ward Directory</span>
          </button>
        )}
        <button
          type="button"
          onClick={onReload}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#007A61]' : ''}`} />
          <span>Sync</span>
        </button>
      </div>
    </div>
  );
};

export default WardCommissionerHeader;
