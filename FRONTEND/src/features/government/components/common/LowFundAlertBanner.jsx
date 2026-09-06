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
    <div className="p-3.5 bg-gradient-to-r from-rose-50 via-amber-50 to-rose-50 border-2 border-rose-300 rounded-xl text-rose-900 shadow-2xs space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center space-x-1.5">
              <span>⚠️ Low Budget Alert • Insufficient State Grant Fund</span>
            </h4>
            <p className="text-[11px] text-rose-700 font-medium mt-0.5 leading-snug">
              Government State Treasury has insufficient balance to disburse this grant to the university.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Available Pool</div>
          <div className="text-sm font-black font-mono text-rose-700">
            {formatRupeesINR(availableAmount)}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-600">
          <Landmark className="w-3.5 h-3.5 text-slate-400" />
          <span>Required for this grant: <strong className="font-mono text-slate-900">{formatRupeesINR(requiredAmount)}</strong></span>
        </div>

        {onOpenAddFund && (
          <button
            type="button"
            onClick={onOpenAddFund}
            className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add State Grant Fund</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default LowFundAlertBanner;
