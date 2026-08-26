import React from 'react';
import { Landmark, FileCheck, KeyRound } from 'lucide-react';

const ESCROW_KPI_CARDS = [
  {
    id: 'escrow_accounts',
    label: 'ACTIVE ESCROW ACCOUNTS',
    value: '12',
    supportingText: 'Dedicated SBI/BOI Vaults',
    valueColor: 'text-slate-900',
    icon: Landmark,
    iconColor: 'text-slate-600 bg-slate-100/80 border-slate-200/80'
  },
  {
    id: 'tds_withholding',
    label: 'TDS WITHHOLDING',
    value: 'ACTIVE',
    supportingText: '194C @ 2% · 194J @ 10%',
    valueColor: 'text-emerald-600',
    icon: FileCheck,
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100'
  },
  {
    id: 'maker_checker',
    label: 'MAKER-CHECKER',
    value: 'ENFORCED',
    supportingText: 'Dual-Key Authentication',
    valueColor: 'text-blue-600',
    icon: KeyRound,
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100'
  }
];

export const CSREscrowMatrix = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
      <h3 className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">
        ESCROW ACCOUNT LOCK-IN & TAX COMPLIANCE MATRIX
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {ESCROW_KPI_CARDS.map((card) => {
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

export default CSREscrowMatrix;
