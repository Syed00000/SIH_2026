import { useState, useEffect } from 'react';
import { citizenService } from '../../../../citizen/services/citizenService.js';
import { fetchNodalAssignData } from '../assignPayload.helper.js';

export const useAssignDataLoader = ({ initialChallenge, targetUniversity, onSuccess, onClose }) => {
  const [universities, setUniversities] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(initialChallenge || null);
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const isUniversityTargetMode = Boolean(targetUniversity);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const { unis, chls } = await fetchNodalAssignData();
      setUniversities(unis);
      setAllChallenges(chls);

      if (isUniversityTargetMode) {
        const firstChl = initialChallenge || chls.find((c) => !c.assignedUniversity?.id && c.status !== 'Resolved') || chls[0];
        if (firstChl) {
          setActiveChallenge(firstChl);
          setSelectedChallengeId(firstChl.challengeId || firstChl.id);
        }
      } else if (initialChallenge) {
        setActiveChallenge(initialChallenge);
        setSelectedChallengeId(initialChallenge.challengeId || initialChallenge.id);
      }
    } catch (err) {
      console.warn('Error loading nodal assign prerequisites:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialChallenge, targetUniversity]);

  const handleSelectChallengeChange = (e) => {
    const id = e.target.value;
    setSelectedChallengeId(id);
    const found = allChallenges.find((c) => (c.challengeId || c.id) === id);
    if (found) setActiveChallenge(found);
  };

  const handleDeleteChallenge = async () => {
    if (!activeChallenge) return;
    const chlId = activeChallenge.challengeId || activeChallenge.id;
    try {
      setDeleting(true);
      await citizenService.deleteChallenge(chlId);
      if (onSuccess) onSuccess({ deleted: true, challengeId: chlId });
      onClose();
    } catch (err) {
      setDeleteError('Failed to delete challenge: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  return {
    universities,
    allChallenges,
    loadingData,
    activeChallenge,
    selectedChallengeId,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleting,
    deleteError,
    isUniversityTargetMode,
    handleSelectChallengeChange,
    handleDeleteChallenge
  };
};

export default useAssignDataLoader;
