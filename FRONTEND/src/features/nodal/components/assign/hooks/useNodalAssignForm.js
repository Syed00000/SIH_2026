import { useState, useEffect } from 'react';
import { useAssignDataLoader } from './useAssignDataLoader.js';
import { getInitialAssignState, buildTriagePayload, submitTriageUpdate } from '../assignPayload.helper.js';

export const useNodalAssignForm = ({
  initialChallenge,
  targetUniversity,
  onClose,
  onSuccess
}) => {
  const {
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
  } = useAssignDataLoader({ initialChallenge, targetUniversity, onSuccess, onClose });

  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('Verified');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  const [selectedUniCode, setSelectedUniCode] = useState('');
  const [targetDepartment, setTargetDepartment] = useState('');
  const [nodalRemarks, setNodalRemarks] = useState('');
  const [clarificationResponse, setClarificationResponse] = useState('');
  const [acceptanceStatus, setAcceptanceStatus] = useState('Pending Review');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isUniversityTargetMode && targetUniversity) {
      setSelectedUniCode(targetUniversity.code || targetUniversity.aisheCode);
    }
  }, [isUniversityTargetMode, targetUniversity]);

  useEffect(() => {
    if (activeChallenge) {
      const state = getInitialAssignState(activeChallenge, isUniversityTargetMode);
      setSelectedDomain(state.domain);
      setSelectedPriority(state.priority);
      setNodalRemarks(state.remarks);
      setClarificationResponse(state.clarification);
      if (!isUniversityTargetMode) {
        setSelectedUniCode(state.uniCode);
        setTargetDepartment(state.department);
        setAcceptanceStatus(state.acceptance);
      }
      setVerificationStatus(state.verification);
    }
  }, [activeChallenge, isUniversityTargetMode]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!activeChallenge) {
      setErrorMsg('Please select a valid challenge to triage/allocate.');
      return;
    }

    if (activeChallenge.status === 'Withdrawn') {
      setErrorMsg('This problem statement has been withdrawn by the citizen and cannot be allocated or assigned.');
      return;
    }

    const chlId = activeChallenge.challengeId || activeChallenge.id;
    const targetUni = universities.find((u) => u.code === selectedUniCode || u.aisheCode === selectedUniCode);

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = buildTriagePayload({
        verificationStatus,
        selectedDomain,
        selectedPriority,
        selectedUniCode,
        targetUni,
        targetDepartment,
        acceptanceStatus,
        nodalRemarks,
        clarificationResponse
      });

      const updated = await submitTriageUpdate(chlId, payload);
      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err) {
      console.error('Failed to submit triage assignment:', err);
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update challenge triage.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    universities,
    allChallenges,
    loadingData,
    submitting,
    activeChallenge,
    selectedChallengeId,
    verificationStatus,
    setVerificationStatus,
    selectedDomain,
    setSelectedDomain,
    selectedPriority,
    setSelectedPriority,
    selectedUniCode,
    setSelectedUniCode,
    targetDepartment,
    setTargetDepartment,
    nodalRemarks,
    setNodalRemarks,
    clarificationResponse,
    setClarificationResponse,
    acceptanceStatus,
    setAcceptanceStatus,
    errorMsg: errorMsg || deleteError,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleting,
    isUniversityTargetMode,
    handleSelectChallengeChange,
    handleDeleteChallenge,
    handleFormSubmit
  };
};

export default useNodalAssignForm;
