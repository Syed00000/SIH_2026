import { useState, useEffect } from 'react';
import { citizenService } from '../../../../citizen/services/citizenService.js';
import apiClient from '../../../../../infrastructure/api/client.js';
import { filterChallengesList } from '../filterChallenges.helper.js';

export const useNodalChallenges = ({ initialStatusFilter = 'All Status', nodalDistrict = '' }) => {
  const safeInitialStatus = typeof initialStatusFilter === 'string' ? initialStatusFilter : 'All Status';
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(safeInitialStatus);
  const [domainFilter, setDomainFilter] = useState('All Domains');
  const [districtFilter, setDistrictFilter] = useState(nodalDistrict || 'All Districts');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [chatChallenge, setChatChallenge] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedDossierChallenge, setSelectedDossierChallenge] = useState(null);
  const [toastMsg, setToastMsg] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(typeof initialStatusFilter === 'string' ? initialStatusFilter : 'All Status');
    }
  }, [initialStatusFilter]);

  useEffect(() => {
    if (nodalDistrict && nodalDistrict !== 'All' && nodalDistrict !== 'All Districts') {
      setDistrictFilter(nodalDistrict);
    }
  }, [nodalDistrict]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const queryParams = { limit: 150 };
      if (nodalDistrict && nodalDistrict !== 'All' && nodalDistrict !== 'All Districts') {
        queryParams.district = nodalDistrict;
      }
      const res = await citizenService.fetchChallenges(queryParams);
      let list = res?.challenges || (Array.isArray(res) ? res : []) || (res?.data?.challenges || []);
      if (nodalDistrict && nodalDistrict !== 'All' && nodalDistrict !== 'All Districts') {
        list = list.filter((c) => {
          const dist = c.location?.district || c.district || c.assignedNodalOfficer?.district;
          return dist && dist.toLowerCase() === nodalDistrict.toLowerCase();
        });
      }
      setChallenges(list);
    } catch (err) {
      console.warn('Error loading live citizen challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, [nodalDistrict]);

  const handleOpenTriage = (chl) => {
    setSelectedChallenge(chl);
    setIsAssignModalOpen(true);
  };

  const handleQuickReject = async (e, chl) => {
    e.stopPropagation();
    const reason = prompt('Enter official rejection reason for this problem statement:', 'Duplicate submission / Incomplete field data');
    if (!reason) return;

    try {
      const chlId = chl.challengeId || chl.id;
      await apiClient.patch(`citizen/challenges/${chlId}/triage`, {
        status: 'Rejected',
        remarks: `Rejected by State Nodal Cell: ${reason}`,
        priority: chl.priority || 'Low'
      });
      setToastMsg(`Problem statement ${chlId} marked as rejected.`);
      loadChallenges();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to reject challenge: ' + err.message);
    }
  };

  const handleQuickDelete = async (e, chl) => {
    e.stopPropagation();
    const chlId = chl.challengeId || chl.id;
    if (!window.confirm(`Are you sure you want to permanently delete / dismiss ${chlId} from the State Innovation Registry?`)) {
      return;
    }

    try {
      setDeletingId(chlId);
      await citizenService.deleteChallenge(chlId);
      setToastMsg(`Problem statement ${chlId} deleted successfully.`);
      loadChallenges();
      setTimeout(() => setToastMsg(''), 4000);
    } catch (err) {
      alert('Failed to delete challenge: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTriageSuccess = (updatedData) => {
    if (updatedData?.deleted) {
      setToastMsg(`Problem statement deleted from database.`);
    } else {
      setToastMsg(`Problem statement successfully updated & synchronized!`);
    }
    loadChallenges();
    setTimeout(() => setToastMsg(''), 5000);
  };

  const filteredChallenges = filterChallengesList({
    challenges,
    statusFilter,
    domainFilter,
    districtFilter,
    priorityFilter,
    searchTerm
  });

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    domainFilter,
    setDomainFilter,
    districtFilter,
    setDistrictFilter,
    priorityFilter,
    setPriorityFilter,
    chatChallenge,
    setChatChallenge,
    challenges,
    loading,
    selectedChallenge,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedDossierChallenge,
    setSelectedDossierChallenge,
    toastMsg,
    deletingId,
    viewMode,
    setViewMode,
    loadChallenges,
    handleOpenTriage,
    handleQuickReject,
    handleQuickDelete,
    handleTriageSuccess,
    filteredChallenges
  };
};

export default useNodalChallenges;
