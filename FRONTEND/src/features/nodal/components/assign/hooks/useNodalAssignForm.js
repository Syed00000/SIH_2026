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
    if (activeChallenge || targetUniversity) {
      const state = getInitialAssignState(activeChallenge, targetUniversity);
      setSelectedDomain(state.domain);
      setSelectedPriority(state.priority);
      setNodalRemarks(state.remarks);
      setClarificationResponse(state.clarification);
      setDepartmentLevel(state.departmentLevel);
      setSelectedDeptId(state.deptId);
      setVerificationStatus(state.verification);
    }
  }, [activeChallenge, targetUniversity]);

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
      setErrorMsg(departmentLevel === 'University / HEI' ? 'Please select a target university / HEI.' : 'Please select a target department for verified problems.');
      return;
    }

    if (verificationStatus === 'Needs Clarification' && !clarificationResponse.trim()) {
      setErrorMsg('Please provide clarification details for the citizen.');
      return;
    }

    const targetDept = departments.find(d => (d.deptId || d.id || d._id) === selectedDeptId);
    const targetUni = universities.find(u => (u.code === selectedDeptId || u.aisheCode === selectedDeptId || u._id === selectedDeptId || u.id === selectedDeptId));

    const payload = buildTriagePayload({
      verificationStatus,
      selectedDomain,
      selectedPriority,
      selectedDeptId,
      targetDept,
      targetUni,
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
