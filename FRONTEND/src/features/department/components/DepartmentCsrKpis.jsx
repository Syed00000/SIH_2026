import React from 'react';
import { IndianRupee, CheckCircle2, ShieldCheck, Clock, Send } from 'lucide-react';

export const DepartmentCsrKpis = ({
  availableBalance = 0,
  totalSpentOnProblems = 0,
  totalAllocated = 0,
  pendingCount = 0,
  isWard = false,
  allocateLabel = 'Allocate Funds',
  onOpenAllocateFund
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left select-none">
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">Available Balance</span>
          <div className="text-base sm:text-lg font-black text-emerald-700 mt-0.5 truncate">₹ {availableBalance.toLocaleString('en-IN')}</div>
          {onOpenAllocateFund ? (
            <button
              type="button"
              onClick={onOpenAllocateFund}
              className="mt-1.5 px-2.5 py-1 bg-[#007A61] hover:bg-[#006650] text-white text-[10px] font-extrabold rounded-lg inline-flex items-center gap-1 cursor-pointer transition shadow-2xs active:scale-95"
            >
              <Send className="w-2.5 h-2.5" />
              <span>{allocateLabel}</span>
            </button>
          ) : (
            <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">{isWard ? 'Available for civic works' : 'Ready for hierarchy transfer'}</span>
          )}
        </div>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0"><IndianRupee className="w-4 h-4 text-emerald-700" /></div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">Utilized on Problems</span>
          <div className="text-base sm:text-lg font-black text-blue-700 mt-0.5 truncate">₹ {totalSpentOnProblems.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">Disbursed to ground issues</span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><CheckCircle2 className="w-4 h-4 text-blue-700" /></div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">Total Sanctioned Pool</span>
          <div className="text-base sm:text-lg font-black text-purple-700 mt-0.5 truncate">₹ {totalAllocated.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">Hierarchically Sanctioned Grant</span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0"><ShieldCheck className="w-4 h-4 text-purple-700" /></div>
      </div>

      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider truncate">Pending Requisitions</span>
          <div className="text-base sm:text-lg font-black text-amber-700 mt-0.5 truncate">{pendingCount}</div>
          <span className="text-[10px] text-slate-500 font-medium block truncate mt-0.5">{!isWard ? 'Awaiting your approval' : 'Under parent review'}</span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0"><Clock className="w-4 h-4 text-amber-700" /></div>
      </div>
    </div>
  );
};

export default DepartmentCsrKpis;
