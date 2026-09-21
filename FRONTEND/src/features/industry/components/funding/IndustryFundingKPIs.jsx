import React from 'react';
import { Coins, TrendingUp, CheckCircle2, GraduationCap } from 'lucide-react';
import { formatLakhs } from './funding.helpers.js';

export const IndustryFundingKPIs = ({ fundsData, pendingRequestsCount }) => {
  const remainingPct = fundsData.totalCommitted > 0 ? Math.round((fundsData.totalRemaining / fundsData.totalCommitted) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Card 1: Committed */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Committed Capital</span>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-black text-slate-900">{formatLakhs(fundsData.totalCommitted)}</h3>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            {fundsData.funds?.length || 0} Active Corporate Fund Pools
          </p>
        </div>
      </div>

      {/* Card 2: Disbursed */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Disbursed to Universities</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-black text-emerald-700">{formatLakhs(fundsData.totalDisbursed)}</h3>
          <p className="text-[11px] font-semibold text-emerald-600 mt-0.5 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {fundsData.disbursements?.length || 0} Settled Grants
          </p>
        </div>
      </div>

      {/* Card 3: Available Remaining Balance */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Available Grant Balance</span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-black text-blue-700">{formatLakhs(fundsData.totalRemaining)}</h3>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${remainingPct}%` }} />
          </div>
          <span className="text-[10px] font-bold text-slate-400 mt-1 block">{remainingPct}% Pool Remaining</span>
        </div>
      </div>

      {/* Card 4: Proposals Pipeline */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Incoming Proposals</span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-2xl font-black text-amber-700">{pendingRequestsCount} Pending</h3>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">From Jharkhand Universities & HEIs</p>
        </div>
      </div>
    </div>
  );
};

export default IndustryFundingKPIs;
