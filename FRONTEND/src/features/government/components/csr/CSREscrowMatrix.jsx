import React, { useState, useEffect } from 'react';
import { Landmark, FileCheck, KeyRound, ChevronRight } from 'lucide-react';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { EscrowVaultsModal } from './EscrowVaultsModal.jsx';
import { TdsComplianceModal } from './TdsComplianceModal.jsx';

export const CSREscrowMatrix = ({ onFilterLedgerByStatus }) => {
  const [isVaultsModalOpen, setIsVaultsModalOpen] = useState(false);
  const [isTdsModalOpen, setIsTdsModalOpen] = useState(false);
  const [projects, setProjects] = useState(() => projectCsrSyncService.getActiveProjects());
  const [financials, setFinancials] = useState(() => projectCsrSyncService.getFinancials());

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe(() => {
      setProjects(projectCsrSyncService.getActiveProjects());
      setFinancials(projectCsrSyncService.getFinancials());
    });
    return unsubscribe;
  }, []);

  const totalDisbursedLakhs = financials.totalDisbursed;
  const totalCorpusLakhs = financials.totalCorpus;
  const disbursedPct = totalCorpusLakhs > 0 
    ? ((totalDisbursedLakhs / totalCorpusLakhs) * 100).toFixed(1)
    : '0.0';

  const cards = [
    {
      id: 'escrow_vaults',
      label: 'ACTIVE ESCROW ACCOUNTS',
      value: String(projects.length),
      valueColor: 'text-slate-900',
      supportingText: `DISBURSED: ${disbursedPct}% | READY: 100%`,
      icon: Landmark,
      iconColor: 'bg-slate-50 text-slate-700 border-slate-200'
    },
    {
      id: 'tds_withholding',
      label: 'TDS WITHHOLDING',
      value: 'Active',
      valueColor: 'text-slate-900',
      supportingText: '194C @ 2% | 194J @ 10%',
      icon: FileCheck,
      iconColor: 'bg-slate-50 text-slate-700 border-slate-200'
    },
    {
      id: 'maker_checker',
      label: 'MAKER-CHECKER',
      value: 'Enforced',
      valueColor: 'text-slate-900',
      supportingText: 'Dual-Key Authorization',
      icon: KeyRound,
      iconColor: 'bg-slate-50 text-slate-700 border-slate-200'
    }
  ];

  const handleCardClick = (id) => {
    if (id === 'escrow_vaults') {
      setIsVaultsModalOpen(true);
    } else if (id === 'tds_withholding') {
      setIsTdsModalOpen(true);
    } else if (id === 'maker_checker') {
      onFilterLedgerByStatus?.('pending');
    }
  };

  return (
    <>
      <div className="bg-white rounded-md p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 w-full">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 tracking-wider uppercase">
            ESCROW ACCOUNT LOCK-IN & TAX COMPLIANCE MATRIX
          </h3>
          <span className="text-[11px] font-medium text-slate-400">
            Click cards to inspect vaults & TDS rules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => {
            const IconComponent = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="bg-white border border-slate-200 rounded-md p-4 hover:border-slate-300 hover:shadow-xs shadow-3xs transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="space-y-0.5">
                  <span className="block text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
                    {card.label}
                  </span>
                  <div className={`text-xl sm:text-2xl font-black tracking-tight ${card.valueColor}`}>
                    {card.value}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium pt-0.5 leading-tight">
                    {card.supportingText}
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0 ml-3">
                  <div className={`p-2 rounded-md border ${card.iconColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EscrowVaultsModal
        isOpen={isVaultsModalOpen}
        onClose={() => setIsVaultsModalOpen(false)}
      />

      <TdsComplianceModal
        isOpen={isTdsModalOpen}
        onClose={() => setIsTdsModalOpen(false)}
      />
    </>
  );
};

export default CSREscrowMatrix;
