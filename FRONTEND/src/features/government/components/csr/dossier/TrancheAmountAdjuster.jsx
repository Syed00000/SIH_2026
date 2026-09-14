import React, { useState } from 'react';
import { Sliders, IndianRupee, ShieldCheck, Wallet, ArrowRight, AlertTriangle } from 'lucide-react';
import { useGovernmentTreasury } from '../../../hooks/useGovernmentTreasury.js';
import { LowFundAlertBanner } from '../../common/LowFundAlertBanner.jsx';
import { AddStateGrantModal } from '../AddStateGrantModal.jsx';

export const TrancheAmountAdjuster = ({
  totalBudgetVal = 80000,
  rawDisbursed = 0,
  remainingBudget = 80000,
  disburseAmount = 40000,
  setDisburseAmount,
  isFullyDisbursed = false,
  hasTrancheRequest = false
}) => {
  const [showAddFundModal, setShowAddFundModal] = useState(false);
  const treasury = useGovernmentTreasury();

  if (isFullyDisbursed || remainingBudget <= 0) return null;

  const isFirstTime = rawDisbursed === 0;
  const retainedInEscrow = Math.max(0, remainingBudget - disburseAmount);
  const isTreasuryLow = treasury.availableStateFund < disburseAmount || treasury.availableStateFund <= 0;

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
    <div className="bg-white border border-slate-300 rounded-md p-4 sm:p-5 shadow-2xs space-y-4 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-[#007A61] text-white flex items-center justify-center shadow-2xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
              <span>
                {hasTrancheRequest
                  ? 'Tranche 2 Release Allocation'
                  : isFirstTime
                  ? 'Initial Tranche Release'
                  : 'Tranche Disbursal Allocation'}
              </span>
              <span className="bg-emerald-50 text-[#007A61] border border-emerald-200 text-[10px] px-2 py-0.5 rounded-xs font-extrabold">
                {hasTrancheRequest ? 'Second Installment' : isFirstTime ? '1st Installment (PFMS)' : 'Interim Release'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {hasTrancheRequest
                ? 'Review and disburse University requested 2nd EMI grant from State Treasury Escrow via PFMS.'
                : 'Configure grant allocation disbursed to University Escrow account via PFMS.'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
          <Wallet className="w-3.5 h-3.5 text-[#007A61]" />
          <span>Max Available: ₹ {remainingBudget.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Low Fund Banner if treasury balance is insufficient */}
      {isTreasuryLow && (
        <LowFundAlertBanner
          availableAmount={treasury.availableStateFund}
          requiredAmount={disburseAmount}
          onOpenAddFund={() => setShowAddFundModal(true)}
        />
      )}

      {/* Breakdown 3-col preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-slate-50/70 rounded-md border border-slate-300 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Approved DPR Budget</span>
          <span className="text-sm font-black text-slate-900 font-mono">₹ {totalBudgetVal.toLocaleString('en-IN')}</span>
          <span className="text-[10.5px] text-slate-500 block">Total Sanctioned Corpus</span>
        </div>

        <div className={`p-3.5 rounded-md border space-y-0.5 transition-all ${
          isTreasuryLow
            ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300/40'
            : 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300/30'
        }`}>
          <span className={`text-[10px] font-extrabold uppercase tracking-wider flex items-center space-x-1 ${
            isTreasuryLow ? 'text-amber-800' : 'text-[#007A61]'
          }`}>
            {isTreasuryLow && <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />}
            <span>
              {isTreasuryLow
                ? 'Treasury Allocation Pending'
                : hasTrancheRequest
                ? 'Disbursing Installment (2nd EMI)'
                : isFirstTime
                ? 'Disbursing 1st Tranche'
                : 'Disbursing Now'}
            </span>
          </span>
          <span className={`text-sm font-black font-mono ${isTreasuryLow ? 'text-amber-900' : 'text-[#007A61]'}`}>
            ₹ {disburseAmount.toLocaleString('en-IN')}
          </span>
          <span className={`text-[10.5px] font-semibold block ${isTreasuryLow ? 'text-amber-700' : 'text-emerald-700'}`}>
            {isTreasuryLow
              ? `State Pool: ₹ ${treasury.availableStateFund.toLocaleString('en-IN')}`
              : remainingBudget > 0 ? `${Math.round((disburseAmount / totalBudgetVal) * 100)}% of DPR Budget` : '100%'}
          </span>
        </div>

        <div className="p-3.5 bg-slate-50/70 rounded-md border border-slate-300 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Retained in State Escrow</span>
          <span className="text-sm font-black text-slate-700 font-mono">₹ {retainedInEscrow.toLocaleString('en-IN')}</span>
          <span className="text-[10.5px] text-slate-500 block">Released on Prototype Verification</span>
        </div>
      </div>

      {/* Interactive Controls: Quick Presets & Currency Input */}
      <div className="space-y-3 pt-1">
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
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer shadow-2xs ${
                    isSelected
                      ? 'bg-[#007A61] text-white'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300'
                  }`}
                >
                  {p.label} (₹ {(p.value).toLocaleString('en-IN')})
                </button>
              );
            })}
          </div>

          {/* Amount input */}
          <div className="flex items-center space-x-2 shrink-0">
            <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap">Disbursal Amount:</label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
              <input
                type="text"
                value={disburseAmount.toLocaleString('en-IN')}
                onChange={handleInputChange}
                className="w-32 pl-6 pr-2.5 py-1.5 bg-white border border-slate-300 rounded-md font-mono text-xs font-black text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#007A61] focus:border-[#007A61] text-right shadow-2xs"
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
            className="w-full h-1.5 bg-slate-200 rounded-sm appearance-none cursor-pointer accent-[#007A61]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
            <span>Min (₹ 1,000)</span>
            <span className="font-semibold text-[#007A61]">Adjust tranche slider</span>
            <span>Max (₹ {remainingBudget.toLocaleString('en-IN')})</span>
          </div>
        </div>
      </div>

      <AddStateGrantModal
        isOpen={showAddFundModal}
        onClose={() => setShowAddFundModal(false)}
        onFundAdded={treasury.refreshTreasury}
      />
    </div>
  );
};

export default TrancheAmountAdjuster;
