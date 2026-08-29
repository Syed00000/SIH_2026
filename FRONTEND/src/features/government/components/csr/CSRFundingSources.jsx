import React, { useState, useEffect } from 'react';
import { Building2, Landmark, Handshake, ChevronRight, Info } from 'lucide-react';
import { SourceDetailsModal } from './SourceDetailsModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

const ICONS = { corporate_csr: Building2, govt_grants: Landmark, joint_funding: Handshake };

export const CSRFundingSources = ({ onFilterBySource, selectedSourceFilter }) => {
  const [selectedSourceData, setSelectedSourceData] = useState(null);
  const [financials, setFinancials] = useState(() => projectCsrSyncService.getFinancials());

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe(() => {
      setFinancials(projectCsrSyncService.getFinancials());
    });
    return unsubscribe;
  }, []);

  const sourcesConfig = [
    {
      id: 'corporate_csr',
      title: 'A. Corporate CSR Funds (Sec 135)',
      description: 'Dedicated industry CSR innovation corpus for university problem-solving.',

      activeCount: 'Corporate Partnerships',
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
      poolColor: 'text-blue-700 bg-blue-50/50',
      topDonors: []
    },
    {
      id: 'govt_grants',
      title: 'B. Government State Grants',
      description: 'Jharkhand State Innovation Council & Higher Education Dept R&D allocation.',

      activeCount: 'State R&D Pool',
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      poolColor: 'text-emerald-700 bg-emerald-50/50',
      topDonors: []
    },
    {
      id: 'joint_funding',
      title: 'C. Joint Co-Funding (PPP Model)',
      description: 'Matched Corporate-State Escrow Pool for rapid field scale-up and district rollout.',

      activeCount: 'Active PPP Nodes',
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      poolColor: 'text-purple-700 bg-purple-50/50',
      topDonors: []
    }
  ];

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wider uppercase">
              1. CSR & STATE INNOVATION FUNDING SOURCES
            </h3>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Available Innovation Corpus: <strong className="text-slate-900">₹ {(financials.availableCorpus / 100000).toFixed(2)} Lakhs</strong>
            </p>
          </div>

          {selectedSourceFilter && selectedSourceFilter !== 'All Sources' && (
            <button
              onClick={() => onFilterBySource?.('All Sources')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer self-start sm:self-auto"
            >
              Clear Filter ({selectedSourceFilter})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {sourcesConfig.map((src) => {
            const Icon = ICONS[src.id] || Building2;
            const isSelected = selectedSourceFilter?.includes(src.id) || selectedSourceFilter === src.title;

            return (
              <div
                key={src.id}
                onClick={() => onFilterBySource?.(src.title)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg border ${src.iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{src.title}</h4>
                      <span className="text-[10px] text-slate-400 font-medium">{src.activeCount}</span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">{src.description}</p>


              </div>
            );
          })}
        </div>
      </div>

      {selectedSourceData && (
        <SourceDetailsModal
          isOpen={!!selectedSourceData}
          onClose={() => setSelectedSourceData(null)}
          sourceData={selectedSourceData}
        />
      )}
    </>
  );
};

export default CSRFundingSources;
