import React, { useState, useEffect } from 'react';
import { Plus, Search, Landmark, Clock, CheckCircle2, XCircle, AlertTriangle, Sparkles, Filter } from 'lucide-react';
import { DepartmentRequestsTable } from './DepartmentRequestsTable.jsx';
import { ApproveGrantRequestModal } from './ApproveGrantRequestModal.jsx';
import { RejectGrantRequestModal } from './RejectGrantRequestModal.jsx';
import { GrantRequestDetailsModal } from './GrantRequestDetailsModal.jsx';
import { CreateDepartmentRequisitionModal } from './CreateDepartmentRequisitionModal.jsx';
import apiClient from '../../../../infrastructure/api/client.js';

export const DepartmentFundRequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [approvingReq, setApprovingReq] = useState(null);
  const [rejectingReq, setRejectingReq] = useState(null);
  const [viewingReq, setViewingReq] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('government/grant-requests');
      const list = res?.data?.data || res?.data || [];
      setRequests(list);
    } catch (err) {
      console.warn('Failed to load grant requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleActionComplete = (msg) => {
    fetchRequests();
    setNotification({ msg });
    setTimeout(() => setNotification(null), 5000);
  };

  const filtered = requests.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q ||
      r.requestId?.toLowerCase().includes(q) ||
      r.requesterName?.toLowerCase().includes(q) ||
      r.purpose?.toLowerCase().includes(q) ||
      r.sector?.toLowerCase().includes(q) ||
      r.district?.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchQ && matchStatus;
  });

  const totalReqs = requests.length;
  const pendingReqs = requests.filter((r) => r.status === 'Pending').length;
  const grantedReqs = requests.filter((r) => r.status === 'Granted');
  const totalSanctioned = grantedReqs.reduce((sum, r) => sum + (Number(r.sanctionedAmount) || Number(r.requestedAmount) || 0), 0);
  const rejectedReqs = requests.filter((r) => r.status === 'Rejected').length;

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
            <span className="text-slate-700">Department Fund Requests</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            STATE DEPARTMENT FUND REQUISITIONS & CLEARANCE
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Receive, review, and clear grant requisitions submitted by state & district departments with direct pool transfer.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-[#007A61] hover:bg-[#00624e] text-white text-xs font-bold rounded-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Requisition</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xs p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Total Received</span>
          <div className="text-xl font-black font-mono text-slate-900 mt-1">{totalReqs} Requisitions</div>
          <span className="text-[11px] text-slate-400">All Tiers Combined</span>
        </div>
        <div className="bg-white border border-amber-200 bg-amber-50/40 rounded-xs p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">Pending Review</span>
          <div className="text-xl font-black font-mono text-amber-900 mt-1">{pendingReqs} Pending</div>
          <span className="text-[11px] text-amber-700 font-medium">Awaiting Transfer</span>
        </div>
        <div className="bg-white border border-emerald-200 bg-emerald-50/40 rounded-xs p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-[#007A61] tracking-wider block">Total Sanctioned & Disbursed</span>
          <div className="text-xl font-black font-mono text-emerald-900 mt-1">₹ {totalSanctioned.toLocaleString('en-IN')}</div>
          <span className="text-[11px] text-[#007A61] font-medium">{grantedReqs.length} Approved Grants</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xs p-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block">Rejected / Closed</span>
          <div className="text-xl font-black font-mono text-slate-700 mt-1">{rejectedReqs} Requests</div>
          <span className="text-[11px] text-slate-400">Audited Decision</span>
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
            placeholder="Search by department name, requisition ID, purpose, sector, or district..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xs text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-[#007A61] transition-all"
          />
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {['All', 'Pending', 'Granted', 'Rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xs text-[11px] font-bold cursor-pointer transition-all border ${
                statusFilter === status
                  ? 'bg-[#007A61] text-white border-[#007A61] shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status} {status === 'Pending' && pendingReqs > 0 && `(${pendingReqs})`}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <DepartmentRequestsTable
        requests={filtered}
        onApprove={(r) => setApprovingReq(r)}
        onReject={(r) => setRejectingReq(r)}
        onViewDetails={(r) => setViewingReq(r)}
      />

      {/* Modals */}
      <ApproveGrantRequestModal
        isOpen={!!approvingReq}
        request={approvingReq}
        onClose={() => setApprovingReq(null)}
        onApproved={() => handleActionComplete(`Fund sanctioned and transferred successfully to ${approvingReq?.requesterName}!`)}
      />

      <RejectGrantRequestModal
        isOpen={!!rejectingReq}
        request={rejectingReq}
        onClose={() => setRejectingReq(null)}
        onRejected={() => handleActionComplete(`Requisition ${rejectingReq?.requestId} rejected.`)}
      />

      <GrantRequestDetailsModal
        isOpen={!!viewingReq}
        request={viewingReq}
        onClose={() => setViewingReq(null)}
        onOpenApprove={(r) => setApprovingReq(r)}
      />

      <CreateDepartmentRequisitionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => handleActionComplete('Department fund requisition submitted successfully!')}
      />
    </div>
  );
};

export default DepartmentFundRequestsPanel;
