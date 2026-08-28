import React, { useState, useEffect } from 'react';
import { ApprovalsKpis } from './ApprovalsKpis.jsx';
import { ApprovalsFilterBar } from './ApprovalsFilterBar.jsx';
import { ApprovalsTable } from './ApprovalsTable.jsx';
import { ApprovalDrawer } from './ApprovalDrawer.jsx';
import { universityApiService } from '../../services/universityApiService.js';

const UNIVERSITY_CODE = 'RU001';

export const ApprovalsPanel = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const data = await universityApiService.getApprovals(UNIVERSITY_CODE);
      const list = Array.isArray(data) ? data : [];
      setApprovals(list);
      if (list.length > 0 && !selected) setSelected(list[0]);
    } catch (err) {
      console.error('fetchApprovals error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleUpdateStatus = async (approval, newStatus, remarks = '') => {
    try {
      await universityApiService.updateApprovalStatus(approval.approvalId || approval._id, UNIVERSITY_CODE, newStatus, remarks);
      setApprovals((prev) =>
        prev.map((a) =>
          (a.approvalId || a._id) === (approval.approvalId || approval._id)
            ? { ...a, status: newStatus, adminRemarks: remarks }
            : a
        )
      );
      setSelected((prev) => prev ? { ...prev, status: newStatus, adminRemarks: remarks } : prev);
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
    <div className="space-y-3 max-w-7xl mx-auto select-none">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Approvals</h1>
        <p className="text-xs text-slate-600 mt-0.5">Review and take action on all approval requests from across the university.</p>
      </div>

      <ApprovalsKpis total={total} pending={pending} approved={approved} rejected={rejected} loading={loading} />

      <ApprovalsFilterBar
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onReset={() => { setSearch(''); setTypeFilter('All'); setStatusFilter('All'); }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        <div className={`${selected ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <ApprovalsTable
            approvals={filtered}
            selectedId={selected?.approvalId || selected?._id}
            onSelect={(a) => setSelected(a)}
            loading={loading}
          />
        </div>

        {selected && (
          <div className="lg:col-span-5 sticky top-20">
            <ApprovalDrawer
              approval={selected}
              onClose={() => setSelected(null)}
              onApprove={(apr, remarks) => handleUpdateStatus(apr, 'Approved', remarks)}
              onReject={(apr, remarks) => handleUpdateStatus(apr, 'Rejected', remarks)}
              onRequestChanges={(apr, remarks) => handleUpdateStatus(apr, 'Changes Required', remarks)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsPanel;
