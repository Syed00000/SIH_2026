import React, { useState, useEffect } from 'react';
import {
  Building2,
  Landmark,
  Handshake,
  ChevronRight,
  Info,
  Plus,
  Sparkles,
  Edit3,
  Trash2,
  Calendar,
  FileCheck2,
  CheckCircle2
} from 'lucide-react';
import { SourceDetailsModal } from './SourceDetailsModal.jsx';
import { AddStateGrantModal } from './AddStateGrantModal.jsx';
import { EditStateGrantModal } from './EditStateGrantModal.jsx';
import apiClient from '../../../../infrastructure/api/client.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

const ICONS = { corporate_csr: Building2, govt_grants: Landmark, joint_funding: Handshake };

export const CSRFundingSources = ({ onFilterBySource, selectedSourceFilter }) => {
  const [selectedSourceData, setSelectedSourceData] = useState(null);
  const [isAddGrantModalOpen, setIsAddGrantModalOpen] = useState(false);
  const [editingFund, setEditingFund] = useState(null);
  const [fundsData, setFundsData] = useState({
    stateGrantsTotal: 0,
    corporateCsrTotal: 0,
    corporateCsrTotalCr: 0,
    totalJointCorpus: 0,
    fundEntries: []
  });

  const fetchLiveFunds = async () => {
    try {
      const res = await apiClient.get('government/funds');
      const data = res?.data?.data || res?.data || {};
      setFundsData({
        stateGrantsTotal: data.stateGrantsTotal || 0,
        corporateCsrTotal: data.corporateCsrTotal || 0,
        corporateCsrTotalCr: data.corporateCsrTotalCr || 0,
        totalJointCorpus: data.totalJointCorpus || 0,
        fundEntries: data.fundEntries || []
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
    return () => {
      clearInterval(interval);
      unsub();
    };
  }, []);

  const handleFundChange = () => {
    fetchLiveFunds();
    projectCsrSyncService.initializeFromBackend();
  };

  const formatAmountINR = (val) => {
    const n = Number(val) || 0;
    return `₹ ${n.toLocaleString('en-IN')}`;
  };

  const formatLakhsCrSubtitle = (val) => {
    const n = Number(val) || 0;
    if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Crores`;
    if (n >= 100000) return `₹ ${(n / 100000).toFixed(2)} Lakhs`;
    if (n > 0) return `₹ ${(n / 1000).toFixed(1)} K`;
    return '₹ 0.00';
  };

  const fin = financials;
  const totalDisbursed = fin.totalDisbursed || 0;
  const remainingStateGrants = Math.max(0, (fundsData.stateGrantsTotal || 0) - totalDisbursed);
  const remainingTotalCorpus = Math.max(0, (fundsData.totalJointCorpus || 0) - totalDisbursed);

  const sourcesConfig = [
    {
      id: 'corporate_csr',
      title: 'Corporate CSR Funds (Sec 135)',
      description: 'Dedicated industry CSR innovation corpus for university problem-solving.',
      tag: 'Industry Committed',
      amount: fundsData.corporateCsrTotal,
      amountFormatted: formatAmountINR(fundsData.corporateCsrTotal),
      amountSub: formatLakhsCrSubtitle(fundsData.corporateCsrTotal),
      iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
      badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
      canAdd: false
    },
    {
      id: 'govt_grants',
      title: 'Government State Grants',
      description: remainingStateGrants <= 0
        ? '⚠️ State grant pool has ₹ 0. Please add funds before granting to universities.'
        : 'Jharkhand State Innovation Council & Higher Education Dept R&D allocation.',
      tag: remainingStateGrants <= 0 ? '⚠️ Low Budget Pool' : `${fundsData.fundEntries.length} Active Allocations`,
      amount: remainingStateGrants,
      amountFormatted: formatAmountINR(remainingStateGrants),
      amountSub: formatLakhsCrSubtitle(remainingStateGrants),
      allocatedFormatted: formatAmountINR(fundsData.stateGrantsTotal),
      disbursedFormatted: formatAmountINR(totalDisbursed),
      hasDisbursed: totalDisbursed > 0,
      iconColor: remainingStateGrants <= 0 ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-emerald-600 bg-emerald-50 border-emerald-100',
      badgeColor: remainingStateGrants <= 0 ? 'text-rose-700 bg-rose-100 border-rose-300 font-black animate-pulse' : 'text-[#007A61] bg-emerald-50 border-emerald-200',
      canAdd: true,
      isLowFund: remainingStateGrants <= 0
    },
    {
      id: 'joint_funding',
      title: 'Joint Co-Funding (PPP Model)',
      description: 'Matched Corporate-State Escrow Pool for rapid field scale-up and district rollout.',
      tag: 'Total Combined Corpus',
      amount: remainingTotalCorpus,
      amountFormatted: formatAmountINR(remainingTotalCorpus),
      amountSub: formatLakhsCrSubtitle(remainingTotalCorpus),
      allocatedFormatted: formatAmountINR(fundsData.totalJointCorpus),
      disbursedFormatted: formatAmountINR(totalDisbursed),
      hasDisbursed: totalDisbursed > 0,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
      badgeColor: 'text-purple-700 bg-purple-50 border-purple-200',
      canAdd: false
    }
  ];

  return (
    <>
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-5 select-none">
        {/* Top Header */}
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
                {formatLakhsCrSubtitle(fundsData.totalJointCorpus)}
              </strong>{' '}
              <span className="text-[11px] text-slate-400">
                (State R&D Grants: {formatLakhsCrSubtitle(fundsData.stateGrantsTotal)} + Corporate CSR: {formatLakhsCrSubtitle(fundsData.corporateCsrTotal)})
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAddGrantModalOpen(true)}
              className="px-4 py-2 bg-[#007A61] hover:bg-[#006650] text-white text-xs font-extrabold rounded-xl flex items-center space-x-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Allocate State Grant Fund</span>
            </button>

            {selectedSourceFilter && selectedSourceFilter !== 'All Sources' && (
              <button
                onClick={() => onFilterBySource?.('All Sources')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer self-start sm:self-auto"
              >
                Clear Filter ({selectedSourceFilter})
              </button>
            )}
          </div>
        </div>

        {/* 3 Main Fund Cards with Large Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sourcesConfig.map((src) => {
            const Icon = ICONS[src.id] || Building2;
            const isSelected = selectedSourceFilter?.includes(src.id) || selectedSourceFilter === src.title;

            return (
              <div
                key={src.id}
                onClick={() => onFilterBySource?.(src.title)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 relative overflow-hidden group ${
                  isSelected
                    ? 'border-[#007A61] bg-emerald-50/40 shadow-xs ring-1 ring-[#007A61]'
                    : 'bg-slate-50/60 border-slate-200/90 hover:bg-white hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Card Top */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2.5 rounded-xl border ${src.iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">{src.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border mt-0.5 inline-block ${src.badgeColor}`}>
                        {src.tag}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Big Number Section */}
                <div className={`p-3.5 bg-white rounded-xl space-y-1 border ${src.isLowFund ? 'border-rose-300 bg-rose-50/40 ring-2 ring-rose-200' : 'border-slate-200/90'}`}>
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {src.hasDisbursed ? 'Remaining Available Pool' : 'Total Committed Pool'}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight leading-none ${src.isLowFund ? 'text-rose-600' : 'text-slate-900'}`}>
                    {src.amountSub}
                  </div>
                  <div className={`text-[11px] font-bold font-mono ${src.isLowFund ? 'text-rose-600 font-extrabold' : 'text-slate-500'}`}>
                    {src.amountFormatted} {src.isLowFund && '(Low Budget)'}
                  </div>
                  {src.hasDisbursed && (
                    <div className="text-[10px] text-slate-500 font-semibold pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span>Total: {src.allocatedFormatted}</span>
                      <span className="text-rose-600 font-bold font-mono">Disbursed: - {src.disbursedFormatted}</span>
                    </div>
                  )}
                </div>

                <p className={`text-[11px] leading-snug ${src.isLowFund ? 'text-rose-700 font-semibold' : 'text-slate-600'}`}>{src.description}</p>

                {src.canAdd && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAddGrantModalOpen(true);
                    }}
                    className={`w-full py-2 text-xs font-extrabold rounded-xl flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-2xs ${
                      src.isLowFund
                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 animate-pulse'
                        : 'bg-emerald-50 hover:bg-[#007A61] hover:text-white border border-emerald-200 text-[#007A61]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add State Grant Fund</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* State Grant Allocations Table with Edit / Delete Actions */}
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-[#007A61]" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                Allocated State Grants Ledger ({fundsData.fundEntries.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Click <strong>Edit</strong> to modify or rectify any allocated grant
            </span>
          </div>

          {fundsData.fundEntries.length === 0 ? (
            <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center space-y-2">
              <Landmark className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-xs font-bold text-slate-700">No State Grant Allocations Yet</div>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Click "+ Allocate State Grant Fund" to add budgetary funds from the Department of Higher Education or State Innovation Council.
              </p>
              <button
                onClick={() => setIsAddGrantModalOpen(true)}
                className="mt-2 px-3.5 py-1.5 bg-[#007A61] text-white text-xs font-bold rounded-lg cursor-pointer inline-flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Allocation</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto border border-slate-200/90 rounded-xl shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Fund ID / G.O. Ref</th>
                    <th className="py-2.5 px-3">Grant Title & Scheme</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Allocation Date</th>
                    <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {fundsData.fundEntries.map((f) => {
                    const amtNumber = Number(f.amount) || 0;
                    return (
                      <tr key={f.fundId || f._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/70">
                            {f.fundId || 'GGF-001'}
                          </span>
                          {f.sanctionOrderNo && (
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                              {f.sanctionOrderNo}
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900">{f.title}</div>
                          <div className="text-[10.5px] text-slate-500 line-clamp-1">{f.scheme}</div>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 font-medium">
                          {f.department}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                          {f.allocationDate ? new Date(f.allocationDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <div className="font-black font-mono text-slate-900 text-sm">
                            ₹ {amtNumber.toLocaleString('en-IN')}
                          </div>
                          <div className="text-[10px] font-bold text-[#007A61]">
                            {formatLakhsCrSubtitle(amtNumber)}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => setEditingFund(f)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-900 border border-slate-200 rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-all cursor-pointer shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                            <span>Edit / Rectify</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedSourceData && (
        <SourceDetailsModal
          isOpen={!!selectedSourceData}
          onClose={() => setSelectedSourceData(null)}
          sourceData={selectedSourceData}
        />
      )}

      {isAddGrantModalOpen && (
        <AddStateGrantModal
          isOpen={isAddGrantModalOpen}
          onClose={() => setIsAddGrantModalOpen(false)}
          onFundAdded={handleFundChange}
        />
      )}

      {editingFund && (
        <EditStateGrantModal
          isOpen={!!editingFund}
          fund={editingFund}
          onClose={() => setEditingFund(null)}
          onFundUpdated={handleFundChange}
          onFundDeleted={handleFundChange}
        />
      )}
    </>
  );
};

export default CSRFundingSources;
