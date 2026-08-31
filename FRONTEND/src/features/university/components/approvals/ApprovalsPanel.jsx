import React, { useState, useEffect } from 'react';
import { ApprovalsKpis } from './ApprovalsKpis.jsx';
import { ApprovalsFilterBar } from './ApprovalsFilterBar.jsx';
import { ApprovalsTable } from './ApprovalsTable.jsx';
import { ApprovalDetailModal } from './ApprovalDetailModal.jsx';
import { universityApiService } from '../../services/universityApiService.js';

const UNIVERSITY_CODE = 'RU001';

export const ApprovalsPanel = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const data = await universityApiService.getApprovals(UNIVERSITY_CODE);
      const list = Array.isArray(data) ? data : [];
      setApprovals(list);
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

  const handleUpdateStatus = async (approval, newStatus, remarks = '') => {
    try {
      await universityApiService.updateApprovalStatus(
        approval.approvalId || approval._id,
        UNIVERSITY_CODE,
        newStatus,
        remarks
      );
      setApprovals((prev) =>
        prev.map((a) =>
          (a.approvalId || a._id) === (approval.approvalId || approval._id)
            ? { ...a, status: newStatus, adminRemarks: remarks }
            : a
        )
      );
    } catch (err) {
      console.error('updateApprovalStatus error:', err.message);
    }
  };

  const filtered = approvals.filter((a) => {
    if (typeFilter !== 'All' && a.type !== typeFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const searchable = `${a.approvalId} ${a.project} ${a.challengeId} ${a.requestedBy} ${a.type}`.toLowerCase();
      if (!searchable.includes(q)) return false;
    }
    return true;
  });

  const total = approvals.length;
  const pending = approvals.filter((a) => a.status === 'Pending').length;
  const approved = approvals.filter((a) => a.status === 'Approved').length;
  const rejected = approvals.filter((a) => a.status === 'Rejected').length;

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12">
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
          onApprove={(apr, remarks) => handleUpdateStatus(apr, 'Approved', remarks)}
          onReject={(apr, remarks) => handleUpdateStatus(apr, 'Rejected', remarks)}
          onRequestChanges={(apr, remarks) => handleUpdateStatus(apr, 'Changes Required', remarks)}
        />
      )}
    </div>
  );
};

export default ApprovalsPanel;
