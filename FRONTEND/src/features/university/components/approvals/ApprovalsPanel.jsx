import React, { useState, useEffect } from 'react';
import { ApprovalsNotificationBanner } from './ApprovalsNotificationBanner.jsx';
import { ApprovalsKpis } from './ApprovalsKpis.jsx';
import { ApprovalsFilterBar } from './ApprovalsFilterBar.jsx';
import { ApprovalsTable } from './ApprovalsTable.jsx';
import { ApprovalDetailPanel } from './ApprovalDetailPanel.jsx';
import { ProblemEvidenceDossierPanel } from '../../../nodal/components/ProblemEvidenceDossierPanel.jsx';
import { universityApiService } from '../../services/universityApiService.js';

export const ApprovalsPanel = ({ universityCode = 'CUJ-099' }) => {
  const targetCode = universityCode || 'CUJ-099';
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [dossierChallenge, setDossierChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('budget');

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      const [data, projData] = await Promise.all([
        universityApiService.getApprovals(targetCode),
        universityApiService.getProjects(targetCode)
      ]);
      const appData = Array.isArray(data) ? data : [];
      const pList = Array.isArray(projData) ? projData : [];

      const enriched = appData.map((a) => {
        const matchingProj = pList.find((p) =>
          (p.projectId && a.projectId && p.projectId === a.projectId) ||
          (p.challengeId && a.challengeId && p.challengeId === a.challengeId) ||
          (p.title && a.project && p.title.toLowerCase() === a.project.toLowerCase())
        );
        const isDeployed = Boolean(matchingProj?.status === 'Deployed' || matchingProj?.isDeployed || a.isDeployed || a.status === 'Deployed' || a.governmentStatus === 'Approved & Deployed');
        const isForwarded = Boolean(a.sentToGovernment || a.governmentStatus === 'Under State Evaluation' || a.governmentStatus === 'Approved');
        return { ...a, isDeployed, isLocked: isDeployed, isForwarded, status: isDeployed ? 'Deployed' : a.status };
      });
      setApprovals(enriched);
    } catch (err) {
      console.error('fetchApprovals error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApprovals(); }, [targetCode]);

  const handleUpdateStatus = async (approval, newStatus, remarks = '', extraData = {}) => {
    try {
      const id = approval.approvalId || approval._id;
      const isApproved = newStatus === 'Approved';
      const payloadExtra = {
        ...(isApproved ? { sentToGovernment: true, governmentStatus: 'Under State Evaluation', ...(approval.type === 'Prototype Approval' ? { prototypeStatus: 'Approved' } : { budgetStatus: 'Forwarded to CSR Grants Pipeline' }) } : {}),
        ...extraData
      };
      await universityApiService.updateApprovalStatus(id, targetCode, newStatus, remarks, payloadExtra);
      setApprovals((prev) => prev.map((a) => (a.approvalId || a._id) === id ? { ...a, status: newStatus, adminRemarks: remarks, ...payloadExtra } : a));
    } catch (err) {
      console.error('updateApprovalStatus error:', err.message);
    }
  };

  const filtered = approvals.filter((a) => {
    if (activeTab === 'budget' && a.type === 'Prototype Approval') return false;
    if (activeTab === 'prototype' && a.type !== 'Prototype Approval') return false;
    if (typeFilter !== 'All' && a.type !== typeFilter) return false;
    if (statusFilter !== 'All') {
      if (statusFilter === 'Deployed' && !a.isDeployed) return false;
      if (statusFilter === 'Forwarded' && (!a.isForwarded || a.isDeployed)) return false;
      if (statusFilter === 'Pending' && (a.isDeployed || a.isForwarded || a.status !== 'Pending')) return false;
      if (statusFilter === 'Approved' && a.status !== 'Approved' && !a.isForwarded) return false;
      if (statusFilter === 'Rejected' && a.status !== 'Rejected') return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return `${a.approvalId} ${a.project} ${a.challengeId} ${a.requestedBy}`.toLowerCase().includes(q);
    }
    return true;
  });

  const validApprovals = approvals;
  const pending = validApprovals.filter((a) => a.status === 'Pending' && !a.isDeployed && !a.isForwarded).length;

  if (dossierChallenge) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none animate-in fade-in duration-150">
        <ProblemEvidenceDossierPanel
          challenge={{ ...dossierChallenge, challengeId: dossierChallenge.challengeId || dossierChallenge.projectId, description: dossierChallenge.problemStatement || dossierChallenge.description }}
          onClose={() => setDossierChallenge(null)}
          isUniversityView={true}
        />
      </div>
    );
  }

  if (isModalOpen && selected) {
    return (
      <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left animate-in fade-in duration-150">
        <ApprovalDetailPanel
          approval={selected}
          onClose={() => { setIsModalOpen(false); setSelected(null); }}
          onApprove={(app, rem, extra) => handleUpdateStatus(app, 'Approved', rem, extra)}
          onReject={(app, rem, extra) => handleUpdateStatus(app, 'Rejected', rem, extra)}
          onRequestChanges={(app, rem, extra) => handleUpdateStatus(app, 'Changes Required', rem, extra)}
          onViewProblemDossier={(app) => setDossierChallenge(app)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none pb-12 text-left">
      <ApprovalsNotificationBanner pendingCount={pending} onFilterPending={() => { setStatusFilter('Pending'); setActiveTab('budget'); }} />
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs p-4">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">University Approvals &amp; Proposal Dossiers</h1>
        <p className="text-xs text-slate-600 mt-0.5">Review, evaluate technical methodologies, and forward R&amp;D project proposals to the Government.</p>
      </div>

      <ApprovalsKpis total={validApprovals.length} pending={pending} approved={validApprovals.filter((a) => (a.status === 'Approved' || a.isForwarded) && !a.isDeployed).length} deployed={validApprovals.filter((a) => a.isDeployed).length} loading={loading} />

      <ApprovalsFilterBar
        search={search} setSearch={setSearch} typeFilter={typeFilter} setTypeFilter={setTypeFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter} activeTab={activeTab} setActiveTab={setActiveTab}
        onResetFilters={() => { setSearch(''); setTypeFilter('All'); setStatusFilter('All'); }}
      />

      {/* Tabs Switcher: Budget vs Prototype Approvals */}
      <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl w-max border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'budget'
              ? 'bg-white text-[#007A61] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span>Grant & Budget Approvals</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${activeTab === 'budget' ? 'bg-emerald-100 text-[#007A61]' : 'bg-slate-200 text-slate-600'}`}>
            {approvals.filter((a) => a.type !== 'Prototype Approval').length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prototype')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-2 ${
            activeTab === 'prototype'
              ? 'bg-white text-purple-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span>Prototype Approvals</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${activeTab === 'prototype' ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-600'}`}>
            {approvals.filter((a) => a.type === 'Prototype Approval').length}
          </span>
        </button>
      </div>

      <ApprovalsTable
        approvals={filtered}
        selectedId={selected?.approvalId}
        onSelect={(apr) => { setSelected(apr); setIsModalOpen(true); }}
        loading={loading}
      />
    </div>
  );
};

export default ApprovalsPanel;
