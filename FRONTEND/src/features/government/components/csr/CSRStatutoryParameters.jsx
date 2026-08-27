import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Timer, XCircle } from 'lucide-react';

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
      valueColor: 'text-emerald-950',
      supportingText: 'Passed Due Diligence & 80G Checks',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'pending',
      label: 'In Review & Scrutiny',
      value: `${pendingCount} Proposals`,
      valueColor: 'text-amber-950',
      supportingText: 'Committee & MCA CSR-1 Pending',
      icon: Clock,
      iconColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'rejected',
      label: 'Disqualified / Rejected',
      value: `${rejectedCount} Proposals`,
      valueColor: 'text-rose-950',
      supportingText: 'Failed DPR Review / Non-Compliant',
      icon: XCircle,
      iconColor: 'bg-rose-50 text-rose-700 border-rose-200'
    },
    {
      id: 'turnaround',
      label: 'Avg. Decision SLA',
      value: '4.2 Days',
      valueColor: 'text-blue-950',
      supportingText: 'Submission to Sanction Time',
      icon: Timer,
      iconColor: 'bg-blue-50 text-blue-700 border-blue-200'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">
          STATUTORY VERIFICATION PARAMETERS (PHASE 1 & 2)
        </h3>
        {activeFilter && (
          <button
            onClick={() => onSelectFilter?.(null)}
            className="text-[10.5px] font-bold text-blue-600 hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card) => {
          const IconComponent = card.icon;
          const isSelected = activeFilter === card.id;

          return (
            <div
              key={card.id}
              onClick={() => onSelectFilter?.(isSelected ? null : card.id)}
              className={`rounded-xl p-4 border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div className="space-y-0.5">
                <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`text-xl sm:text-2xl font-black tracking-tight ${card.valueColor}`}>
                  {card.value}
                </div>
                <p className="text-[11px] text-slate-500 font-medium pt-0.5">
                  {card.supportingText}
                </p>
              </div>

              <div className={`p-2.5 rounded-xl border shrink-0 ml-3 ${card.iconColor}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CSRStatutoryParameters;
