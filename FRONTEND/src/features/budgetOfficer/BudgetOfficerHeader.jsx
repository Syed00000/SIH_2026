import React from 'react';
import { Calculator, ShieldCheck, Menu, RefreshCw } from 'lucide-react';

export const BudgetOfficerHeader = ({
  user,
  onLogout,
  onRefresh,
  refreshing,
  onMenuClick
}) => {
  const officerName = user?.fullName || user?.name || 'Budget Officer';
  const designation = user?.designation || 'Budget & Finance Team';
  const departmentName = user?.department || 'Budget Wing';

  return (
    <header className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 select-none flex-shrink-0 z-30 shadow-2xs">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onMenuClick && (
            <button
              type="button"
              onClick={onMenuClick}
              className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
              title="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#007A61]/10 text-[#007A61] flex items-center justify-center shrink-0 border border-[#007A61]/20">
            <Calculator className="w-5 h-5 text-[#007A61]" />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-xs sm:text-base font-black text-slate-900 truncate leading-snug">
                {officerName}
              </h1>
              <span className="px-1.5 sm:px-2 py-0.2 rounded-full text-[9px] sm:text-[10px] font-extrabold border shrink-0 bg-emerald-50 text-emerald-800 border-emerald-200">
                {user?.officerId || 'BO-PORTAL'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400 font-medium truncate mt-0.5">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#007A61]" />
                <span className="truncate">{designation}</span>
              </span>
              <span>•</span>
              <span className="truncate text-slate-500">
                {departmentName}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <button 
            type="button" 
            onClick={onRefresh}
            disabled={refreshing}
            className="p-1.5 sm:p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${refreshing ? 'animate-spin text-[#007A61]' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default BudgetOfficerHeader;
