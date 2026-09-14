import apiClient from '../../../../infrastructure/api/client.js';
import { departmentService } from '../../../government/services/departmentService.js';
import { citizenService } from '../../../citizen/services/citizenService.js';
import { universityService } from '../../../government/services/universityService.js';

export const fetchNodalAssignData = async () => {
  const [deptRes, chlRes, uniRes] = await Promise.all([
    departmentService.getDepartments(),
    citizenService.fetchChallenges({ limit: 150 }),
    universityService.getUniversities({ limit: 100 })
  ]);
  const depts = Array.isArray(deptRes) ? deptRes : (Array.isArray(deptRes?.data) ? deptRes.data : []);
  const chls = chlRes?.challenges || (Array.isArray(chlRes) ? chlRes : []) || [];
  const unis = uniRes?.records || (Array.isArray(uniRes) ? uniRes : []) || [];
  return { depts, chls, unis };
};

export const getInitialAssignState = (activeChallenge, targetUniversity) => {
  if (targetUniversity) {
    const uniId = targetUniversity.code || targetUniversity.aisheCode || targetUniversity._id || targetUniversity.id || '';
    return {
      domain: activeChallenge?.domain || 'Water Resources',
      priority: activeChallenge?.priority || 'Medium',
      remarks: activeChallenge?.triageRemarks || '',
      clarification: activeChallenge?.clarificationQuery || '',
      deptId: uniId,
      departmentLevel: 'University / HEI',
      verification: 'Verified'
    };
  }

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
  else if (activeChallenge.status === 'Under Review' && !activeChallenge.assignedDepartment?.id && !activeChallenge.assignedUniversity?.id) verification = 'Under Review';

  let assignedLevel = 'State Ministry';
  let assignedId = '';
  
  if (activeChallenge.assignedUniversity?.id || activeChallenge.assignedUniversity?.name) {
    assignedId = activeChallenge.assignedUniversity.code || activeChallenge.assignedUniversity.id || activeChallenge.assignedUniversity.name || '';
    assignedLevel = 'University / HEI';
  } else if (activeChallenge.assignedDepartment?.id) {
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
  targetUni,
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

  const payload = {
    domain: selectedDomain,
    priority: selectedPriority,
    status,
    triageRemarks: nodalRemarks,
    clarificationQuery: verificationStatus === 'Needs Clarification' ? clarificationResponse : undefined
  };

  if (departmentLevel === 'University / HEI') {
    const uniCode = targetUni?.code || targetUni?.aisheCode || selectedDeptId;
    const uniName = targetUni?.name || selectedDeptId;
    payload.assignedUniversity = selectedDeptId
      ? {
          id: uniCode,
          code: uniCode,
          aisheCode: targetUni?.aisheCode || uniCode,
          name: uniName,
          district: targetUni?.district || '',
          department: targetUni?.category || 'Innovation & R&D Cell',
          mentorName: '',
          assignedAt: new Date().toISOString(),
          assignedBy: 'State Nodal Operations Center',
          acceptanceStatus: 'Pending Review'
        }
      : null;
    payload.assignedDepartment = null;
    payload.assignedBlock = null;
    payload.assignedWard = null;
    return payload;
  }

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

  // Assign to the correct field based on department level
  if (departmentLevel === 'Ward Commissioner' || departmentLevel === 'Gram Panchayat') {
    payload.assignedWard = assignmentDetails;
    payload.assignedDepartment = null;
    payload.assignedBlock = null;
    payload.assignedUniversity = null;
  } else if (departmentLevel === 'Block / Tehsil Office') {
    payload.assignedBlock = assignmentDetails;
    payload.assignedDepartment = null;
    payload.assignedWard = null;
    payload.assignedUniversity = null;
  } else {
    payload.assignedDepartment = assignmentDetails;
    payload.assignedBlock = null;
    payload.assignedWard = null;
    payload.assignedUniversity = null;
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
