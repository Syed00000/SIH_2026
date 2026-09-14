import { useState, useEffect } from 'react';
import { universityApiService } from '../../../services/universityApiService.js';
import { useDelayedLoading } from '../../../../../shared/hooks/useDelayedLoading.js';

export const useUniversityDashboard = ({
  initialData,
  universityCode = 'RU001',
  onUpdateChallenge
}) => {
  const [dashboardData, setDashboardData] = useState(initialData);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [dossierChallenge, setDossierChallenge] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(!initialData);
  const showSkeleton = useDelayedLoading(loading, 200);

  const loadLiveDashboard = async () => {
    setLoading(true);
    const summary = await universityApiService.getDashboardSummary(universityCode);
    if (summary) {
      setDashboardData(summary);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialData) {
      setDashboardData(initialData);
      setLoading(false);
    } else {
      loadLiveDashboard();
    }
  }, [initialData, universityCode]);

  const handleAcceptChallenge = async (challenge) => {
    const cid = challenge.id || challenge.challengeId;
    await universityApiService.updateChallengeStatus(cid, universityCode, 'Accepted', 'View');
    await loadLiveDashboard();
  };

  const handleDeclineChallenge = async (challenge, reason) => {
    const cid = challenge.id || challenge.challengeId;
    await universityApiService.updateChallengeStatus(cid, universityCode, 'Declined', 'Declined', { declineReason: reason });
    await loadLiveDashboard();
  };

  const handleAssignFaculty = async (payload) => {
    const facObj = {
      name: payload.name || payload.facultyName,
      department: payload.department,
      email: payload.email || payload.facultyEmail || ''
    };
    if (onUpdateChallenge) {
      await onUpdateChallenge({ ...payload, ...facObj });
    } else {
      await universityApiService.assignFaculty(payload.challengeId, universityCode, facObj);
    }
    await loadLiveDashboard();
  };

  const handleClearActivities = async () => {
    await universityApiService.clearActivities(universityCode);
    setDashboardData((prev) => ({ ...prev, recentActivity: [], recentActivities: [] }));
  };

  return {
    dashboardData,
    selectedChallenge,
    setSelectedChallenge,
    dossierChallenge,
    setDossierChallenge,
    isModalOpen,
    setIsModalOpen,
    loading: showSkeleton,
    handleAcceptChallenge,
    handleDeclineChallenge,
    handleAssignFaculty,
    handleClearActivities
  };
};

export default useUniversityDashboard;
