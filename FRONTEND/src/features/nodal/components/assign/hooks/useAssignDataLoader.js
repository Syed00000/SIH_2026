import { useState, useEffect } from 'react';
import { citizenService } from '../../../../citizen/services/citizenService.js';
import { fetchNodalAssignData } from '../assignPayload.helper.js';

export const useAssignDataLoader = ({ initialChallenge, onSuccess, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [allChallenges, setAllChallenges] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [activeChallenge, setActiveChallenge] = useState(initialChallenge || null);
  const [selectedChallengeId, setSelectedChallengeId] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadData = async () => {
    setLoadingData(true);
    try {
      const { depts, chls, unis } = await fetchNodalAssignData();
      setDepartments(depts);
      setUniversities(unis || []);
      setAllChallenges(chls);

      if (initialChallenge) {
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
  }, [initialChallenge]);

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
    departments,
    universities,
    allChallenges,
    loadingData,
    activeChallenge,
    selectedChallengeId,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleting,
    deleteError,
    handleSelectChallengeChange,
    handleDeleteChallenge
  };
};

export default useAssignDataLoader;
