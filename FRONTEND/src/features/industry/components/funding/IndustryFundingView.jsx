import React, { useState, useEffect } from 'react';
import { Rocket, Plus, Send, RotateCcw, Coins, Building2, FileText, ShieldCheck } from 'lucide-react';
import industryFundService from '../../services/industryFundService.js';
import { AddIndustryFundModal } from './AddIndustryFundModal.jsx';
import { DisburseGrantModal } from './DisburseGrantModal.jsx';
import { GrantSanctionReceiptModal } from './GrantSanctionReceiptModal.jsx';
import { IndustryFundingKPIs } from './IndustryFundingKPIs.jsx';
import { IndustryFundPoolsTab } from './IndustryFundPoolsTab.jsx';
import { IndustryRequestsTab } from './IndustryRequestsTab.jsx';
import { IndustryLedgerTab } from './IndustryLedgerTab.jsx';

export const IndustryFundingView = ({ user }) => {
  const [activeTab, setActiveTab] = useState('pools'); // 'pools' | 'requests' | 'ledger'
  const [loading, setLoading] = useState(true);
  const [fundsData, setFundsData] = useState({
    totalCommitted: 0,
    totalCommittedFormatted: '₹ 0.00 L',
    totalDisbursed: 0,
    totalRemaining: 0,
    distribution: [],
    funds: [],
    disbursements: [],
    incomingRequests: [],
    availableUniversities: []
  });

  const [isAddFundModalOpen, setIsAddFundModalOpen] = useState(false);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [targetRequestForFunding, setTargetRequestForFunding] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const res = await industryFundService.getFunds(user?.organizationName || 'Ariba Research Labs');
      if (res) setFundsData(res);
    } catch (err) {
      console.warn('Failed to fetch industry funds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, [user]);

  const handleOpenDisburseForRequest = (req) => {
    setTargetRequestForFunding(req);
    setIsDisburseModalOpen(true);
  };

  const handleDisbursalSuccess = (receipt) => {
    fetchFunds();
    setSelectedReceipt(receipt);
    setIsReceiptModalOpen(true);
  };

  const handleDeleteFund = async (fundId) => {
    if (!window.confirm('Are you sure you want to remove this fund allocation?')) return;
    try {
      await industryFundService.deleteFund(fundId);
      fetchFunds();
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || 'Cannot delete fund');
    }
  };

  const pendingRequestsCount = fundsData.incomingRequests?.filter(r => r.status === 'Pending').length || 0;

  return (
    <div className="space-y-5 pb-12 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
          <Rocket className="w-56 h-56" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> Corporate Grant Portal
              </span>
              <span className="text-slate-400 text-xs font-semibold">• {user?.organizationName || 'Ariba Research Labs'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Industry Funding & University Grants</h1>
            <p className="text-xs text-slate-300 max-w-2xl font-medium leading-relaxed">
              Manage your company’s innovation capital pools, review incoming university research proposals, and disburse direct grants to universities with automated escrow deductions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => { setTargetRequestForFunding(null); setIsDisburseModalOpen(true); }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" /><span>Fund a University</span>
            </button>
            <button
              onClick={() => setIsAddFundModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" /><span>Allocate New Fund</span>
            </button>
            <button
              onClick={fetchFunds}
              title="Refresh Data"
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <IndustryFundingKPIs fundsData={fundsData} pendingRequestsCount={pendingRequestsCount} />

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-1 rounded-2xl shadow-2xs">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('pools')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'pools' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Coins className="w-4 h-4" /><span>Fund Pools & Allocations</span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'requests' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" /><span>University Funding Requests</span>
            {pendingRequestsCount > 0 && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-white font-extrabold">{pendingRequestsCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'ledger' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" /><span>Disbursement Ledger ({fundsData.disbursements?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* 4. Tab Views */}
      {activeTab === 'pools' && (
        <IndustryFundPoolsTab
          fundsData={fundsData}
          onAddFund={() => setIsAddFundModalOpen(true)}
          onDisburse={handleOpenDisburseForRequest}
          onDeleteFund={handleDeleteFund}
        />
      )}
      {activeTab === 'requests' && (
        <IndustryRequestsTab
          incomingRequests={fundsData.incomingRequests}
          onApproveAndDisburse={handleOpenDisburseForRequest}
        />
      )}
      {activeTab === 'ledger' && (
        <IndustryLedgerTab
          disbursements={fundsData.disbursements}
          totalDisbursed={fundsData.totalDisbursed}
          onViewReceipt={(receipt) => { setSelectedReceipt(receipt); setIsReceiptModalOpen(true); }}
        />
      )}

      {/* Modals */}
      <AddIndustryFundModal isOpen={isAddFundModalOpen} onClose={() => setIsAddFundModalOpen(false)} onSuccess={fetchFunds} user={user} />
      <DisburseGrantModal
        isOpen={isDisburseModalOpen}
        onClose={() => { setIsDisburseModalOpen(false); setTargetRequestForFunding(null); }}
        onSuccess={handleDisbursalSuccess}
        funds={fundsData.funds}
        availableUniversities={fundsData.availableUniversities}
        targetRequest={targetRequestForFunding}
        user={user}
      />
      <GrantSanctionReceiptModal isOpen={isReceiptModalOpen} onClose={() => { setIsReceiptModalOpen(false); setSelectedReceipt(null); }} receiptData={selectedReceipt} user={user} />
    </div>
  );
};

export default IndustryFundingView;
