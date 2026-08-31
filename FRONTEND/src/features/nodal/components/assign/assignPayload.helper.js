import apiClient from '../../../../infrastructure/api/client.js';
import { universityService } from '../../../government/services/universityService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';

export const fetchNodalAssignData = async () => {
  const [uniRes, chlRes] = await Promise.all([
    universityService.getUniversities({ limit: 100 }),
    citizenService.fetchChallenges({ limit: 150 })
  ]);
  const unis = uniRes?.records || [];
  const chls = chlRes?.challenges || (Array.isArray(chlRes) ? chlRes : []) || [];
  return { unis, chls };
};

export const getInitialAssignState = (activeChallenge, isUniversityTargetMode) => {
  if (!activeChallenge) {
    return {
      domain: 'Water Resources',
      priority: 'Medium',
      remarks: '',
      clarification: '',
      uniCode: '',
      department: '',
      acceptance: 'Pending Review',
      verification: 'Verified'
    };
  }

  let verification = 'Verified';
  if (activeChallenge.status === 'Clarification Requested') verification = 'Needs Clarification';
  else if (activeChallenge.status === 'Rejected') verification = 'Rejected';
  else if (activeChallenge.status === 'Under Review' && !activeChallenge.assignedUniversity?.id) verification = 'Under Review';

  return {
    domain: activeChallenge.domain || 'Water Resources',
    priority: activeChallenge.priority || 'Medium',
    remarks: activeChallenge.triageRemarks || '',
    clarification: activeChallenge.clarificationQuery || '',
    uniCode: !isUniversityTargetMode ? (activeChallenge.assignedUniversity?.id || '') : '',
    department: !isUniversityTargetMode ? (activeChallenge.assignedUniversity?.department || '') : '',
    acceptance: !isUniversityTargetMode ? (activeChallenge.assignedUniversity?.acceptanceStatus || 'Pending Review') : 'Pending Review',
    verification
  };
};

export const buildTriagePayload = ({
  verificationStatus,
  selectedDomain,
  selectedPriority,
  selectedUniCode,
  targetUni,
  targetDepartment,
  acceptanceStatus,
  nodalRemarks,
  clarificationResponse
}) => {
  const status =
    verificationStatus === 'Verified'
      ? 'In Progress'
      : verificationStatus === 'Needs Clarification'
      ? 'Clarification Requested'
      : verificationStatus === 'Rejected'
      ? 'Rejected'
      : 'Under Review';

  const assignedUniversity = selectedUniCode
    ? {
        id: selectedUniCode,
        name: targetUni?.name || selectedUniCode,
        department: targetDepartment,
        assignedAt: new Date().toISOString(),
        assignedBy: 'State Nodal Operations Center',
        acceptanceStatus: acceptanceStatus
      }
    : null;

  return {
    domain: selectedDomain,
    priority: selectedPriority,
    status,
    assignedUniversity,
    triageRemarks: nodalRemarks,
    clarificationQuery: verificationStatus === 'Needs Clarification' ? clarificationResponse : undefined
  };
};

export const submitTriageUpdate = async (challengeId, payload) => {
  const res = await apiClient.patch(`citizen/challenges/${challengeId}/triage`, payload);
  return res.data?.data || res.data || payload;
};

export default {
  fetchNodalAssignData,
  getInitialAssignState,
  buildTriagePayload,
  submitTriageUpdate
};
