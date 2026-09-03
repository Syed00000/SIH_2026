import React from 'react';
import { Layers, Sparkles } from 'lucide-react';

export const ProposalBudgetTab = ({ proposal, linkedProject }) => {
  const budgetBreakdown =
    Array.isArray(proposal?.budgetBreakdown) && proposal.budgetBreakdown.length > 0
      ? proposal.budgetBreakdown
      : Array.isArray(linkedProject?.budgetBreakdown) && linkedProject.budgetBreakdown.length > 0
      ? linkedProject.budgetBreakdown
      : [
          { category: 'Field Telemetry Sensors & IoT Probes', amount: '₹ 35,000' },
          { category: 'Lab Fabrication & PCB Prototyping', amount: '₹ 20,000' },
          { category: 'District Field Trials & Ground Calibration', amount: '₹ 12,000' },
          { category: 'Student Fellowship & Project Overhead', amount: '₹ 8,000' }
        ];

  const totalSum = budgetBreakdown.reduce((sum, item) => sum + (typeof item.amount === 'number' ? item.amount : Number(String(item.amount || '0').replace(/[^\d]/g, '')) || 0), 0);
  const totalAmount = totalSum > 0 ? `₹ ${totalSum.toLocaleString('en-IN')}` : (proposal.fundingRequested || proposal.allocatedAmount || linkedProject?.proposedBudget || '₹ 75,000');
  const extraVal = totalSum > 0 ? Math.max(0, totalSum - 80000) : (Number(proposal.additionalAmount || linkedProject?.additionalAmount) || 0);

  return (
    <div className="space-y-4 text-xs select-none">
      {/* Supplemental Faculty Grant Card */}
      {extraVal > 0 && (
        <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-amber-950">
                Additional Allocation Added by Faculty Investigator
              </h4>
              <p className="text-[11px] text-amber-800">
                University approved +₹ {extraVal.toLocaleString('en-IN')} supplemental funding included in this revised DPR grant.
              </p>
            </div>
          </div>
          <span className="font-mono font-black text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300 shrink-0 text-xs">
            +₹ {extraVal.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      <div className="p-4 bg-white rounded-xl border border-slate-200/90 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#007A61]" />
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Itemized Line-Item Budget Allocation
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
              Total Proposed DPR Grant
            </span>
            <span className="text-base font-black font-mono text-[#007A61]">
              {totalAmount}
            </span>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          {budgetBreakdown.map((item, idx) => (
            <div
              key={idx}
              className="p-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors text-xs"
            >
              <div className="flex items-center space-x-3 min-w-0 pr-4">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-[#007A61] border border-emerald-200 font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                  #{idx + 1}
                </span>
                <span className="font-semibold text-slate-800 text-xs truncate">
                  {item.category || item.title || 'Custom Line Item'}
                </span>
              </div>
              <span className="font-mono font-black text-slate-900 text-xs shrink-0">
                {typeof item.amount === 'number'
                  ? `₹ ${item.amount.toLocaleString('en-IN')}`
                  : item.amount || '₹ 10,000'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProposalBudgetTab;
