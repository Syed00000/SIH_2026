import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Landmark, Handshake, ChevronRight, Sparkles } from 'lucide-react';
import { SourceDetailsModal } from './SourceDetailsModal.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

const ICONS = { corporate_csr: Building2, govt_grants: Landmark, joint_funding: Handshake };

const BASE_SOURCES_CONFIG = [
  {
    id: 'corporate_csr',
    title: 'A. Corporate CSR Funds (Sec 135)',
    description: 'Tata Steel CSR (₹5L) + Central Coalfields Limited (₹5L) dedicated innovation corpus.',
    basePoolLakhs: 10.0,
    baseDisbursedLakhs: 1.5,
    activeCount: '2 Corporate Donors',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
    poolColor: 'text-blue-700 bg-blue-50/50',
    topDonors: [
      { name: 'Tata Steel CSR Foundation', committed: '₹ 5.00 Lakhs', sector: 'Clean Water IoT & Sensors', status: 'Active' },
      { name: 'Central Coalfields Limited (CCL)', committed: '₹ 5.00 Lakhs', sector: 'Rural Infrastructure & Energy', status: 'Active' }
    ]
  },
  {
    id: 'govt_grants',
    title: 'B. Government State Grants',
    description: 'Jharkhand State Innovation Council & Higher Education Dept R&D allocation.',
    basePoolLakhs: 5.0,
    baseDisbursedLakhs: 1.2,
    activeCount: '3 State Schemes',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    poolColor: 'text-emerald-700 bg-emerald-50/50',
    topDonors: [
      { name: 'Jharkhand State Innovation Council Grant', committed: '₹ 3.00 Lakhs', sector: 'Grassroots Prototyping', status: 'Active' },
      { name: 'Mukhyamantri Takniki Protsahan Fund', committed: '₹ 2.00 Lakhs', sector: 'HEI Student Incubation', status: 'Active' }
    ]
  },
  {
    id: 'joint_funding',
    title: 'C. Joint Co-Funding (PPP Model)',
    description: 'Matched Corporate-State Escrow Pool for rapid field scale-up and district rollout.',
    basePoolLakhs: 15.0,
    baseDisbursedLakhs: 2.7,
    activeCount: '5 Active Projects',
    iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
    poolColor: 'text-purple-700 bg-purple-50/50',
    topDonors: [
      { name: 'Joint State-Industry Escrow Pool', committed: '₹ 15.00 Lakhs', sector: 'Full District Coverage', status: 'Active' }
    ]
  }
];

export const CSRFundingSources = ({ onFilterBySource, selectedSourceFilter }) => {
  const [selectedSourceData, setSelectedSourceData] = useState(null);
  const [financials, setFinancials] = useState(() => projectCsrSyncService.getFinancials());

  useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe(() => {
      setFinancials(projectCsrSyncService.getFinancials());
    });
    return unsubscribe;
  }, []);

  const sources = useMemo(() => {
    return BASE_SOURCES_CONFIG.map((s) => {
      const pool = s.id === 'joint_funding' ? (financials.totalCorpus / 100000) : s.id === 'govt_grants' ? (financials.govtAllocation / 100000) : (financials.corporateAllocation / 100000);
      return {
        ...s,
        poolAmountLakhs: `₹ ${pool.toFixed(2)} Lakhs`,
        disbursedAmountLakhs: `₹ ${(s.baseDisbursedLakhs).toFixed(2)} Lakhs`
      };
    });
  }, [financials]);

  return (
    <div className="space-y-3 select-none">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>State & Corporate Co-Funding Corpus (Total Pool: ₹ 15.00 Lakhs)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sources.map((source) => {
          const IconComponent = ICONS[source.id] || Building2;
          const isSelected = selectedSourceFilter === source.id;

          return (
            <div
              key={source.id}
              onClick={() => {
                setSelectedSourceData(source);
                onFilterBySource?.(source.id);
              }}
              className={`bg-white rounded-2xl p-5 border shadow-2xs flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group ${
                isSelected ? 'border-blue-600 ring-2 ring-blue-600/20' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 rounded-lg border ${source.iconColor}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                      {source.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 flex items-center space-x-0.5">
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3">{source.description}</p>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-600">Disbursed to HEIs:</span>
                    <span className="text-emerald-700 font-black">{source.disbursedAmountLakhs}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">{source.activeCount}</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-md border text-[11px] ${source.poolColor} border-slate-200/50`}>
                  Corpus: {source.poolAmountLakhs}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <SourceDetailsModal
        isOpen={Boolean(selectedSourceData)}
        onClose={() => setSelectedSourceData(null)}
        sourceData={selectedSourceData}
        displayUnit="lakhs"
      />
    </div>
  );
};

export default CSRFundingSources;
