import React, { useState, useEffect } from 'react';
import { ApprovalsNotificationBanner } from './ApprovalsNotificationBanner.jsx';
import { ApprovalsKpis } from './ApprovalsKpis.jsx';
import { ApprovalsFilterBar } from './ApprovalsFilterBar.jsx';
import { ApprovalsTable } from './ApprovalsTable.jsx';
import { ApprovalDetailPanel } from './ApprovalDetailPanel.jsx';
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
      const isApproved = newStatus === 'Approved';
      const payloadExtra = {
        ...(isApproved ? {
          sentToGovernment: true,
          governmentStatus: 'Under State Evaluation',
          ...(approval.type === 'Prototype Approval' ? { prototypeStatus: 'Approved' } : { budgetStatus: 'Forwarded to CSR Grants Pipeline' })
        } : {}),
        ...extraData
      };
      await universityApiService.updateApprovalStatus(id, UNIVERSITY_CODE, newStatus, remarks, payloadExtra);
      setApprovals((prev) =>
        prev.map((a) => (a.approvalId || a._id) === id ? { ...a, status: newStatus, adminRemarks: remarks, ...payloadExtra } : a)
      );
      try {
        const { projectCsrSyncService } = await import('../../../government/services/projectCsrSyncService.js');
        await projectCsrSyncService.initializeFromBackend();
      } catch {}
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

  const filtered = approvals.filter((a) => {
    if (activeTab === 'budget' && a.type === 'Prototype Approval') return false;
    // Prototype approvals only appear when testing has been completed by industry partner
    if (activeTab === 'prototype' && (a.type !== 'Prototype Approval' || !a.testingCompleted)) return false;
    if (typeFilter !== 'All' && a.type !== typeFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const s = `${a.approvalId} ${a.project} ${a.challengeId} ${a.requestedBy} ${a.type}`.toLowerCase();
      if (!s.includes(q)) return false;
    }
    return true;
  });

  const validApprovals = approvals.filter((a) => a.type !== 'Prototype Approval' || Boolean(a.testingCompleted));
  const total = validApprovals.length;
  const pending = validApprovals.filter((a) => a.status === 'Pending').length;
  const approved = validApprovals.filter((a) => a.status === 'Approved').length;
  const rejected = validApprovals.filter((a) => a.status === 'Rejected').length;

  if (isModalOpen && selected) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
        <ApprovalDetailPanel
          approval={selected}
          onClose={handleCloseModal}
          onApprove={(app, rem, extra) => handleUpdateStatus(app, 'Approved', rem, extra)}
          onReject={(app, rem, extra) => handleUpdateStatus(app, 'Rejected', rem, extra)}
          onRequestChanges={(app, rem, extra) => handleUpdateStatus(app, 'Changes Required', rem, extra)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      <ApprovalsNotificationBanner
        pendingCount={pending}
        onFilterPending={() => { setStatusFilter('Pending'); setActiveTab('budget'); }}
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
        onReset={() => { setSearch(''); setTypeFilter('All'); setStatusFilter('All'); }}
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

      {/* Industry Request Modal */}
      {isIndustryModalOpen && (
        <IndustryRequestModal
          isOpen={isIndustryModalOpen}
          onClose={() => setIsIndustryModalOpen(false)}
          onSubmitSuccess={fetchApprovals}
        />
      )}
    </div>
  );
};

export default ApprovalsPanel;
