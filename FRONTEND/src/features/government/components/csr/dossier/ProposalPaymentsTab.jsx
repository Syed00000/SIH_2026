import React from 'react';
import { CreditCard, IndianRupee, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { parseGrantRupees, formatRupeesINR } from '../../projects/GrantPaymentModal.jsx';

export const ProposalPaymentsTab = ({ proposal, linkedPayments = [], onInitiateDisbursal }) => {
  const totalBudgetRupees = parseGrantRupees(proposal?.fundingRequested || proposal?.allocatedAmount || '₹ 75,000');
  
  // Only consider payments with valid positive amount
  const validPayments = linkedPayments.filter(
    (p) => (Number(p.rawAmount) > 0) || (p.amount && p.amount !== '₹ 0' && p.amount !== '0')
  );

  const totalDisbursedRupees = validPayments.reduce(
    (sum, p) => sum + (Number(p.rawAmount) || parseGrantRupees(p.amount || p.disbursedAmount)),
    0
  );

  const pendingRupees = Math.max(0, totalBudgetRupees - totalDisbursedRupees);
  const disbursalPercentage = totalBudgetRupees > 0 ? Math.round((totalDisbursedRupees / totalBudgetRupees) * 100) : 0;

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Financial Health Summary Banner */}
      <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Grant Escrow & Tranche Status
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">
              PFMS & Dual-Key State Treasury Disbursal Engine
            </p>
          </div>

          <button
            type="button"
            onClick={() => onInitiateDisbursal?.(proposal)}
            className="px-4 py-2 bg-[#007A61] hover:bg-[#006650] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Release Tranche Payout</span>
          </button>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-3 gap-3 pt-1 border-t border-slate-100">
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Sanctioned Grant</span>
            <div className="text-sm font-black font-mono text-slate-900">
              {formatRupeesINR(totalBudgetRupees)}
            </div>
            <span className="text-[10px] text-slate-500">Proposed DPR Budget</span>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-0.5">
            <span className="text-[10px] font-extrabold text-[#007A61] uppercase">Disbursed So Far</span>
            <div className="text-sm font-black font-mono text-[#007A61]">
              {formatRupeesINR(totalDisbursedRupees)}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold">{disbursalPercentage}% Released</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-0.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase">Pending Balance</span>
            <div className="text-sm font-black font-mono text-slate-900">
              {formatRupeesINR(pendingRupees)}
            </div>
            <span className="text-[10px] text-slate-500">Available to Disburse</span>
          </div>
        </div>
      </div>

      {/* Disbursal Ledger List */}
      <div className="space-y-2">
        <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
          Disbursal Transaction Ledger ({validPayments.length} Transactions)
        </h5>

        {validPayments.length === 0 ? (
          <div className="p-8 bg-white border border-dashed border-slate-200 rounded-2xl text-center space-y-2 shadow-2xs">
            <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="font-extrabold text-slate-800 text-xs">No Grant Tranche Disbursed Yet</div>
            <p className="text-[11px] text-slate-500 max-w-md mx-auto leading-relaxed">
              Full budget of <strong className="text-slate-900 font-mono">{formatRupeesINR(totalBudgetRupees)}</strong> is sanctioned. Click <strong>"Release Tranche Payout"</strong> or <strong>"Approve & Sanction Grant"</strong> to disburse Tranche 1 (e.g. 50% = {formatRupeesINR(Math.round(totalBudgetRupees * 0.5))}) via PFMS.
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-2xs">
            {validPayments.map((p, idx) => {
              const pAmt = p.rawAmount ? formatRupeesINR(p.rawAmount) : (p.amount || p.disbursedAmount || '₹ 0');
              return (
                <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-900 text-xs">{p.id}</span>
                      <span className="px-2 py-0.2 bg-emerald-50 text-[#007A61] border border-emerald-200 rounded text-[9.5px] font-bold">
                        {p.mode || 'Direct PFMS'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">{p.purpose || p.tracking || 'Milestone Tranche Release'}</div>
                    <div className="text-[10px] font-mono text-slate-400">UTR: {p.utr || p.utrNumber || 'JH-PFMS-99281726'}</div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="font-black font-mono text-slate-900 text-sm">{pAmt}</div>
                    <div className="text-[10px] text-emerald-600 font-bold flex items-center justify-end space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Authorized & Credited ✓</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPaymentsTab;
