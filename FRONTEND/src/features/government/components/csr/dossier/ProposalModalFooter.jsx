import React from 'react';
import { ShieldCheck, RotateCcw, Lock, Coins, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useGovernmentTreasury } from '../../../hooks/useGovernmentTreasury.js';

export const ProposalModalFooter = ({
  onClose,
  isSaved,
  isProcessing,
  isFullyDisbursed,
  hasTrancheRequest,
  remainingBudget = 80000,
  rawDisbursed = 0,
  disburseAmount = 40000,
  setDisburseAmount,
  handleSaveStatus,
  handleRequestRevision,
  handleApproveAndSanction,
  handleDisburseSecondEmi
}) => {
  const treasury = useGovernmentTreasury();
  const isFirstTime = rawDisbursed === 0;
  const currentReleaseAmt = Math.min(remainingBudget, Math.max(1000, disburseAmount || remainingBudget));
  const isTreasuryLow = treasury.availableStateFund < currentReleaseAmt || treasury.availableStateFund <= 0;

  const handleLowFundClick = () => {
    alert(
      `⚠️ Low Budget Alert • Insufficient State Grant Fund\n\nGovernment State Treasury has ₹ ${treasury.availableStateFund.toLocaleString('en-IN')} available in the committed pool, but ₹ ${currentReleaseAmt.toLocaleString('en-IN')} is required to disburse this grant to the university.\n\nPlease scroll to the top of the proposal and click '+ Add State Grant Fund' to allocate funds before releasing.`
    );
  };

  return (
    <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      <div className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
        {isFullyDisbursed ? (
          <span className="text-emerald-700 flex items-center space-x-1 font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved DPR Budget Fully Disbursed & Completed ✓</span>
          </span>
        ) : isSaved ? (
          <span className="text-emerald-700 font-bold">✓ Disbursal & status updated and synchronized with University!</span>
        ) : isTreasuryLow ? (
          <div className="flex items-center space-x-2 text-rose-700 font-extrabold animate-pulse">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Low Fund Alert: State Treasury has ₹ {treasury.availableStateFund.toLocaleString('en-IN')} (Need: ₹ {currentReleaseAmt.toLocaleString('en-IN')})</span>
          </div>
        ) : remainingBudget > 0 ? (
          <div className="flex items-center space-x-2 text-slate-500">
            <span>Escrow Balance: <strong className="text-slate-800 font-mono">₹ {remainingBudget.toLocaleString('en-IN')}</strong></span>
            <span>&bull;</span>
            <span className="text-blue-700 font-extrabold">Ready to Send: ₹ {currentReleaseAmt.toLocaleString('en-IN')}</span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center space-x-2 justify-end w-full sm:w-auto">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all shadow-2xs"
        >
          Close Dossier
        </button>

        {!isFullyDisbursed && (
          <button
            type="button"
            onClick={handleSaveStatus}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs transition-all"
          >
            Save Notes
          </button>
        )}

        <button
          type="button"
          disabled={isProcessing || isFullyDisbursed}
          onClick={handleRequestRevision}
          className={`px-4 py-2 rounded-xl text-xs font-bold shadow-2xs flex items-center space-x-1.5 transition-all ${
            isFullyDisbursed
              ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              : 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Request Revision</span>
        </button>

        {isFullyDisbursed ? (
          <button
            type="button"
            disabled
            className="px-5 py-2 rounded-xl text-xs font-extrabold bg-slate-100 text-slate-500 border border-slate-300 flex items-center space-x-1.5 cursor-not-allowed shadow-2xs"
          >
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Approved Amount Completed</span>
          </button>
        ) : isTreasuryLow ? (
          <button
            type="button"
            onClick={handleLowFundClick}
            className="px-5 py-2 rounded-xl text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-2xs flex items-center space-x-1.5 transition-all ring-2 ring-rose-400"
            title="State Grant Treasury has ₹ 0 available"
          >
            <AlertTriangle className="w-4 h-4 text-white shrink-0" />
            <span>⚠️ Low Fund • State Treasury Deficit (₹ {treasury.availableStateFund.toLocaleString('en-IN')})</span>
          </button>
        ) : hasTrancheRequest || remainingBudget > 0 ? (
          <button
            type="button"
            disabled={isProcessing || currentReleaseAmt <= 0}
            onClick={handleDisburseSecondEmi}
            className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-2xs flex items-center space-x-1.5 transition-all hover:shadow-xs disabled:opacity-50"
          >
            <Coins className="w-4 h-4" />
            <span>
              {isFirstTime
                ? `Approve & Disburse 1st Tranche (₹ ${currentReleaseAmt.toLocaleString('en-IN')})`
                : hasTrancheRequest
                ? `Approve & Disburse Second EMI (₹ ${currentReleaseAmt.toLocaleString('en-IN')})`
                : `Approve & Disburse Supplemental Grant (₹ ${currentReleaseAmt.toLocaleString('en-IN')})`}
            </span>
          </button>
        ) : (
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleApproveAndSanction}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-[#007A61] hover:bg-[#006650] text-white cursor-pointer shadow-2xs flex items-center space-x-1.5 transition-all"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approve & Sanction Grant</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposalModalFooter;
