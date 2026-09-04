import React, { useState, useEffect } from 'react';
import {
  Rocket,
  Plus,
  Send,
  Building2,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Coins,
  TrendingUp,
  Receipt,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Trash2
} from 'lucide-react';
import industryFundService from '../../services/industryFundService.js';
import { AddIndustryFundModal } from './AddIndustryFundModal.jsx';
import { DisburseGrantModal } from './DisburseGrantModal.jsx';
import { GrantSanctionReceiptModal } from './GrantSanctionReceiptModal.jsx';

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

  // Modals state
  const [isAddFundModalOpen, setIsAddFundModalOpen] = useState(false);
  const [isDisburseModalOpen, setIsDisburseModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [targetRequestForFunding, setTargetRequestForFunding] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFunds = async () => {
    try {
      setLoading(true);
      const res = await industryFundService.getFunds(user?.organizationName || 'Ariba Research Labs');
      if (res) {
        setFundsData(res);
      }
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

  const formatAmountINR = (val) => {
    const n = Number(val) || 0;
    return `₹ ${n.toLocaleString('en-IN')}`;
  };

  const formatLakhs = (val) => {
    const n = Number(val) || 0;
    if (n >= 10000000) return `₹ ${(n / 10000000).toFixed(2)} Cr`;
    return `₹ ${(n / 100000).toFixed(2)} Lakhs`;
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
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Industry Funding & University Grants
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl font-medium leading-relaxed">
              Manage your company’s innovation capital pools, review incoming university research proposals, and disburse direct grants to universities with automated escrow deductions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                setTargetRequestForFunding(null);
                setIsDisburseModalOpen(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Fund a University</span>
            </button>

            <button
              onClick={() => setIsAddFundModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Allocate New Fund</span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Committed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Committed Capital</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900">{formatLakhs(fundsData.totalCommitted)}</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              {fundsData.funds?.length || 0} Active Corporate Fund Pools
            </p>
          </div>
        </div>

        {/* Card 2: Disbursed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Disbursed to Universities</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-emerald-700">{formatLakhs(fundsData.totalDisbursed)}</h3>
            <p className="text-[11px] font-semibold text-emerald-600 mt-0.5 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {fundsData.disbursements?.length || 0} Settled Grants
            </p>
          </div>
        </div>

        {/* Card 3: Available Remaining Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Available Grant Balance</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-blue-700">{formatLakhs(fundsData.totalRemaining)}</h3>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{
                  width: `${fundsData.totalCommitted > 0 ? Math.round((fundsData.totalRemaining / fundsData.totalCommitted) * 100) : 0}%`
                }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 mt-1 block">
              {fundsData.totalCommitted > 0 ? Math.round((fundsData.totalRemaining / fundsData.totalCommitted) * 100) : 0}% Pool Remaining
            </span>
          </div>
        </div>

        {/* Card 4: Proposals Pipeline */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Incoming Proposals</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-amber-700">{pendingRequestsCount} Pending</h3>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              From Jharkhand Universities & HEIs
            </p>
          </div>
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-1 rounded-2xl shadow-2xs">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('pools')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'pools'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Fund Pools & Allocations</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'requests'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>University Funding Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-white font-extrabold">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === 'ledger'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Disbursement Ledger ({fundsData.disbursements?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* 4. Tab 1: Fund Pools & Visual Distribution */}
      {activeTab === 'pools' && (
        <div className="space-y-4">
          {/* Top visual Donut Chart & Category Breakdown card (matching user's screenshot layout) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-100 gap-6">
              {/* Left Donut representation */}
              <div className="flex items-center space-x-6 shrink-0">
                <div className="w-36 h-36 relative flex items-center justify-center">
                  <div className="w-full h-full rounded-full border-[14px] border-[#007A61] relative flex items-center justify-center">
                    <div 
                      className="absolute inset-0 rounded-full border-[14px] border-blue-500" 
                      style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%)'}} 
                    />
                    <div 
                      className="absolute inset-0 rounded-full border-[14px] border-purple-500" 
                      style={{ clipPath: 'polygon(50% 50%, 0 100%, 0 50%)'}} 
                    />
                    <div className="text-center">
                      <span className="block text-base font-black text-slate-900">{fundsData.totalCommittedFormatted}</span>
                      <span className="block text-[8px] font-bold text-slate-500 uppercase">COMMITTED</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900">Capital Portfolio Overview</h4>
                  <p className="text-xs text-slate-500">Corporate Innovation Allocation</p>
                  <div className="pt-2 flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                      Available: {formatLakhs(fundsData.totalRemaining)}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                      Disbursed: {formatLakhs(fundsData.totalDisbursed)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Category Distribution Grid */}
              <div className="w-full max-w-xl space-y-2.5">
                {fundsData.distribution?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs bg-slate-50/60 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-slate-800">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-[11px] text-slate-500 font-medium">
                        Rem: <b className="text-slate-800">₹ {(item.remaining / 100000).toFixed(1)}L</b>
                      </span>
                      <div className="w-20 sm:w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: item.color,
                            width: `${item.allocated > 0 ? Math.round((item.utilized / item.allocated) * 100) : 0}%`
                          }} 
                        />
                      </div>
                      <span className="font-black text-slate-900 min-w-[70px] text-right">₹{item.value}.00 L</span>
                      <span className="text-slate-400 font-mono text-[10px] min-w-[32px]">({item.percentage})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List of active fund entries */}
            <div className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center">
                  <Coins className="w-4 h-4 mr-2 text-[#007A61]" /> Active Fund Allocations
                </h4>
                <button
                  onClick={() => setIsAddFundModalOpen(true)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Another Fund Pool</span>
                </button>
              </div>

              {fundsData.funds && fundsData.funds.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {fundsData.funds.map((fund) => {
                    const remPct = fund.allocatedAmount > 0 
                      ? Math.round((fund.remainingAmount / fund.allocatedAmount) * 100)
                      : 0;

                    return (
                      <div 
                        key={fund.fundId || fund._id}
                        className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-700">
                              {fund.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                              fund.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                            }`}>
                              {fund.status}
                            </span>
                          </div>

                          <h5 className="text-sm font-black text-slate-900 leading-snug">{fund.title}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{fund.description}</p>
                          <p className="text-[10px] font-mono text-slate-400">Ref: {fund.sanctionOrderNo}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">Available Balance:</span>
                            <span className="font-black text-emerald-700">{formatAmountINR(fund.remainingAmount)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#007A61] rounded-full transition-all"
                              style={{ width: `${remPct}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold">
                            <span>Allocated: {formatAmountINR(fund.allocatedAmount)}</span>
                            <span>{remPct}% Remaining</span>
                          </div>

                          <div className="pt-2 flex items-center justify-between">
                            <button
                              onClick={() => {
                                setTargetRequestForFunding(null);
                                setIsDisburseModalOpen(true);
                              }}
                              disabled={fund.remainingAmount <= 0}
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer disabled:opacity-40"
                            >
                              <span>Disburse Grant</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => handleDeleteFund(fund.fundId || fund._id)}
                              title="Delete Fund"
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <Coins className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-60" />
                  <h5 className="text-sm font-bold text-slate-800">No Corporate Fund Pools Allocated Yet</h5>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Allocate corporate innovation or CSR capital to enable direct grants to universities and student research projects.
                  </p>
                  <button
                    onClick={() => setIsAddFundModalOpen(true)}
                    className="px-4 py-2 bg-[#007A61] hover:bg-[#00604c] text-white text-xs font-bold rounded-xl transition-all inline-flex items-center space-x-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Allocate Your First Fund Pool</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab 2: Incoming University Funding Requests */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">University Funding Proposals</h3>
              <p className="text-xs text-slate-500">Review requests submitted by HEIs. Approving will automatically deduct the grant from your selected fund pool.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">Total: {fundsData.incomingRequests?.length || 0}</span>
            </div>
          </div>

          {fundsData.incomingRequests && fundsData.incomingRequests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[9px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Req ID</th>
                    <th className="px-4 py-3">Project / Innovation Title</th>
                    <th className="px-4 py-3">Beneficiary University</th>
                    <th className="px-4 py-3">Requested Budget</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fundsData.incomingRequests.map((req) => {
                    const isApproved = req.status === 'Approved' || req.status === 'Funded';
                    const reqAmt = req.amountNumber || Number(String(req.estimatedBudget || '0').replace(/[^\d]/g, '')) || 0;

                    return (
                      <tr key={req.requestId || req._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3.5 font-mono text-slate-500 font-bold">{req.requestId || 'REQ-01'}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-extrabold text-slate-900 block">{req.projectTitle}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Faculty PI: {req.facultyName || 'Nodal SPOC'}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-slate-800 flex items-center">
                            <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                            {req.universityName || req.universityCode}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-black text-slate-900 text-sm">
                            {reqAmt > 0 ? formatAmountINR(reqAmt) : 'As per Proposal'}
                          </span>
                          <span className="block text-[9px] text-slate-400 font-medium">{req.duration || '3-6 Months'}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[9px] uppercase tracking-wider ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {isApproved ? 'Funded & Approved' : 'Pending Review'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {isApproved ? (
                            <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-end">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Disbursed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleOpenDisburseForRequest(req)}
                              className="px-3.5 py-1.5 bg-[#007A61] hover:bg-[#00604c] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 ml-auto cursor-pointer"
                            >
                              <Coins className="w-3.5 h-3.5" />
                              <span>Approve & Disburse</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <GraduationCap className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-bold text-slate-600">No Incoming University Funding Proposals</p>
              <p className="text-[11px] text-slate-400 mt-1">When universities submit R&D collaboration or grant requests, they will appear here for review.</p>
            </div>
          )}
        </div>
      )}

      {/* 6. Tab 3: Grant Disbursement Ledger */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 bg-slate-50/60 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Corporate Grants Disbursement Ledger</h3>
              <p className="text-xs text-slate-500">Official audit trail of all payments disbursed to universities with UTRs and escrow verification.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500">
                Total Payouts: {formatAmountINR(fundsData.totalDisbursed)}
              </span>
            </div>
          </div>

          {fundsData.disbursements && fundsData.disbursements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider text-[9px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Disbursement ID</th>
                    <th className="px-4 py-3">Beneficiary University</th>
                    <th className="px-4 py-3">Project Title</th>
                    <th className="px-4 py-3">Debited Fund Pool</th>
                    <th className="px-4 py-3">Amount Disbursed</th>
                    <th className="px-4 py-3">Settlement & UTR</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fundsData.disbursements.map((disb) => (
                    <tr key={disb.disbursementId || disb._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{disb.disbursementId}</td>
                      <td className="px-4 py-3">
                        <span className="font-extrabold text-slate-900 block">{disb.universityName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{disb.universityCode}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">{disb.projectTitle}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                          {disb.fundTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-black text-emerald-700 text-sm">
                        {formatAmountINR(disb.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="block font-mono text-[10px] text-slate-700 font-bold">{disb.utrNumber}</span>
                        <span className="block text-[9px] text-slate-400">{disb.mode}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-slate-500">
                        {new Date(disb.disbursedAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedReceipt(disb);
                            setIsReceiptModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center space-x-1 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Sanction Order</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <FileText className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-bold text-slate-600">No Grant Disbursements Settled Yet</p>
              <p className="text-[11px] text-slate-400 mt-1">Once you disburse funds to a university or project, the official transaction audit records will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddIndustryFundModal
        isOpen={isAddFundModalOpen}
        onClose={() => setIsAddFundModalOpen(false)}
        onSuccess={fetchFunds}
        user={user}
      />

      <DisburseGrantModal
        isOpen={isDisburseModalOpen}
        onClose={() => {
          setIsDisburseModalOpen(false);
          setTargetRequestForFunding(null);
        }}
        onSuccess={handleDisbursalSuccess}
        funds={fundsData.funds}
        availableUniversities={fundsData.availableUniversities}
        targetRequest={targetRequestForFunding}
        user={user}
      />

      <GrantSanctionReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setSelectedReceipt(null);
        }}
        receiptData={selectedReceipt}
        user={user}
      />
    </div>
  );
};

export default IndustryFundingView;
