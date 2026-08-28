import React, { useState } from 'react';
import { Landmark, FileCheck, KeyRound, ChevronRight } from 'lucide-react';
import { EscrowVaultsModal } from './EscrowVaultsModal.jsx';
import { TdsComplianceModal } from './TdsComplianceModal.jsx';

const ESCROW_CARDS = [
  { id: 'escrow_vaults', label: 'Escrow Vault Status', value: 'Active Vaults', supportingText: 'SBI & PNB nodal vaults locked', color: 'text-slate-900', icon: Landmark, iconColor: 'text-slate-600 bg-slate-100 border-slate-200' },
  { id: 'tds_withholding', label: 'TDS & Tax Exemption', value: '100% Tax Free', supportingText: 'Sec 80G & MCA Schedule VII locked', color: 'text-emerald-700', icon: FileCheck, iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
  { id: 'maker_checker', label: 'Two-Man Treasury Key', value: '2-Signatory Lock', supportingText: 'Nodal Officer + Finance Dept verify', color: 'text-blue-700', icon: KeyRound, iconColor: 'text-blue-600 bg-blue-50 border-blue-100' }
];

export const CSREscrowMatrix = ({ onFilterLedgerByStatus }) => {
  const [isVaultsModalOpen, setIsVaultsModalOpen] = useState(false);
  const [isTdsModalOpen, setIsTdsModalOpen] = useState(false);

  const handleCardClick = (id) => {
    if (id === 'escrow_vaults') setIsVaultsModalOpen(true);
    else if (id === 'tds_withholding') setIsTdsModalOpen(true);
    else if (id === 'maker_checker') onFilterLedgerByStatus?.('pending');
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5 select-none">
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-slate-800 tracking-wider uppercase">
            ESCROW ACCOUNT LOCK-IN & TAX COMPLIANCE MATRIX
          </h3>
          <span className="text-[10.5px] font-bold text-slate-400">Click cards to inspect vaults & TDS rules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {ESCROW_CARDS.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="bg-slate-50/60 border border-slate-200/90 rounded-xl p-4 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                    {card.label}
                  </span>
                  <div className={`text-xl sm:text-2xl font-black tracking-tight ${card.color}`}>
                    {card.value}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium pt-0.5">{card.supportingText}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-3">
                  <div className={`p-2.5 rounded-xl border ${card.iconColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EscrowVaultsModal isOpen={isVaultsModalOpen} onClose={() => setIsVaultsModalOpen(false)} />
      <TdsComplianceModal isOpen={isTdsModalOpen} onClose={() => setIsTdsModalOpen(false)} />
    </>
  );
};

export default CSREscrowMatrix;
