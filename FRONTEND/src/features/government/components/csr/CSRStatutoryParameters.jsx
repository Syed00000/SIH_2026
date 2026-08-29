import React from 'react';
import { CheckCircle2, Clock, Timer, XCircle } from 'lucide-react';

export const CSRStatutoryParameters = ({ activeFilter, onSelectFilter, proposals = [] }) => {
  const verifiedCount = proposals.filter((p) => p.dueDiligenceStatus === 'passed').length;
  const pendingCount = proposals.filter((p) => p.dueDiligenceStatus === 'review').length;
  const rejectedCount = proposals.filter(
    (p) =>
      p.dueDiligenceStatus === 'failed' ||
      p.dueDiligence?.includes('Failed') ||
      p.dueDiligence?.includes('Rejected') ||
      p.dueDiligence?.includes('Disqualified') ||
      p.boardApproval?.includes('Rejected')
  ).length;

  const cards = [
    {
      id: 'verified',
      label: 'Verified & Compliant',
      value: `${verifiedCount} Proposals`,
      valueColor: 'text-slate-900',
      supportingText: 'Passed Due Diligence & 80G Checks',
      icon: CheckCircle2
    },
    {
      id: 'pending',
      label: 'In Review & Scrutiny',
      value: `${pendingCount} Proposals`,
      valueColor: 'text-slate-900',
      supportingText: 'Committee & MCA CSR-1 Pending',
      icon: Clock
    },
    {
      id: 'rejected',
      label: 'Disqualified / Rejected',
      value: `${rejectedCount} Proposals`,
      valueColor: 'text-slate-900',
      supportingText: 'Failed DPR Review / Non-Compliant',
      icon: XCircle
    },
    {
      id: 'turnaround',
      label: 'Avg. Decision SLA',
      value: '4.2 Days',
      valueColor: 'text-slate-900',
      supportingText: 'Submission to Sanction Time',
      icon: Timer
    }
  ];

  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-900 tracking-wider uppercase">
          STATUTORY VERIFICATION PARAMETERS
        </h3>
        {activeFilter && (
          <button
            onClick={() => onSelectFilter?.(null)}
            className="text-[11px] font-semibold text-slate-900 hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => {
          const IconComponent = card.icon;
          const isSelected = activeFilter === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectFilter?.(isSelected ? null : card.id)}
              className={`rounded-lg p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-slate-50 border-slate-900 ring-1 ring-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
              }`}
            >
              <div className="space-y-0.5">
                <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`text-base sm:text-lg font-bold tracking-tight ${card.valueColor}`}>
                  {card.value}
                </div>
                <p className="text-[11px] text-slate-500 font-normal pt-0.5 leading-tight">
                  {card.supportingText}
                </p>
              </div>

              {/* Clean Monochrome Black Icon */}
              <IconComponent className="w-4 h-4 shrink-0 ml-3 text-slate-900" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSRStatutoryParameters;
