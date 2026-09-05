import React from 'react';
import { Sliders, IndianRupee, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

export const TrancheAmountAdjuster = ({
  totalBudgetVal = 80000,
  rawDisbursed = 0,
  remainingBudget = 80000,
  disburseAmount = 40000,
  setDisburseAmount,
  isFullyDisbursed = false,
  hasTrancheRequest = false
}) => {
  if (isFullyDisbursed || remainingBudget <= 0) return null;

  const isFirstTime = rawDisbursed === 0;
  const retainedInEscrow = Math.max(0, remainingBudget - disburseAmount);

  const presets = [
    { label: '25%', value: Math.round(remainingBudget * 0.25) },
    { label: '50% (Recommended)', value: Math.round(remainingBudget * 0.5) },
    { label: '75%', value: Math.round(remainingBudget * 0.75) },
    { label: '100% Full', value: remainingBudget }
  ];

  const handleInputChange = (e) => {
    const val = Number(e.target.value.replace(/[^\d]/g, '')) || 0;
    const clamped = Math.min(remainingBudget, Math.max(0, val));
    setDisburseAmount(clamped);
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50/40 border border-blue-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span>
                {hasTrancheRequest
                  ? 'Release Second EMI (University Requested)'
                  : isFirstTime
                  ? 'Adjust 1st Tranche Release Amount'
                  : 'Adjust Tranche Disbursal Amount'}
              </span>
              <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {hasTrancheRequest ? 'Tranche 2 Disbursal' : isFirstTime ? 'Initial Disbursal' : 'Supplemental Tranche'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              {hasTrancheRequest
                ? 'Review and disburse University requested 2nd EMI grant from State Treasury Escrow via PFMS.'
                : 'Configure grant allocation disbursed to University Escrow account via PFMS.'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
          <Wallet className="w-3.5 h-3.5 text-blue-600" />
          <span>Max Available: ₹ {remainingBudget.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Breakdown 3-col preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Approved DPR Budget</span>
          <span className="text-sm font-black text-slate-900 font-mono">₹ {totalBudgetVal.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-500 block">Total Sanctioned</span>
        </div>

        <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 space-y-0.5 ring-1 ring-blue-400/20">
          <span className="text-[10px] font-extrabold text-blue-700 uppercase block">
            {hasTrancheRequest ? 'Disbursing Now (2nd EMI)' : isFirstTime ? 'Disbursing Now (1st Time)' : 'Disbursing Now'}
          </span>
          <span className="text-sm font-black text-blue-700 font-mono">₹ {disburseAmount.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-blue-600 font-bold block">
            {remainingBudget > 0 ? `${Math.round((disburseAmount / remainingBudget) * 100)}% of Remaining` : '100%'}
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Retained in Escrow</span>
          <span className="text-sm font-black text-slate-700 font-mono">₹ {retainedInEscrow.toLocaleString('en-IN')}</span>
          <span className="text-[10px] text-slate-500 block">For Tranche 2 / Milestone</span>
        </div>
      </div>

      {/* Interactive Controls: Quick Presets & Currency Input */}
      <div className="space-y-2.5 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Quick Presets:
            </span>
            {presets.map((p) => {
              const isSelected = disburseAmount === p.value;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setDisburseAmount(p.value)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {p.label} (₹ {(p.value).toLocaleString('en-IN')})
                </button>
              );
            })}
          </div>

          {/* Amount input */}
          <div className="flex items-center space-x-2 shrink-0">
            <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap">Amount to Send:</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                value={disburseAmount.toLocaleString('en-IN')}
                onChange={handleInputChange}
                className="w-32 pl-6 pr-2.5 py-1.5 bg-white border-2 border-blue-300 rounded-xl font-mono text-xs font-black text-slate-900 focus:outline-none focus:border-blue-600 text-right shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Range slider */}
        <div className="space-y-1">
          <input
            type="range"
            min={Math.min(1000, remainingBudget)}
            max={remainingBudget}
            step={1000}
            value={disburseAmount}
            onChange={(e) => setDisburseAmount(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Min (₹ 1,000)</span>
            <span className="font-bold text-blue-700">Slide to adjust release amount</span>
            <span>Max (₹ {remainingBudget.toLocaleString('en-IN')})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrancheAmountAdjuster;
