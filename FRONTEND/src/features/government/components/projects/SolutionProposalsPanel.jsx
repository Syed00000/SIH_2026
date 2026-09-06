import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building2,
  MapPin,
  Calendar,
  IndianRupee,
  Layers,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Table,
  Grid,
  Check,
  X,
  Trash2,
  RotateCcw,
  Sparkles,
  PlayCircle,
  Lock
} from 'lucide-react';
import { ProposalDetailView } from './ProposalDetailView.jsx';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS } from '../../data/projectConstants.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';
import { parseGrantRupees, formatRupeesINR } from './GrantPaymentModal.jsx';

export const SolutionProposalsPanel = () => {
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getSolutionProposals());

  React.useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedSolProposals || data?.updatedProposals) {
        setProposals(data.updatedSolProposals || data.updatedProposals);
      }
    });
    return unsubscribe;
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Full page view
  const [viewingProposal, setViewingProposal] = useState(null);
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const saveProposals = (updatedList) => {
    setProposals(updatedList);
    try {
      localStorage.setItem('joharsetu_solution_proposals', JSON.stringify(updatedList));
    } catch {}
  };

  // Filtered proposals list
  const filteredProposals = useMemo(() => {
    return proposals.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hei.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === 'All Sectors' || item.sector === selectedSector;

      const matchesDistrict =
        selectedDistrict === 'All Districts' || item.district === selectedDistrict;

      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Pending' && !item.isFunded && item.status !== 'Rejected') ||
        (selectedStatus === 'Approved' && (item.isFunded || item.status === 'Approved' || item.budgetStatus === 'Grant Sanctioned by Government')) ||
        (selectedStatus === 'Rejected' && item.status === 'Rejected');

      return matchesSearch && matchesSector && matchesDistrict && matchesStatus;
    });
  }, [proposals, searchQuery, selectedSector, selectedDistrict, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Sectors');
    setSelectedDistrict('All Districts');
    setSelectedStatus('All');
  };

  // Action: Approve Grant & forward to CSR
  const handleApproveGrant = (proposal, remarks = '') => {
    const updated = proposals.map((p) =>
      p.id === proposal.id
        ? {
            ...p,
            status: 'Approved',
            governmentStatus: 'Approved',
            budgetStatus: 'Forwarded to CSR Grants Pipeline',
            milestonesCompleted: 5,
            progressPercentage: 71,
            reviewedAt: new Date().toISOString(),
            reviewerNotes: remarks || 'Proposal approved by Government Review Board and forwarded to CSR Grants.'
          }
        : p
    );
    saveProposals(updated);

    try {
      projectCsrSyncService.approveProposalFromProjects(proposal, remarks);
    } catch (err) {
      console.error('Failed to sync proposal to CSR:', err);
    }

    if (viewingProposal && viewingProposal.id === proposal.id) {
      setViewingProposal(updated.find((p) => p.id === proposal.id));
    }
    showToast(`Proposal "${proposal.id}" approved and forwarded to CSR Grants Pipeline!`);
  };

  // Action: Reject Proposal
  const handleRejectProposal = (proposal, remarks = '') => {
    const updated = proposals.map((p) =>
      p.id === proposal.id
        ? { ...p, status: 'Rejected', reviewerNotes: remarks || 'Proposal rejected.' }
        : p
    );
    saveProposals(updated);

    try {
      projectCsrSyncService.rejectProposalFromProjects(proposal, remarks);
    } catch (err) {
      console.error('Failed to sync rejected proposal to CSR:', err);
    }

    if (viewingProposal && viewingProposal.id === proposal.id) {
      setViewingProposal(updated.find((p) => p.id === proposal.id));
    }
    showToast(`Proposal "${proposal.id}" marked as REJECTED.`, 'info');
  };

  // Action: Delete Proposal
  const handleDeleteProposal = (proposalId) => {
    if (window.confirm(`Are you sure you want to delete proposal ${proposalId}?`)) {
      const updated = proposals.filter((p) => p.id !== proposalId);
      saveProposals(updated);

      try {
        projectCsrSyncService.deleteCsrProposal(proposalId);
      } catch (err) {
        console.error('Failed to delete proposal in CSR:', err);
      }

      if (viewingProposal && viewingProposal.id === proposalId) {
        setViewingProposal(null);
      }
      showToast(`Proposal "${proposalId}" deleted.`);
    }
  };

  // If viewing detailed full-page proposal review
  if (viewingProposal) {
    return (
      <ProposalDetailView
        proposal={viewingProposal}
        onBack={() => setViewingProposal(null)}
        onApproveGrant={handleApproveGrant}
        onRejectProposal={handleRejectProposal}
        onDeleteProposal={handleDeleteProposal}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Stage 1: Solution Proposals</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            SOLUTION PROPOSALS QUEUE
          </h1>
          <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
            Evaluate research DPRs, approve line-item budgets, and forward to CSR grant pipeline
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <a
            href="?tab=projects_active"
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
          >
            <PlayCircle className="w-4 h-4 text-slate-500" />
            <span>Go to Active Projects</span>
          </a>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedStatus === status
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="border border-slate-200 rounded-xl p-0.5 bg-slate-50 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Box and Select Filter inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search proposal title, HEI, ID..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden"
            />
          </div>

          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:bg-white focus:outline-hidden cursor-pointer"
          >
            {SECTOR_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>{sec}</option>
            ))}
          </select>

          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:bg-white focus:outline-hidden cursor-pointer"
          >
            {DISTRICT_OPTIONS.map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Cards Queue or Table */}
      {viewMode === 'cards' ? (
        <div className="space-y-3">
          {filteredProposals.map((proposal) => {
            const disbNum = parseGrantRupees(proposal.disbursedAmount) || 0;
            const isFunded = disbNum > 0 || proposal.budgetStatus === 'Grant Sanctioned by Government' || proposal.budgetStatus === 'Grant Disbursed';
            const isApproved = isFunded || proposal.status === 'Approved' || proposal.budgetStatus === 'Forwarded to CSR Grants Pipeline';

            return (
              <div
                key={proposal.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {proposal.id}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{proposal.sector}</span>
                    <span>•</span>
                    <span className="text-xs text-slate-500 font-medium">{proposal.district || 'Ranchi'} District</span>
                    <span>•</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isFunded
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : isApproved
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {isFunded ? 'Grant Disbursed (In Active Execution) ✓' : isApproved ? 'Forwarded to CSR Pipeline ✓' : 'Pending Evaluation'}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    {proposal.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-medium">
                    <span className="font-bold text-slate-900 flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{proposal.hei || 'Ranchi University (RU001)'}</span>
                    </span>
                    <span>•</span>
                    <span>DPR Allocation: <strong className="font-mono text-slate-900 font-bold">{proposal.requestedGrant || '₹ 73,000'}</strong></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  {isFunded ? (
                    <a
                      href="?tab=projects_active"
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Active Project</span>
                    </a>
                  ) : (
                    <a
                      href="?tab=csr"
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                    >
                      <span>Open CSR Disbursal</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setViewingProposal(proposal)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Review DPR</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Proposal & ID</th>
                  <th className="py-3.5 px-4">Submitting HEI</th>
                  <th className="py-3.5 px-4">Sector / District</th>
                  <th className="py-3.5 px-4">DPR Budget</th>
                  <th className="py-3.5 px-4">Pipeline Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProposals.map((prop) => {
                  const disbNum = parseGrantRupees(prop.disbursedAmount) || 0;
                  const isFunded = disbNum > 0 || prop.budgetStatus === 'Grant Sanctioned by Government';
                  const isApproved = isFunded || prop.status === 'Approved' || prop.budgetStatus === 'Forwarded to CSR Grants Pipeline';

                  return (
                    <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        <div>{prop.title}</div>
                        <div className="font-mono text-[10px] text-slate-500">{prop.id}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {prop.hei || 'Ranchi University (RU001)'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{prop.sector}</div>
                        <div className="text-[10px] text-slate-500">{prop.district || 'Ranchi'}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {prop.requestedGrant || '₹ 73,000'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          isFunded
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : isApproved
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}>
                          {isFunded ? 'Disbursed ✓' : isApproved ? 'In CSR Queue ✓' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {isFunded ? (
                            <a
                              href="?tab=projects_active"
                              className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                            >
                              Active
                            </a>
                          ) : (
                            <a
                              href="?tab=csr"
                              className="px-2.5 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                            >
                              CSR Disbursal
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => setViewingProposal(prop)}
                            className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg"
                          >
                            DPR
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionProposalsPanel;
