import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { projectCsrSyncService } from '../../../government/services/projectCsrSyncService.js';

export const ProjectFundingBreakdown = ({ project: p }) => {
  if (!p.disbursedAmount || p.disbursedAmount === '₹ 0' || p.disbursedAmount === '0') {
    return null;
  }

  const paymentLedger = projectCsrSyncService.getCsrLedger();
  const dbTranches = Array.isArray(p.tranches) ? p.tranches : [];
  let linkedPayments = paymentLedger.filter(
    (pay) => pay.projectRef === p.projectId || pay.projectRef === p.id || pay.projectRef === `PROP-${p.projectId}`
  ).filter((pay) => (Number(pay.rawAmount) > 0) || (pay.amount && pay.amount !== '₹ 0'));

  const allPayments = [...dbTranches, ...linkedPayments];
  const uniquePayments = Array.from(new Map(allPayments.map((item) => [item.id, item])).values());
  linkedPayments = uniquePayments.filter((pay) => (Number(pay.rawAmount) > 0) || (pay.amount && pay.amount !== '₹ 0'));

  const backendDisbursedAmt = parseInt(String(p.disbursedAmount || '0').replace(/[^0-9]/g, ''), 10) || 0;
  const ledgerSum = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);

  if (linkedPayments.length === 0 && backendDisbursedAmt > 0) {
    linkedPayments = [{ id: 'LEGACY-1', rawAmount: backendDisbursedAmt }];
  } else if (backendDisbursedAmt > ledgerSum) {
    linkedPayments.unshift({ id: 'LEGACY-DIFF', rawAmount: backendDisbursedAmt - ledgerSum });
  }

  if (linkedPayments.length === 0) {
    return (
      <div className="text-center py-2 text-[10.5px] text-slate-500 italic">
        No transaction ledger records found.
      </div>
    );
  }

  const totalBudgetVal = parseInt((p.sanctionedBudget || p.proposedBudget || '73000').replace(/[^0-9]/g, ''), 10) || 73000;
  const totalDisbursedVal = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);
  const pendingVal = Math.max(0, totalBudgetVal - totalDisbursedVal);
  const utilizedVal = Math.round(totalDisbursedVal * 0.78);

  return (
    <div className="mt-3 space-y-1.5 pt-3 border-t border-slate-200/60">
      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
        Funding & Disbursal Breakdown
      </div>

      <div className="flex items-center justify-between text-[10.5px] text-slate-600 font-medium px-1 mb-1">
        <span>Total Sanctioned Grant</span>
        <span className="font-bold text-slate-800">₹ {totalBudgetVal.toLocaleString('en-IN')}</span>
      </div>

      <div className="flex items-center justify-between text-[10.5px] text-[#007A61] font-medium px-1 mb-1">
        <span>Total Amount Received</span>
        <span className="font-bold">₹ {totalDisbursedVal.toLocaleString('en-IN')}</span>
      </div>

      <div className="flex items-center justify-between text-[10.5px] text-blue-700 font-medium px-1 mb-2">
        <span>Total Amount Utilized (Approx)</span>
        <span className="font-bold">₹ {utilizedVal.toLocaleString('en-IN')}</span>
      </div>

      {linkedPayments.map((pay, idx) => (
        <div key={pay.id || idx} className="flex items-center justify-between text-[10.5px] text-emerald-800 font-medium bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60 shadow-2xs">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#007A61]" />
            <span>Tranche {idx + 1} (Received)</span>
          </div>
          <span className="font-bold">₹ {(Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0).toLocaleString('en-IN')}</span>
        </div>
      ))}

      {pendingVal > 0 && (
        <div className="flex items-center justify-between text-[10.5px] text-amber-800 font-medium bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 shadow-2xs">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Pending Balance</span>
          </div>
          <span className="font-bold">₹ {pendingVal.toLocaleString('en-IN')}</span>
        </div>
      )}
    </div>
  );
};

export default ProjectFundingBreakdown;
