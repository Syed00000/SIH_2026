import React from 'react';
import { Building2, Landmark, Handshake, Plus } from 'lucide-react';

const ICONS = { corporate_csr: Building2, govt_grants: Landmark, joint_funding: Handshake };

export const CSRSourceSummaryCards = ({
  sourcesConfig,
  selectedSourceFilter,
  onFilterBySource,
  onOpenAddModal
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sourcesConfig.map((src) => {
        const Icon = ICONS[src.id] || Building2;
        const isSelected = selectedSourceFilter?.includes(src.id) || selectedSourceFilter === src.title;

        return (
          <div
            key={src.id}
            onClick={() => onFilterBySource?.(src.title)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 relative overflow-hidden group ${
              isSelected
                ? 'border-[#007A61] bg-emerald-50/40 shadow-xs ring-1 ring-[#007A61]'
                : 'bg-slate-50/60 border-slate-200/90 hover:bg-white hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className={`p-2.5 rounded-xl border ${src.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{src.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 inline-block ${src.badgeColor}`}>
                    {src.tag}
                  </span>
                </div>
              </div>
            </div>

            <div className={`p-3.5 bg-white rounded-xl space-y-1 border ${src.isLowFund ? 'border-rose-300 bg-rose-50/40 ring-2 ring-rose-200' : 'border-slate-200/90'}`}>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {src.hasDisbursed ? 'Remaining Available Pool' : 'Total Committed Pool'}
              </div>
              <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none ${src.isLowFund ? 'text-rose-600' : 'text-slate-900'}`}>
                {src.amountSub}
              </div>
              <div className={`text-[11px] font-bold font-mono ${src.isLowFund ? 'text-rose-600 font-extrabold' : 'text-slate-500'}`}>
                {src.amountFormatted} {src.isLowFund && '(Low Budget)'}
              </div>
              {src.hasDisbursed && (
                <div className="text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span>Committed: {src.allocatedFormatted}</span>
                  <span className="text-slate-800 font-bold font-mono">Transferred to Depts: - {src.disbursedFormatted}</span>
                </div>
              )}
            </div>

            <p className={`text-[11px] leading-snug ${src.isLowFund ? 'text-rose-700 font-semibold' : 'text-slate-600'}`}>{src.description}</p>

            {src.canAdd && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAddModal();
                }}
                className="w-full py-2 text-xs font-extrabold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs bg-slate-900 hover:bg-[#007A61] text-white"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add State Grant Fund</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CSRSourceSummaryCards;
