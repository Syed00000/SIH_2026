import { useState, useEffect } from 'react';
import { citizenService } from '../../../../citizen/services/citizenService.js';
import { universityService } from '../../../../government/services/universityService.js';
import { useDelayedLoading } from '../../../../../shared/hooks/useDelayedLoading.js';

export const useNodalOverviewData = (nodalDistrict = '') => {
  const [stats, setStats] = useState({
    submitted: 0,
    underReview: 0,
    inProgress: 0,
    resolved: 0,
    total: 0,
    clarificationRequested: 0
  });
  const [allChallenges, setAllChallenges] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const showSkeleton = useDelayedLoading(loading, 200);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const queryParams = { limit: 150 };
      if (nodalDistrict && nodalDistrict !== 'All' && nodalDistrict !== 'All Districts') {
        queryParams.district = nodalDistrict;
      }

      const [statsRes, challengesRes, unisRes] = await Promise.all([
        citizenService.fetchStats(nodalDistrict && nodalDistrict !== 'All' ? { district: nodalDistrict } : {}),
        citizenService.fetchChallenges(queryParams),
        universityService.getUniversities({ limit: 100 })
      ]);

      let challengesList =
        challengesRes?.challenges || (Array.isArray(challengesRes) ? challengesRes : []) || [];

      const unisList = unisRes?.universities || (Array.isArray(unisRes) ? unisRes : []) || [];

      if (nodalDistrict && nodalDistrict !== 'All' && nodalDistrict !== 'All Districts') {
        challengesList = challengesList.filter((c) => {
          const dist = c.location?.district || c.district || c.assignedNodalOfficer?.district;
          return dist && dist.toLowerCase() === nodalDistrict.toLowerCase();
        });
      }

      setAllChallenges(challengesList);
      setUniversities(unisList);

      const total = challengesList.length;
      const clarificationRequested = challengesList.filter((c) => {
        const acc = c.assignedUniversity?.acceptanceStatus || c.acceptanceStatus;
        return (
          c.status === 'Clarification Requested' ||
          acc === 'Clarification Requested' ||
          Boolean(c.clarificationQuery && c.clarificationStatus !== 'RESOLVED')
        );
      }).length;

      const underReview = challengesList.filter((c) => {
        const acc = c.assignedUniversity?.acceptanceStatus || c.acceptanceStatus;
        const isClar =
          c.status === 'Clarification Requested' ||
          acc === 'Clarification Requested' ||
          Boolean(c.clarificationQuery && c.clarificationStatus !== 'RESOLVED');
        if (isClar) return false;
        return (
          c.status === 'Submitted' ||
          c.status === 'Under Review' ||
          !c.assignedUniversity?.id ||
          acc === 'Pending Review' ||
          acc === 'Not Assigned'
        );
      }).length;

      const inProgress = challengesList.filter((c) => {
        const acc = c.assignedUniversity?.acceptanceStatus || c.acceptanceStatus;
        const isClar =
          c.status === 'Clarification Requested' ||
          acc === 'Clarification Requested' ||
          Boolean(c.clarificationQuery && c.clarificationStatus !== 'RESOLVED');
        if (isClar) return false;
        return (
          acc === 'Accepted' ||
          (c.status === 'In Progress' && acc !== 'Declined' && acc !== 'Pending Review')
        );
      }).length;

      const resolved = challengesList.filter((c) => c.status === 'Resolved').length;

      setStats({
        total,
        underReview,
        clarificationRequested,
        inProgress,
        resolved
      });
    } catch (err) {
      console.warn('Error loading nodal dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [nodalDistrict]);

  const handleOpenAssignModal = (chl) => {
    setSelectedChallenge(chl);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedChallenge(null);
  };

  return {
    stats,
    allChallenges,
    universities,
    loading: showSkeleton,
    selectedChallenge,
    isAssignModalOpen,
    loadData,
    handleOpenAssignModal,
    handleCloseAssignModal
  };
};

export default useNodalOverviewData;
