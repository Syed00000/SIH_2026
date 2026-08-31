import { useState, useEffect } from 'react';
import { citizenService } from '../../../../citizen/services/citizenService.js';
import { universityService } from '../../../../government/services/universityService.js';

export const useNodalOverviewData = () => {
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
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, challengesRes, unisRes] = await Promise.all([
        citizenService.fetchStats(),
        citizenService.fetchChallenges({ limit: 100 }),
        universityService.getUniversities({ limit: 100 })
      ]);

      const challengesList =
        challengesRes?.challenges || (Array.isArray(challengesRes) ? challengesRes : []) || [];
      const unisList = unisRes?.records || [];

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
        total: total || statsRes?.activities?.total || 0,
        underReview: underReview || statsRes?.activities?.underReview || statsRes?.activities?.submitted || 0,
        clarificationRequested: clarificationRequested || statsRes?.activities?.clarificationRequested || 0,
        inProgress: inProgress || statsRes?.activities?.inProgress || 0,
        resolved: resolved || statsRes?.activities?.resolved || 0
      });
    } catch (err) {
      console.warn('Error loading nodal dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    loading,
    selectedChallenge,
    isAssignModalOpen,
    loadData,
    handleOpenAssignModal,
    handleCloseAssignModal
  };
};

export default useNodalOverviewData;
