export const resolveChatParticipants = (challenge, currentUser, isUniversityView = true) => {
  const challengeId = challenge?.challengeId || challenge?.id || 'NA';
  const uniCode = challenge?.assignedUniversity?.id || challenge?.universityCode || currentUser?.profile?.code || 'RU001';
  const uniName = challenge?.assignedUniversity?.name || challenge?.universityName || currentUser?.profile?.institutionName || currentUser?.profile?.universityName || 'Ranchi University';
  const uniLeadDesignation = 'University Administration';

  const nodalAdminName = 'State Nodal Officer';
  const nodalDesignation = 'State Nodal Officer';
  const nodalDepartment = 'Dept. of Higher & Technical Education, Govt. of Jharkhand';
  const nodalPhone = challenge?.allocatedBy?.phone || challenge?.allocatedBy?.mobileNumber || '+91 9876543210';

  const userRole = isUniversityView ? 'UNIVERSITY' : 'NODAL';
  const userName = isUniversityView ? uniName : 'State Nodal Officer';

  const s = String(challenge?.status || '').toLowerCase();
  const acc = String(challenge?.assignedUniversity?.acceptanceStatus || challenge?.acceptanceStatus || '').toLowerCase();
  const isAccepted = s.includes('accept') || acc === 'accepted' || s === 'in progress' || s === 'active' || s === 'completed';
  const isDeclined = s.includes('reject') || s.includes('decline') || acc === 'declined';

  return {
    challengeId,
    uniCode,
    uniName,
    uniLeadDesignation,
    nodalAdminName,
    nodalDesignation,
    nodalDepartment,
    nodalPhone,
    userRole,
    userName,
    isAccepted,
    isDeclined
  };
};

export default resolveChatParticipants;
