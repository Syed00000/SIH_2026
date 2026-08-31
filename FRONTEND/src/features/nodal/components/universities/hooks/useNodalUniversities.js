import { useState, useEffect } from 'react';
import { universityService } from '../../../../government/services/universityService.js';
import { citizenService } from '../../../../citizen/services/citizenService.js';

export const useNodalUniversities = () => {
  const [universities, setUniversities] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAllocationStatus, setFilterAllocationStatus] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [selectedUniForDetails, setSelectedUniForDetails] = useState(null);

  // Modal states
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [selectedUniForAllocation, setSelectedUniForAllocation] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [uniRes, challengeRes] = await Promise.all([
        universityService.getUniversities({ limit: 100 }),
        citizenService.fetchChallenges({ limit: 200 })
      ]);

      const fetchedUnis = uniRes?.records || [];
      setUniversities(fetchedUnis);

      const chlList = challengeRes?.challenges || (Array.isArray(challengeRes) ? challengeRes : []) || [];
      setChallenges(chlList);
    } catch (err) {
      console.warn('Error loading universities in Nodal panel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getAssignedChallengesForUni = (uni) => {
    if (!uni) return [];
    const uniCode = (uni.code || '').toUpperCase();
    const uniName = (uni.name || uni.legalName || '').toLowerCase();

    return challenges.filter((c) => {
      const assignedId = (c.assignedUniversity?.id || '').toUpperCase();
      const assignedName = (c.assignedUniversity?.name || '').toLowerCase();
      if (assignedId && (assignedId === uniCode || uniCode.includes(assignedId))) return true;
      if (assignedName && (assignedName.includes(uniName) || uniName.includes(assignedName))) return true;
      return false;
    });
  };

  const handleAllocateNewToUni = (e, uni) => {
    e.stopPropagation();
    setSelectedUniForAllocation(uni);
    setSelectedChallenge(null);
    setIsAssignModalOpen(true);
  };

  const handleTriageSuccess = (updatedData) => {
    if (updatedData?.deleted) {
      setToastMsg(`Problem statement deleted from database.`);
    } else {
      setToastMsg(`Problem successfully allocated to ${updatedData.assignedUniversity?.name || selectedUniForAllocation?.name || 'University'}!`);
    }
    loadData();
    setTimeout(() => setToastMsg(''), 5000);
  };

  const filteredUniversities = universities.filter((uni) => {
    const assigned = getAssignedChallengesForUni(uni);
    if (filterAllocationStatus === 'Assigned' && assigned.length === 0) return false;
    if (filterAllocationStatus === 'Unassigned' && assigned.length > 0) return false;
    if (filterDistrict !== 'All' && uni.district !== filterDistrict) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        (uni.name || '').toLowerCase().includes(q) ||
        (uni.code || '').toLowerCase().includes(q) ||
        (uni.district || '').toLowerCase().includes(q) ||
        (uni.nodalOfficer?.name || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return {
    universities,
    challenges,
    loading,
    searchTerm,
    setSearchTerm,
    filterAllocationStatus,
    setFilterAllocationStatus,
    filterDistrict,
    setFilterDistrict,
    selectedUniForDetails,
    setSelectedUniForDetails,
    selectedChallenge,
    selectedUniForAllocation,
    isAssignModalOpen,
    setIsAssignModalOpen,
    toastMsg,
    loadData,
    getAssignedChallengesForUni,
    handleAllocateNewToUni,
    handleTriageSuccess,
    filteredUniversities
  };
};

export default useNodalUniversities;
