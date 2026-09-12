import apiClient from '../../../../infrastructure/api/client.js';
import { departmentService } from '../../../government/services/departmentService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';

export const fetchNodalAssignData = async () => {
  const [deptRes, chlRes] = await Promise.all([
    departmentService.getDepartments(),
    citizenService.fetchChallenges({ limit: 150 })
  ]);
  const depts = Array.isArray(deptRes) ? deptRes : (Array.isArray(deptRes?.data) ? deptRes.data : []);
  const chls = chlRes?.challenges || (Array.isArray(chlRes) ? chlRes : []) || [];
  return { depts, chls };
};

export const getInitialAssignState = (activeChallenge) => {
  if (!activeChallenge) {
    return {
      domain: 'Water Resources',
      priority: 'Medium',
      remarks: '',
      clarification: '',
      deptId: '',
      departmentLevel: 'State Ministry',
      verification: 'Verified'
    };
  }

  let verification = 'Verified';
  if (activeChallenge.status === 'Clarification Requested') verification = 'Needs Clarification';
  else if (activeChallenge.status === 'Rejected') verification = 'Rejected';
  else if (activeChallenge.status === 'Under Review' && !activeChallenge.assignedDepartment?.id) verification = 'Under Review';

  let assignedLevel = 'State Ministry';
  let assignedId = '';
  
  if (activeChallenge.assignedDepartment?.id) {
    assignedId = activeChallenge.assignedDepartment.id;
    assignedLevel = activeChallenge.assignedDepartment.level || 'State Ministry';
  } else if (activeChallenge.assignedWard?.id) {
    assignedId = activeChallenge.assignedWard.id;
    assignedLevel = 'Ward Commissioner';
  } else if (activeChallenge.assignedBlock?.id) {
    assignedId = activeChallenge.assignedBlock.id;
    assignedLevel = 'Block / Tehsil Office';
  }

  return {
    domain: activeChallenge.domain || 'Water Resources',
    priority: activeChallenge.priority || 'Medium',
    remarks: activeChallenge.triageRemarks || '',
    clarification: activeChallenge.clarificationQuery || '',
    deptId: assignedId,
    departmentLevel: assignedLevel,
    verification
  };
};

export const buildTriagePayload = ({
  verificationStatus,
  selectedDomain,
  selectedPriority,
  selectedDeptId,
  targetDept,
  departmentLevel,
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

  const assignmentDetails = selectedDeptId
    ? {
        id: selectedDeptId,
        deptId: targetDept?.deptId || selectedDeptId,
        name: targetDept?.name || selectedDeptId,
        level: departmentLevel,
        category: departmentLevel,
        assignedAt: new Date().toISOString(),
        assignedBy: 'State Nodal Operations Center'
      }
    : null;

  const payload = {
    domain: selectedDomain,
    priority: selectedPriority,
    status,
    triageRemarks: nodalRemarks,
    clarificationQuery: verificationStatus === 'Needs Clarification' ? clarificationResponse : undefined
  };

  // Assign to the correct field based on department level
  if (departmentLevel === 'Ward Commissioner' || departmentLevel === 'Gram Panchayat') {
    payload.assignedWard = assignmentDetails;
    payload.assignedDepartment = null;
    payload.assignedBlock = null;
  } else if (departmentLevel === 'Block / Tehsil Office') {
    payload.assignedBlock = assignmentDetails;
    payload.assignedDepartment = null;
    payload.assignedWard = null;
  } else {
    payload.assignedDepartment = assignmentDetails;
    payload.assignedBlock = null;
    payload.assignedWard = null;
  }

  return payload;
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
