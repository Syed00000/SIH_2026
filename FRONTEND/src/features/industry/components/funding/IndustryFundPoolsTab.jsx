import React from 'react';
import { Plus, Coins, ChevronRight, Trash2 } from 'lucide-react';
import { formatAmountINR, formatLakhs } from './funding.helpers.js';

export const IndustryFundPoolsTab = ({ fundsData, onAddFund, onDisburse, onDeleteFund }) => {
  return (
    <div className="space-y-4">
      {/* Top visual Donut Chart & Category Breakdown card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-6">
          {/* Left Donut representation */}
          <div className="flex items-center space-x-6 shrink-0">
            <div className="w-36 h-36 relative flex items-center justify-center">
              <div className="w-full h-full rounded-full border-[14px] border-[#007A61] relative flex items-center justify-center">
                <div 
                  className="absolute inset-0 rounded-full border-[14px] border-blue-500" 
                  style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%)' }} 
                />
                <div 
                  className="absolute inset-0 rounded-full border-[14px] border-purple-500" 
                  style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 50%)' }} 
                />
                <div className="text-center">
                  <span className="block text-base font-black text-slate-900">{fundsData.totalCommittedFormatted}</span>
                  <span className="block text-[8px] font-bold text-slate-500 uppercase">COMMITTED</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">Capital Portfolio Overview</h4>
              <p className="text-xs text-slate-500">Corporate Innovation Allocation</p>
              <div className="pt-2 flex items-center space-x-2">
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                  Available: {formatLakhs(fundsData.totalRemaining)}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                  Disbursed: {formatLakhs(fundsData.totalDisbursed)}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Category Distribution Grid */}
          <div className="w-full max-w-xl space-y-2.5">
            {fundsData.distribution?.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Rem: <b className="text-slate-800">₹ {(item.remaining / 100000).toFixed(1)}L</b>
                  </span>
                  <div className="w-20 sm:w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: item.color,
                        width: `${item.allocated > 0 ? Math.round((item.utilized / item.allocated) * 100) : 0}%`
                      }} 
                    />
                  </div>
                  <span className="font-black text-slate-900 min-w-[70px] text-right">₹{item.value}.00 L</span>
                  <span className="text-slate-400 font-mono text-[10px] min-w-[32px]">({item.percentage})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List of active fund entries */}
        <div className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center">
              <Coins className="w-4 h-4 mr-2 text-[#007A61]" /> Active Fund Allocations
            </h4>
            <button
              onClick={onAddFund}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Fund Pool</span>
            </button>
          </div>

          {fundsData.funds && fundsData.funds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {fundsData.funds.map((fund) => {
                const remPct = fund.allocatedAmount > 0 
                  ? Math.round((fund.remainingAmount / fund.allocatedAmount) * 100)
                  : 0;

                return (
                  <div 
                    key={fund.fundId || fund._id}
                    className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-700">
                          {fund.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                          fund.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {fund.status}
                        </span>
                      </div>

                      <h5 className="text-sm font-black text-slate-900 leading-snug">{fund.title}</h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{fund.description}</p>
                      <p className="text-[10px] font-mono text-slate-400">Ref: {fund.sanctionOrderNo}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500 font-medium">Available Balance:</span>
                        <span className="font-black text-emerald-700">{formatAmountINR(fund.remainingAmount)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#007A61] rounded-full transition-all"
                          style={{ width: `${remPct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                        <span>Allocated: {formatAmountINR(fund.allocatedAmount)}</span>
                        <span>{remPct}% Remaining</span>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          onClick={() => onDisburse(null)}
                          disabled={fund.remainingAmount <= 0}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer disabled:opacity-40"
                        >
                          <span>Disburse Grant</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onDeleteFund(fund.fundId || fund._id)}
                          title="Delete Fund"
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <Coins className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
              <h5 className="text-sm font-bold text-slate-800">No Corporate Fund Pools Allocated Yet</h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Allocate corporate innovation or CSR capital to enable direct grants to universities and student research projects.
              </p>
              <button
                onClick={onAddFund}
                className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Allocate Your First Fund Pool</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndustryFundPoolsTab;
