import React from 'react';
import { ShieldCheck, RotateCcw, Lock, Coins, CheckCircle2 } from 'lucide-react';

export const ProposalModalFooter = ({
  onClose,
  isSaved,
  isProcessing,
  isFullyDisbursed,
  hasTrancheRequest,
  remainingBudget,
  handleSaveStatus,
  handleRequestRevision,
  handleApproveAndSanction,
  handleDisburseSecondEmi
}) => {
  return (
    <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
      <div className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
        {isFullyDisbursed ? (
          <span className="text-emerald-700 flex items-center space-x-1 font-extrabold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approved DPR Budget Fully Disbursed & Completed ✓</span>
          </span>
        ) : isSaved ? (
          <span className="text-emerald-700 font-bold">✓ Proposal status updated and synchronized with University!</span>
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
        ) : hasTrancheRequest || remainingBudget > 0 ? (
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleDisburseSecondEmi}
            className="px-5 py-2 rounded-xl text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-2xs flex items-center space-x-1.5 transition-all"
          >
            <Coins className="w-4 h-4" />
            <span>
              {hasTrancheRequest
                ? `Approve & Disburse Second EMI (₹ ${remainingBudget.toLocaleString('en-IN')})`
                : `Approve & Disburse Supplemental Grant (₹ ${remainingBudget.toLocaleString('en-IN')})`}
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
