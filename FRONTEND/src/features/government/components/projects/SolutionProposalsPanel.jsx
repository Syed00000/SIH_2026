import React, { useState, useMemo, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { ProposalDetailView } from './ProposalDetailView.jsx';
import { SolutionProposalsHeader } from './SolutionProposalsHeader.jsx';
import { SolutionProposalsToolbar } from './SolutionProposalsToolbar.jsx';
import { SolutionProposalCard } from './SolutionProposalCard.jsx';
import { SolutionProposalTable } from './SolutionProposalTable.jsx';
import { projectCsrSyncService } from '../../services/projectCsrSyncService.js';

export const SolutionProposalsPanel = ({ onNavigateTab }) => {
  const [proposals, setProposals] = useState(() => projectCsrSyncService.getSolutionProposals());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('cards');
  const [viewingProposal, setViewingProposal] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    projectCsrSyncService.initializeFromBackend();
    const unsubscribe = projectCsrSyncService.subscribe((eventType, data) => {
      if (data?.updatedSolProposals || data?.updatedProposals) {
        setProposals(data.updatedSolProposals || data.updatedProposals);
      }
    });
    return unsubscribe;
  }, []);

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
        !searchQuery.trim() ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hei?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector = selectedSector === 'All Sectors' || item.sector === selectedSector;
      const matchesDistrict = selectedDistrict === 'All Districts' || item.district === selectedDistrict;

      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'Pending' && !item.isFunded && item.status !== 'Rejected') ||
        (selectedStatus === 'Approved' && (item.isFunded || item.status === 'Approved' || item.budgetStatus === 'Grant Sanctioned by Government')) ||
        (selectedStatus === 'Rejected' && item.status === 'Rejected');

      return matchesSearch && matchesSector && matchesDistrict && matchesStatus;
    });
  }, [proposals, searchQuery, selectedSector, selectedDistrict, selectedStatus]);

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
    showToast(`Proposal "${proposal.id}" approved and forwarded to CSR Grants.`);
  };

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
    showToast(`Proposal "${proposal.id}" rejected.`, 'info');
  };

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

  if (viewingProposal) {
    return (
      <ProposalDetailView
        proposal={viewingProposal}
        onBack={() => setViewingProposal(null)}
        onApproveGrant={handleApproveGrant}
        onRejectProposal={handleRejectProposal}
        onDeleteProposal={handleDeleteProposal}
        onNavigateTab={onNavigateTab}
      />
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12 select-none animate-fadeIn">
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xs shadow-xl border text-xs font-bold flex items-center space-x-2 bg-slate-900 text-white border-slate-800 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.msg}</span>
        </div>
      )}

      <SolutionProposalsHeader />

      <SolutionProposalsToolbar
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
      />

      {viewMode === 'cards' ? (
        <div className="space-y-3">
          {filteredProposals.length === 0 ? (
            <div className="bg-white border border-slate-200 p-12 text-center text-slate-400 text-xs rounded-xs">
              No project proposals currently pending review matching the filter criteria.
            </div>
          ) : (
            filteredProposals.map((proposal) => (
              <SolutionProposalCard
                key={proposal.id}
                proposal={proposal}
                onViewDetails={(p) => setViewingProposal(p)}
                onDelete={handleDeleteProposal}
                onNavigateTab={onNavigateTab}
              />
            ))
          )}
        </div>
      ) : (
        <SolutionProposalTable
          proposals={filteredProposals}
          onViewDetails={(p) => setViewingProposal(p)}
          onDelete={handleDeleteProposal}
          onNavigateTab={onNavigateTab}
        />
      )}
    </div>
  );
};

export default SolutionProposalsPanel;
