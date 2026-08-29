import React, { useState, useMemo } from 'react';
import {
  FileCheck,
  Search,
  RotateCcw,
  Plus,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Check,
  ChevronRight,
  Sparkles,
  Table,
  Grid,
  IndianRupee,
  FileText,
  Layers,
  Award,
  Trash2
} from 'lucide-react';

import { ProposalDetailView } from './ProposalDetailView.jsx';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS } from '../../data/projectConstants.js';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const SolutionProposalsPanel = () => {
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getSolutionProposals());

  // Listen to live CSR & project sync events
  React.useEffect(() => {
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedSolProposals) {
        setProposals(data.updatedSolProposals);
      }
    });
    return unsubscribe;
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Full Page Proposal Detail State
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

  const filteredProposals = useMemo(() => {
    return proposals.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hei.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teamLead.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector =
        selectedSector === 'All Sectors' || item.sector === selectedSector;

      const matchesDistrict =
        selectedDistrict === 'All Districts' || item.district === selectedDistrict;

      const matchesStatus =
        selectedStatus === 'All Status' || item.status === selectedStatus;

      return matchesSearch && matchesSector && matchesDistrict && matchesStatus;
    });
  }, [proposals, searchQuery, selectedSector, selectedDistrict, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Sectors');
    setSelectedDistrict('All Districts');
    setSelectedStatus('All Status');
  };

  // Action: Approve Grant
  const handleApproveGrant = (proposal, remarks = '') => {
    const updated = proposals.map((p) =>
      p.id === proposal.id
        ? { ...p, status: 'Approved', reviewerNotes: remarks || 'Grant approved by administration.' }
        : p
    );
    saveProposals(updated);

    // Sync into CSR Grants Comprehensive Proposal Pipeline
    try {
      projectCsrSyncService.approveProposalFromProjects({
        ...proposal,
        status: 'Approved',
        reviewerNotes: remarks
      });
    } catch (err) {
      console.error('Failed to sync approved proposal to CSR:', err);
    }

    if (viewingProposal && viewingProposal.id === proposal.id) {
      setViewingProposal(updated.find((p) => p.id === proposal.id));
    }
    showToast(`Grant sanctioned for "${proposal.title}" (${proposal.id}) & synced to CSR Grants pipeline.`);
  };

  // Action: Reject Proposal
  const handleRejectProposal = (proposal, remarks = '') => {
    const updated = proposals.map((p) =>
      p.id === proposal.id
        ? { ...p, status: 'Rejected', reviewerNotes: remarks || 'Proposal rejected.' }
        : p
    );
    saveProposals(updated);

    // Synchronize rejection across CSR Grants & purge from Active Projects
    try {
      projectCsrSyncService.rejectProposalFromProjects(proposal, remarks);
    } catch (err) {
      console.error('Failed to sync rejected proposal to CSR:', err);
    }

    if (viewingProposal && viewingProposal.id === proposal.id) {
      setViewingProposal(updated.find((p) => p.id === proposal.id));
    }
    showToast(`Proposal "${proposal.id}" marked as REJECTED & synced to CSR Grants pipeline.`, 'info');
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
      showToast(`Proposal "${proposalId}" deleted across all modules.`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New Submission':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Pending Review':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'High Priority':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Under Evaluation':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Approved':
        return 'bg-slate-900 text-white border-slate-900';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
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
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            <span className="flex items-center space-x-1">
              <FileCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Projects & Solutions</span>
            </span>
            <span>•</span>
            <span className="text-slate-700">Proposal Queue & Evaluation</span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            SOLUTION PROPOSALS & GRANT APPLICATIONS
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Academic & innovator proposals submitted for Jharkhand state challenges
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
          {proposals.length} Total Applications in Queue
        </span>
      </div>

      {/* Top Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* Card 1: Total Submissions */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Total Submissions
              </span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                {proposals.length}
              </span>
              <span className="text-[10px] text-slate-600 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                +8 this month
              </span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
            Academic & innovator pipeline
          </div>
        </div>

        {/* Card 2: Pending Review */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Pending Review
              </span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                {proposals.filter((p) => p.status === 'Pending Review' || p.status === 'New Submission').length}
              </span>
              <span className="text-[10px] text-slate-600 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                Awaiting
              </span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
            Awaiting selection committee
          </div>
        </div>

        {/* Card 3: High Priority */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                High Priority
              </span>
              <AlertCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                {proposals.filter((p) => p.status === 'High Priority').length}
              </span>
              <span className="text-[10px] text-slate-600 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
                Critical
              </span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
            Requires immediate triage
          </div>
        </div>

        {/* Card 4: Approved Grants */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Approved Grants
              </span>
              <CheckCircle2 className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                {proposals.filter((p) => p.status === 'Approved' || p.status === 'Verified').length}
              </span>
              <span className="text-[10px] text-slate-600 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                Sanctioned
              </span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
            Grant accounts active
          </div>
        </div>

        {/* Card 5: Avg Score */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between h-[125px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                Avg Score
              </span>
              <Award className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                91.4
              </span>
              <span className="text-[10px] text-slate-600 font-bold flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                Evaluated
              </span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
            Top-tier feasibility index
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Status Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-4">
        {/* Row 1: Status Tabs and View switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedStatus('All Status')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === 'All Status'
                  ? 'bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Proposals ({proposals.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('New Submission')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === 'New Submission'
                  ? 'bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              New Submission ({proposals.filter((p) => p.status === 'New Submission').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('Pending Review')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === 'Pending Review'
                  ? 'bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending Review ({proposals.filter((p) => p.status === 'Pending Review').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('High Priority')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === 'High Priority'
                  ? 'bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              High Priority ({proposals.filter((p) => p.status === 'High Priority').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('Under Evaluation')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === 'Under Evaluation'
                  ? 'bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Under Evaluation ({proposals.filter((p) => p.status === 'Under Evaluation').length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('Approved')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatus === 'Approved'
                  ? 'bg-[#0f172a] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Approved ({proposals.filter((p) => p.status === 'Approved' || p.status === 'Verified').length})
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl p-0.5 bg-slate-50 flex items-center shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Cards Queue View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Row 2: Search Box and Select Filter inputs */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search proposal title, ID, team lead, or university..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-slate-400 focus:outline-hidden shadow-2xs transition-all"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-slate-400 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              {SECTOR_OPTIONS.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:border-slate-400 focus:outline-hidden cursor-pointer shadow-2xs"
            >
              {DISTRICT_OPTIONS.map((dist) => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleResetFilters}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-2xs shrink-0"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content: Cards Queue or Table */}
      {viewMode === 'cards' ? (
        <div className="space-y-3">
          {filteredProposals.map((proposal) => {
            const isApproved = proposal.status === 'Approved';

            return (
              <div
                key={proposal.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-slate-700 shrink-0">
                    <FileText className="w-5 h-5 text-slate-600" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{proposal.title}</h3>
                      <span className="font-mono text-[11px] font-bold text-slate-500">
                        ({proposal.id})
                      </span>
                      <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-900 ml-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          proposal.status === 'Approved' || proposal.status === 'Verified'
                            ? 'bg-emerald-500'
                            : proposal.status === 'High Priority'
                            ? 'bg-red-500'
                            : proposal.status === 'Pending Review'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        } shrink-0`}></span>
                        <span>{proposal.status}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                      {proposal.abstract}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 mt-2">
                      <span className="font-semibold text-slate-800 flex items-center space-x-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proposal.hei}</span>
                      </span>
                      <span>•</span>
                      <span>Team Lead: <strong className="text-slate-700">{proposal.teamLead}</strong></span>
                      <span>•</span>
                      <span>{proposal.sector}</span>
                      <span>•</span>
                      <span>{proposal.district}</span>
                      <span>•</span>
                      <span className="font-mono font-bold text-slate-900">
                        {proposal.requestedGrant}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                  {!isApproved ? (
                    <button
                      type="button"
                      onClick={() => handleApproveGrant(proposal)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Approve Grant</span>
                    </button>
                  ) : (
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 px-1 py-0.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Sanctioned</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setViewingProposal(proposal)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer flex items-center space-x-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Review DPR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteProposal(proposal.id)}
                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                    title="Delete Proposal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Proposal & ID</th>
                  <th className="py-3 px-4">Submitting Institution</th>
                  <th className="py-3 px-4">Sector / District</th>
                  <th className="py-3 px-4">Requested Grant</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProposals.map((prop) => (
                  <tr key={prop.id} className="hover:bg-slate-50/60 transition-colors group cursor-default">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{prop.title}</div>
                      <div className="font-mono text-[11px] text-slate-500 font-semibold">{prop.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{prop.hei}</div>
                      <div className="text-[11px] text-slate-500">{prop.teamLead}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div>{prop.sector}</div>
                      <div className="text-[11px] text-slate-500">{prop.district}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {prop.requestedGrant}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          prop.status === 'Approved' || prop.status === 'Verified'
                            ? 'bg-emerald-500'
                            : prop.status === 'High Priority'
                            ? 'bg-red-500'
                            : prop.status === 'Pending Review'
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        } shrink-0`}></span>
                        <span>{prop.status}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingProposal(prop)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                        >
                          Review DPR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProposal(prop.id)}
                          className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                          title="Delete Proposal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionProposalsPanel;
