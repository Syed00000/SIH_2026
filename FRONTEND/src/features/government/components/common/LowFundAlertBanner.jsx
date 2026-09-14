import React from 'react';
import { AlertTriangle, Plus, Landmark } from 'lucide-react';
import { formatRupeesINR } from '../projects/GrantPaymentModal.jsx';

export const LowFundAlertBanner = ({
  availableAmount = 0,
  requiredAmount = 0,
  onOpenAddFund,
  compact = false
}) => {
  const isZero = availableAmount <= 0;
  const isDeficit = availableAmount < requiredAmount;

  if (!isZero && !isDeficit) return null;

  if (compact) {
    return (
      <div className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-bold">
            {isZero ? 'Low Budget Alert: Available State Fund is ₹ 0' : `Low Budget: Only ${formatRupeesINR(availableAmount)} available`}
          </span>
        </div>
        {onOpenAddFund && (
          <button
            type="button"
            onClick={onOpenAddFund}
            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1 shadow-2xs"
          >
            <Plus className="w-3 h-3" />
            <span>Add Fund</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 bg-amber-50/60 border border-amber-200/90 rounded-2xl text-amber-950 shadow-2xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center space-x-2">
              <span>Treasury Corpus Allocation Required</span>
              <span className="px-2 py-0.2 text-[9.5px] font-bold bg-amber-200/80 text-amber-900 rounded-full">
                Action Required
              </span>
            </h4>
            <p className="text-[11.5px] text-amber-800 font-medium mt-0.5 leading-relaxed">
              The State Innovation Grant pool currently lacks sufficient unallocated balance to disburse this tranche. Please allocate funds to the state treasury pool.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0 bg-white/80 border border-amber-200 px-3 py-1.5 rounded-xl">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Available Pool</div>
          <div className="text-sm font-black font-mono text-amber-900">
            {formatRupeesINR(availableAmount)}
          </div>
        </div>
      </div>

      <div className="pt-2.5 border-t border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-700">
          <Landmark className="w-3.5 h-3.5 text-amber-700" />
          <span>Required for this tranche: <strong className="font-mono text-slate-900">{formatRupeesINR(requiredAmount)}</strong></span>
        </div>

        {onOpenAddFund && (
          <button
            type="button"
            onClick={onOpenAddFund}
            className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Allocate Treasury Funds</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LowFundAlertBanner;
