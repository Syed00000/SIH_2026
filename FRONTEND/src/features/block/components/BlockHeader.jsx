import React from 'react';
import { Building2, MapPin, UserCheck, Phone, Mail, ArrowLeft } from 'lucide-react';

export const BlockHeader = ({ block, totalIssues = 0, activeIssues = 0, onBack }) => {
  return (
    <header className="bg-white border-b border-slate-200/90 shadow-2xs px-4 sm:px-8 py-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Emblem & Block Identity */}
        <div className="flex items-center gap-3.5">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Back to District Dashboard"
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <img
            src="https://www.jharkhand.gov.in/images/jhlogo55.PNG"
            alt="Government of Jharkhand"
            className="w-11 h-11 object-contain shrink-0 drop-shadow-xs"
          />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                {block?.name || 'Block Administration'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-[#007A61]/10 text-[#007A61] border border-[#007A61]/20">
                {block?.blockId || 'BLK-JH'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>{block?.district || 'Ranchi'} District • Block Development Office (BDO)</span>
            </p>
          </div>
        </div>

        {/* Right: BDO Profile & KPIs */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-black text-slate-800 flex items-center justify-end gap-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              {block?.bdoName || 'Block Development Officer'}
            </span>
            <span className="text-[10.5px] text-slate-500 font-mono">
              {block?.bdoEmail || 'bdo@jharkhand.gov.in'}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-black text-slate-900 block leading-none">{totalIssues}</span>
              <span className="text-[9.5px] text-slate-400 font-bold uppercase">Total</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-xs font-black text-amber-700 block leading-none">{activeIssues}</span>
              <span className="text-[9.5px] text-amber-600 font-bold uppercase">Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BlockHeader;
