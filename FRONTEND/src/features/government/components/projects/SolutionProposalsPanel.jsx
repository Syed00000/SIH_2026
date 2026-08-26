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
  Award
} from 'lucide-react';

import { ProposalDetailView } from './ProposalDetailView.jsx';
import { SECTOR_OPTIONS, DISTRICT_OPTIONS, INITIAL_SOLUTION_PROPOSALS } from '../../data/projectsSolutionsData.js';

export const SolutionProposalsPanel = () => {
  const [proposals, setProposals] = useState(() => {
    try {
      const saved = localStorage.getItem('joharsetu_solution_proposals');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_SOLUTION_PROPOSALS;
  });

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
    if (viewingProposal && viewingProposal.id === proposal.id) {
      setViewingProposal(updated.find((p) => p.id === proposal.id));
    }
    showToast(`Grant sanctioned for "${proposal.title}" (${proposal.id}).`);
  };

  // Action: Reject Proposal
  const handleRejectProposal = (proposal, remarks = '') => {
    const updated = proposals.map((p) =>
      p.id === proposal.id
        ? { ...p, status: 'Rejected', reviewerNotes: remarks || 'Proposal rejected.' }
        : p
    );
    saveProposals(updated);
    if (viewingProposal && viewingProposal.id === proposal.id) {
      setViewingProposal(updated.find((p) => p.id === proposal.id));
    }
    showToast(`Proposal "${proposal.id}" marked as rejected.`, 'info');
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
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Submissions
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{proposals.length}</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 mt-1 inline-block">
            +8 this month
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Pending Review
          </span>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {proposals.filter((p) => p.status === 'Pending Review' || p.status === 'New Submission').length}
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 mt-1 inline-block">
            Awaiting Committee
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            High Priority
          </span>
          <div className="text-2xl font-bold text-red-700 mt-1">
            {proposals.filter((p) => p.status === 'High Priority').length}
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-50 text-red-700 mt-1 inline-block">
            Critical Need
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Approved Grants
          </span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {proposals.filter((p) => p.status === 'Approved' || p.status === 'Verified').length}
          </div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 mt-1 inline-block">
            Sanctioned
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Avg Score
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">91.4 / 100</div>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 mt-1 inline-block">
            Evaluated
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search proposal title, ID, team lead, or university..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-hidden"
          />
        </div>

        <div className="w-full md:w-48">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            {SECTOR_OPTIONS.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-40">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:bg-white focus:border-slate-800 focus:outline-hidden cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="New Submission">New Submission</option>
            <option value="Pending Review">Pending Review</option>
            <option value="High Priority">High Priority</option>
            <option value="Under Evaluation">Under Evaluation</option>
            <option value="Verified">Verified</option>
            <option value="Approved">Approved</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={handleResetFilters}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="border border-slate-200 rounded-lg p-0.5 bg-slate-50 flex items-center">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'cards' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Cards Queue View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
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
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          proposal.status
                        )}`}
                      >
                        {proposal.status}
                      </span>
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
                      <span className="font-mono font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
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
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Approve Grant</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Sanctioned</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setViewingProposal(proposal)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5"
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
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(prop.status)}`}>
                        {prop.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setViewingProposal(prop)}
                        className="px-3 py-1 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-2xs"
                      >
                        Review DPR
                      </button>
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
