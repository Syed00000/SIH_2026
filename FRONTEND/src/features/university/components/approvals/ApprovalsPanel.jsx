import React, { useState, useEffect } from 'react';
import { ApprovalsNotificationBanner } from './ApprovalsNotificationBanner.jsx';
import { ApprovalsKpis } from './ApprovalsKpis.jsx';
import { ApprovalsFilterBar } from './ApprovalsFilterBar.jsx';
import { ApprovalsTable } from './ApprovalsTable.jsx';
import { ApprovalDetailModal } from './ApprovalDetailModal.jsx';
import { IndustryRequestModal } from './IndustryRequestModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

const UNIVERSITY_CODE = 'RU001';

export const ApprovalsPanel = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('budget');

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const data = await universityApiService.getApprovals(UNIVERSITY_CODE);
      setApprovals(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchApprovals error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleOpenReview = (approval) => {
    setSelected(approval);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleUpdateStatus = async (approval, newStatus, remarks = '', extraData = {}) => {
    try {
      const id = approval.approvalId || approval._id;
      await universityApiService.updateApprovalStatus(id, UNIVERSITY_CODE, newStatus, remarks, extraData);
      setApprovals((prev) =>
        prev.map((a) => (a.approvalId || a._id) === id ? { ...a, status: newStatus, adminRemarks: remarks, ...extraData } : a)
      );
    } catch (err) {
      console.error('updateApprovalStatus error:', err.message);
    }
  };

  const handleDelete = async (approval) => {
    try {
      const id = approval.approvalId || approval._id;
      await universityApiService.deleteApproval(id, UNIVERSITY_CODE);
      setApprovals((prev) => prev.filter((a) => (a.approvalId || a._id) !== id));
      handleCloseModal();
    } catch (err) {
      console.error('deleteApproval error:', err.message);
    }
  };

  const handleOpenIndustryModal = () => {
    setIsIndustryModalOpen(true);
  };

  const filtered = approvals.filter((a) => {
    if (activeTab === 'budget' && a.type === 'Prototype Approval') return false;
    if (activeTab === 'prototype' && a.type !== 'Prototype Approval') return false;
    if (typeFilter !== 'All' && a.type !== typeFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const s = `${a.approvalId} ${a.project} ${a.challengeId} ${a.requestedBy} ${a.type}`.toLowerCase();
      if (!s.includes(q)) return false;
    }
    return true;
  });

  const total = approvals.length;
  const pending = approvals.filter((a) => a.status === 'Pending').length;
  const approved = approvals.filter((a) => a.status === 'Approved').length;
  const rejected = approvals.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
      {/* Top Notification Alert */}
      <ApprovalsNotificationBanner
        pendingCount={pending}
        onFilterPending={() => {
          setStatusFilter('Pending');
          setActiveTab('budget');
        }}
      />

      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          University Approvals & Proposal Dossiers
        </h1>
        <p className="text-xs text-slate-600 mt-0.5">
          Review, evaluate technical methodologies, and forward R&D project proposals to the Government for grant sanction.
        </p>
      </div>

      <ApprovalsKpis
        total={total}
        pending={pending}
        approved={approved}
        rejected={rejected}
        loading={loading}
      />

      <ApprovalsFilterBar
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onReset={() => {
          setSearch('');
          setTypeFilter('All');
          setStatusFilter('All');
        }}
      />

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-slate-100/50 p-1 rounded-xl w-max border border-slate-200">
        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'budget'
              ? 'bg-white text-[#007A61] shadow-sm ring-1 ring-slate-200/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          Grant & Budget Approvals
        </button>
        <button
          onClick={() => setActiveTab('prototype')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'prototype'
              ? 'bg-white text-purple-700 shadow-sm ring-1 ring-slate-200/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
          }`}
        >
          Prototype Approvals
        </button>
      </div>

      {/* Full Width Table */}
      <div className="w-full">
        <ApprovalsTable
          approvals={filtered}
          selectedId={selected?.approvalId || selected?._id}
          onSelect={handleOpenReview}
          loading={loading}
        />
      </div>

      {/* Centered High-End Detail Popup Modal */}
      {isModalOpen && selected && (
        <ApprovalDetailModal
          approval={selected}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onApprove={(apr, remarks, extra) => handleUpdateStatus(apr, 'Approved', remarks, extra)}
          onReject={(apr, remarks, extra) => handleUpdateStatus(apr, 'Rejected', remarks, extra)}
          onRequestChanges={(apr, remarks, extra) => handleUpdateStatus(apr, 'Changes Required', remarks, extra)}
          onDelete={handleDelete}
          onOpenIndustryModal={handleOpenIndustryModal}
        />
      )}

      <IndustryRequestModal
        isOpen={isIndustryModalOpen}
        onClose={() => setIsIndustryModalOpen(false)}
        approval={selected}
        onSuccess={() => {
          // Optionally update the UI to show it's been forwarded, e.g., by changing its state locally
          handleCloseModal();
        }}
      />
    </div>
  );
};

export default ApprovalsPanel;
