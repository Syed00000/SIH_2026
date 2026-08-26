import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, Timer } from 'lucide-react';

const STATUTORY_KPI_CARDS = [
  {
    id: 'verified',
    label: 'TOTAL VERIFIED PROPOSALS',
    value: '38',
    supportingText: 'Applications Cleared',
    valueColor: 'text-slate-900',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600 bg-emerald-50/80 border-emerald-100'
  },
  {
    id: 'pending',
    label: 'PENDING COMPLIANCE AUDIT',
    value: '04',
    supportingText: 'Under Active Review',
    valueColor: 'text-amber-600',
    icon: Clock,
    iconColor: 'text-amber-600 bg-amber-50/80 border-amber-100'
  },
  {
    id: 'rejected',
    label: 'REJECTED SUBMISSIONS',
    value: '02',
    supportingText: 'Invalid CSR-1 Filings',
    valueColor: 'text-red-600',
    icon: AlertTriangle,
    iconColor: 'text-red-600 bg-red-50/80 border-red-100'
  },
  {
    id: 'avg_time',
    label: 'AVERAGE APPROVAL TIME',
    value: '4.2',
    supportingText: 'Business Days',
    valueColor: 'text-blue-600',
    icon: Timer,
    iconColor: 'text-blue-600 bg-blue-50/80 border-blue-100'
  }
];

export const CSRStatutoryParameters = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
      <h3 className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">
        STATUTORY VERIFICATION PARAMETERS (PHASE 1 & 2)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {STATUTORY_KPI_CARDS.map((card) => {
          const IconComponent = card.icon;
          return (
            <div
              key={card.id}
              className="bg-slate-50/60 border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:bg-slate-50/90 transition-all flex items-center justify-between"
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
