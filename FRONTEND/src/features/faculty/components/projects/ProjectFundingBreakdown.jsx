import React from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { projectCsrSyncService } from '../../../government/services/projectCsrSyncService.js';

export const ProjectFundingBreakdown = ({ project }) => {
  if (!project.disbursedAmount || project.disbursedAmount === '₹ 0' || project.disbursedAmount === '0') {
    return null;
  }

  const paymentLedger = projectCsrSyncService.getCsrLedger();
  const dbTranches = Array.isArray(project.tranches) ? project.tranches : [];
  let linkedPayments = paymentLedger.filter(
    (pay) => pay.projectRef === project.projectId || pay.projectRef === project.id || pay.projectRef === `PROP-${project.projectId}`
  ).filter((pay) => (Number(pay.rawAmount) > 0) || (pay.amount && pay.amount !== '₹ 0'));

  const allPayments = [...dbTranches, ...linkedPayments];
  const uniquePayments = Array.from(new Map(allPayments.map((item) => [item.id, item])).values());
  linkedPayments = uniquePayments.filter((pay) => (Number(pay.rawAmount) > 0) || (pay.amount && pay.amount !== '₹ 0'));

  const backendDisbursedAmt = parseInt(String(project.disbursedAmount || '0').replace(/[^0-9]/g, ''), 10) || 0;
  const ledgerSum = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);

  if (linkedPayments.length === 0 && backendDisbursedAmt > 0) {
    linkedPayments = [{ id: 'LEGACY-1', rawAmount: backendDisbursedAmt }];
  } else if (backendDisbursedAmt > ledgerSum) {
    linkedPayments.unshift({ id: 'LEGACY-DIFF', rawAmount: backendDisbursedAmt - ledgerSum });
  }

  const totalBudgetVal = parseInt((project.sanctionedBudget || project.budget || project.proposedBudget || '80000').toString().replace(/[^0-9]/g, ''), 10) || 80000;
  const totalDisbursedVal = linkedPayments.reduce((acc, pay) => acc + (Number(pay.rawAmount) || parseInt((pay.amount || '').replace(/[^0-9]/g, ''), 10) || 0), 0);
  const pendingVal = Math.max(0, totalBudgetVal - totalDisbursedVal);

  return (
    <div className="space-y-2 pt-2 border-t border-slate-100 text-left">
      <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
        Funding & Disbursal Breakdown
      </h3>
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-[10.5px] text-slate-600 font-medium px-1">
          <span>Total Sanctioned Grant</span>
          <span className="font-bold text-slate-800">₹ {totalBudgetVal.toLocaleString('en-IN')}</span>
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
          <div className="flex items-center justify-between text-[10.5px] text-amber-900 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200 shadow-2xs">
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Pending Balance</span>
            </div>
            <span className="font-bold">₹ {pendingVal.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectFundingBreakdown;
