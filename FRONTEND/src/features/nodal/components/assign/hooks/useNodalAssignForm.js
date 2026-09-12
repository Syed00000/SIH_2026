import { useState, useEffect } from 'react';
import { useAssignDataLoader } from './useAssignDataLoader.js';
import { getInitialAssignState, buildTriagePayload, submitTriageUpdate } from '../assignPayload.helper.js';

export const useNodalAssignForm = ({
  initialChallenge,
  onClose,
  onSuccess
}) => {
  const {
    departments,
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
  } = useAssignDataLoader({ initialChallenge, onSuccess, onClose });

  const [submitting, setSubmitting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('Verified');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  
  const [departmentLevel, setDepartmentLevel] = useState('State Ministry');
  const [selectedDeptId, setSelectedDeptId] = useState('');
  
  const [nodalRemarks, setNodalRemarks] = useState('');
  const [clarificationResponse, setClarificationResponse] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (activeChallenge) {
      const state = getInitialAssignState(activeChallenge);
      setSelectedDomain(state.domain);
      setSelectedPriority(state.priority);
      setNodalRemarks(state.remarks);
      setClarificationResponse(state.clarification);
      setDepartmentLevel(state.departmentLevel);
      setSelectedDeptId(state.deptId);
      setVerificationStatus(state.verification);
    }
  }, [activeChallenge]);

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

    if (verificationStatus === 'Verified' && !selectedDeptId) {
      setErrorMsg('Please select a target department for verified problems.');
      return;
    }

    if (verificationStatus === 'Needs Clarification' && !clarificationResponse.trim()) {
      setErrorMsg('Please provide clarification details for the citizen.');
      return;
    }

    const targetDept = departments.find(d => (d.deptId || d.id || d._id) === selectedDeptId);

    const payload = buildTriagePayload({
      verificationStatus,
      selectedDomain,
      selectedPriority,
      selectedDeptId,
      targetDept,
      departmentLevel,
      nodalRemarks,
      clarificationResponse
    });

    try {
      setSubmitting(true);
      setErrorMsg('');
      const challengeId = activeChallenge.challengeId || activeChallenge.id;
      
      const updated = await submitTriageUpdate(challengeId, payload);
      
      if (onSuccess) onSuccess(updated);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit triage assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    departments,
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
    departmentLevel,
    setDepartmentLevel,
    selectedDeptId,
    setSelectedDeptId,
    nodalRemarks,
    setNodalRemarks,
    clarificationResponse,
    setClarificationResponse,
    errorMsg,
    isConfirmingDelete,
    setIsConfirmingDelete,
    deleting,
    handleSelectChallengeChange,
    handleDeleteChallenge,
    handleFormSubmit
  };
};

export default useNodalAssignForm;
