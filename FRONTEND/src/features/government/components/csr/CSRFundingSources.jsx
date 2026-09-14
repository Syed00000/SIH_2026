import React, { useState, useEffect } from 'react';
import { SourceDetailsModal } from './SourceDetailsModal.jsx';
import { AddStateGrantModal } from './AddStateGrantModal.jsx';
import { EditStateGrantModal } from './EditStateGrantModal.jsx';
import { CSRSourceSummaryCards } from './CSRSourceSummaryCards.jsx';
import { AllocatedGrantsLedgerTable } from './AllocatedGrantsLedgerTable.jsx';
import apiClient from '../../../../infrastructure/api/client.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const CSRFundingSources = ({ onFilterBySource, selectedSourceFilter }) => {
  const [selectedSourceData, setSelectedSourceData] = useState(null);
  const [isAddGrantModalOpen, setIsAddGrantModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [fundsData, setFundsData] = useState({
    stateGrantsTotal: 0,
    totalCommittedInflows: 0,
    totalAllocatedToDepts: 0,
    corporateCsrTotal: 0,
    corporateCsrTotalCr: 0,
    totalJointCorpus: 0,
    fundEntries: [],
    inflowEntries: []
  });

  const fetchLiveFunds = async () => {
    try {
      const res = await apiClient.get('government/funds');
      const data = res?.data?.data || res?.data || {};
      setFundsData({
        stateGrantsTotal: data.stateGrantsTotal || 0,
        totalCommittedInflows: data.totalCommittedInflows || 0,
        totalAllocatedToDepts: data.totalAllocatedToDepts || 0,
        corporateCsrTotal: data.corporateCsrTotal || 0,
        corporateCsrTotalCr: data.corporateCsrTotalCr || 0,
        totalJointCorpus: data.totalJointCorpus || 0,
        fundEntries: data.fundEntries || [],
        inflowEntries: data.inflowEntries || []
      });
    } catch (err) {
      console.warn('Failed to load government funds:', err);
    }
  };

  const [financials, setFinancials] = useState(() => projectCsrSyncService.getFinancials());

  useEffect(() => {
    fetchLiveFunds();
    const unsub = projectCsrSyncService.subscribe(() => {
      fetchLiveFunds();
      setFinancials(projectCsrSyncService.getFinancials());
    });
    const interval = setInterval(fetchLiveFunds, 4000);
    return () => { clearInterval(interval); unsub(); };
  }, []);

  const handleFundChange = () => {
    fetchLiveFunds();
    projectCsrSyncService.initializeFromBackend();
  };

  const formatAmountINR = (val) => `₹ ${(Number(val) || 0).toLocaleString('en-IN')}`;
  const formatLakhsCrSubtitle = (val) => {
    const n = Number(val) || 0;
    if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Crores`;
    if (n >= 100000) return `₹ ${(n / 100000).toFixed(2)} Lakhs`;
    return n > 0 ? `₹ ${(n / 1000).toFixed(1)} K` : '₹ 0.00';
  };

  const stateCommitted = Number(fundsData.totalCommittedInflows) || 0;
  const stateAllocatedToDepts = Number(fundsData.totalAllocatedToDepts) || 0;
  const stateAvailablePool = Math.max(0, stateCommitted - stateAllocatedToDepts);

  const sourcesConfig = [
    {
      id: 'corporate_csr',
      title: 'Corporate CSR Funds (Sec 135)',
      description: 'Dedicated industry CSR innovation corpus for university problem-solving.',
      tag: 'Industry Committed',
      amount: fundsData.corporateCsrTotal || 0,
      amountFormatted: formatAmountINR(fundsData.corporateCsrTotal || 0),
      amountSub: formatLakhsCrSubtitle(fundsData.corporateCsrTotal || 0),
      iconColor: 'text-[#007A61] bg-emerald-50 border-emerald-100',
      badgeColor: 'text-[#007A61] bg-emerald-50 border-emerald-200',
      canAdd: false
    },
    {
      id: 'govt_grants',
      title: 'Government State Grants',
      description: 'Jharkhand State Innovation Council & Higher Education Dept R&D allocation.',
      tag: `${fundsData.inflowEntries?.length || 0} Treasury Inflows`,
      amount: stateAllocatedToDepts > 0 ? stateAvailablePool : stateCommitted,
      amountFormatted: formatAmountINR(stateAllocatedToDepts > 0 ? stateAvailablePool : stateCommitted),
      amountSub: formatLakhsCrSubtitle(stateAllocatedToDepts > 0 ? stateAvailablePool : stateCommitted),
      allocatedFormatted: formatAmountINR(stateCommitted),
      disbursedFormatted: formatAmountINR(stateAllocatedToDepts),
      hasDisbursed: stateAllocatedToDepts > 0,
      iconColor: 'text-[#007A61] bg-emerald-50 border-emerald-100',
      badgeColor: 'text-[#007A61] bg-emerald-50 border-emerald-200',
      canAdd: true,
      isLowFund: false
    },
    {
      id: 'joint_funding',
      title: 'Joint Co-Funding (PPP Model)',
      description: 'Matched Corporate-State Escrow Pool for rapid field scale-up and district rollout.',
      tag: 'Total Combined Corpus',
      amount: 0,
      amountFormatted: '₹ 0',
      amountSub: '₹ 0.00',
      allocatedFormatted: '₹ 0',
      disbursedFormatted: '₹ 0',
      hasDisbursed: false,
      iconColor: 'text-slate-700 bg-slate-100 border-slate-200',
      badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
      canAdd: false
    }
  ];

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-5 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#007A61] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Jharkhand Innovation Pool
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 tracking-tight mt-1">
              CSR & STATE INNOVATION CORPUS MANAGEMENT
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live Combined Innovation Pool:{' '}
              <strong className="text-slate-900 font-black text-sm">
                {formatLakhsCrSubtitle(stateAvailablePool + (Number(fundsData.corporateCsrTotal) || 0))}
              </strong>{' '}
              <span className="text-[11px] text-slate-400">
                (State Treasury Pool: {formatLakhsCrSubtitle(stateAvailablePool)} + Corporate CSR: {formatLakhsCrSubtitle(fundsData.corporateCsrTotal || 0)})
              </span>
            </p>
          </div>

          {selectedSourceFilter && selectedSourceFilter !== 'All Sources' && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onFilterBySource?.('All Sources')}
                className="text-xs font-bold text-[#007A61] hover:underline cursor-pointer self-start sm:self-auto"
              >
                Clear Filter ({selectedSourceFilter})
              </button>
            </div>
          )}
        </div>

        <CSRSourceSummaryCards
          sourcesConfig={sourcesConfig}
          selectedSourceFilter={selectedSourceFilter}
          onFilterBySource={onFilterBySource}
          onOpenAddModal={() => setIsAddGrantModalOpen(true)}
        />

        <AllocatedGrantsLedgerTable
          fundEntries={fundsData.inflowEntries?.length > 0 ? fundsData.inflowEntries : fundsData.fundEntries}
          formatLakhsCrSubtitle={formatLakhsCrSubtitle}
          onOpenAddModal={() => setIsAddGrantModalOpen(true)}
          onEditFund={(f) => setEditingFund(f)}
        />
      </div>

      {selectedSourceData && (
        <SourceDetailsModal isOpen={!!selectedSourceData} onClose={() => setSelectedSourceData(null)} sourceData={selectedSourceData} />
      )}
      {isAddGrantModalOpen && (
        <AddStateGrantModal isOpen={isAddGrantModalOpen} onClose={() => setIsAddGrantModalOpen(false)} onFundAdded={handleFundChange} />
      )}
      {editingFund && (
        <EditStateGrantModal isOpen={!!editingFund} fund={editingFund} onClose={() => setEditingFund(null)} onFundUpdated={handleFundChange} onFundDeleted={handleFundChange} />
      )}
    </>
  );
};

export default CSRFundingSources;
