import { useState } from 'react';
import { citizenService } from '../../../../citizen/services/citizenService.js';
import apiClient from '../../../../../infrastructure/api/client.js';

export const useUniversityProblemsView = ({
  university,
  assignedChallenges = [],
  onReload
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Modal states
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [targetUniForAllocation, setTargetUniForAllocation] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDossierChallenge, setSelectedDossierChallenge] = useState(null);
  const [chatChallenge, setChatChallenge] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleOpenEditOrReassign = (chl) => {
    setTargetUniForAllocation(null);
    setSelectedChallenge(chl);
    setIsAssignModalOpen(true);
  };

  const handleOpenAssignNew = () => {
    setTargetUniForAllocation(university);
    setSelectedChallenge(null);
    setIsAssignModalOpen(true);
  };

  const handleQuickReject = async (e, chl) => {
    e.stopPropagation();
    const reason = prompt('Enter official rejection reason for this problem statement:', 'Out of institutional research scope / Incomplete ground data');
    if (!reason) return;

    try {
      const chlId = chl.challengeId || chl.id;
      await apiClient.patch(`citizen/challenges/${chlId}/triage`, {
        status: 'Rejected',
        remarks: `Rejected by State Nodal Cell: ${reason}`,
        priority: chl.priority || 'Low'
      });
      setToastMsg(`Problem statement ${chlId} marked as rejected.`);
      if (onReload) onReload();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to reject challenge: ' + err.message);
    }
  };

  const handleQuickDelete = async (e, chl) => {
    e.stopPropagation();
    const chlId = chl.challengeId || chl.id;
    if (!window.confirm(`Are you sure you want to permanently delete / dismiss ${chlId}?`)) {
      return;
    }

    try {
      setDeletingId(chlId);
      await citizenService.deleteChallenge(chlId);
      setToastMsg(`Problem statement ${chlId} deleted successfully.`);
      if (onReload) onReload();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete problem: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTriageSuccess = (updatedData) => {
    if (updatedData?.deleted) {
      setToastMsg(`Problem ${updatedData.challengeId} deleted from database.`);
    } else {
      setToastMsg(`Problem statement successfully updated & synchronized!`);
    }
    if (onReload) onReload();
    setTimeout(() => setToastMsg(''), 5000);
  };

  const filteredChallenges = assignedChallenges.filter((chl) => {
    const status = chl.status || 'In Progress';
    const priority = chl.priority || 'Medium';

    if (statusFilter !== 'All' && status !== statusFilter) return false;
    if (priorityFilter !== 'All' && priority !== priorityFilter) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (chl.title || '').toLowerCase().includes(q) ||
        (chl.challengeId || chl.id || '').toLowerCase().includes(q) ||
        (chl.description || '').toLowerCase().includes(q) ||
        (chl.domain || '').toLowerCase().includes(q) ||
        (chl.location?.district || chl.district || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    showProfileDrawer,
    setShowProfileDrawer,
    selectedChallenge,
    targetUniForAllocation,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedDossierChallenge,
    setSelectedDossierChallenge,
    chatChallenge,
    setChatChallenge,
    toastMsg,
    deletingId,
    handleOpenEditOrReassign,
    handleOpenAssignNew,
    handleQuickReject,
    handleQuickDelete,
    handleTriageSuccess,
    filteredChallenges
  };
};

export default useUniversityProblemsView;
