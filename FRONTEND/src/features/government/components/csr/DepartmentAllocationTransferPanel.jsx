import React, { useState, useEffect } from 'react';
import { Plus, Search, Landmark, ArrowUpRight, Filter, Building, Sparkles } from 'lucide-react';
import { AllocateDepartmentFundModal } from './AllocateDepartmentFundModal.jsx';
import { DepartmentSanctionReceiptModal } from './DepartmentSanctionReceiptModal.jsx';
import { DepartmentAllocationTable } from './DepartmentAllocationTable.jsx';
import apiClient from '../../../../infrastructure/api/client.js';

export const DepartmentAllocationTransferPanel = () => {
  const [allocations, setAllocations] = useState([]);
  const [treasuryBalance, setTreasuryBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchAllocations = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('government/grants');
      const data = res?.data?.data || res?.data || {};
      const entries = data.fundEntries || [];
      setAllocations(entries);
      if (typeof data.stateGrantsTotal === 'number') {
        setTreasuryBalance(data.stateGrantsTotal);
      }
    } catch (err) {
      console.warn('Failed to load department allocations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, []);

  const handleFundAllocated = (newFundData) => {
    fetchAllocations();
    const deptName = newFundData?.createdFund?.department || newFundData?.targetDepartment?.name || 'Department';
    const amt = Number(newFundData?.createdFund?.amount || 0);
    setNotification({
      msg: `₹ ${amt.toLocaleString('en-IN')} allocated successfully to ${deptName}!`
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const filteredAllocations = allocations.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchQuery =
      !query ||
      item.department?.toLowerCase().includes(query) ||
      item.sanctionOrderNo?.toLowerCase().includes(query) ||
      item.scheme?.toLowerCase().includes(query) ||
      item.fundId?.toLowerCase().includes(query);

    const matchCategory =
      categoryFilter === 'All' ||
      item.departmentCategory?.toLowerCase().includes(categoryFilter.toLowerCase()) ||
      (categoryFilter === 'State Ministry' && (item.department?.toLowerCase().includes('ministry') || item.department?.toLowerCase().includes('state')));

    return matchQuery && matchCategory;
  });

  const totalAllocatedAmount = allocations.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const uniqueDepts = new Set(allocations.map((a) => a.departmentId || a.department)).size;

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8 select-none animate-fadeIn">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xs shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xs p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <Landmark className="w-3.5 h-3.5 text-[#007A61]" />
              <span>CSR & State Grants</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Allocation & Transfer</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            STATE DEPARTMENT FUND ALLOCATION & TRANSFER
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Allocate state budgetary grants directly to registered departments and track real-time fund utilization ledgers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAllocateModalOpen(true)}
          className="px-4 py-2 bg-[#007A61] hover:bg-[#00624e] text-white text-xs font-bold rounded-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Allocate Fund to Department</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-xs p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Available Treasury Pool</span>
          <div className="text-xl font-black font-mono text-[#007A61] mt-1">₹ {treasuryBalance.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400 font-medium">State Innovation & CSR Pool</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xs p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Total Allocated to Departments</span>
          <div className="text-xl font-black font-mono text-emerald-800 mt-1">₹ {totalAllocatedAmount.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-slate-400 font-medium">Deducted from Pool</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xs p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Active Allocation Orders</span>
          <div className="text-xl font-black font-mono text-slate-900 mt-1">{allocations.length} Orders ({uniqueDepts} Depts)</div>
          <span className="text-[11px] text-slate-400 font-medium">Audited PFMS Disbursals</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-xs border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search allocations by department, sanction order, or scheme..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61] transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 overflow-x-auto w-full sm:w-auto">
          {['All', 'State Ministry', 'District Department', 'Block / Tehsil'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xs text-[11px] font-bold cursor-pointer transition-all border ${
                categoryFilter === cat
                  ? 'bg-[#007A61] text-white border-[#007A61] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Allocation Listing Table */}
      <DepartmentAllocationTable
        allocations={filteredAllocations}
        onViewReceipt={(item) => setSelectedReceipt(item)}
      />

      {/* Modals */}
      <AllocateDepartmentFundModal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        onFundAllocated={handleFundAllocated}
      />

      <DepartmentSanctionReceiptModal
        isOpen={!!selectedReceipt}
        allocation={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
};

export default DepartmentAllocationTransferPanel;
