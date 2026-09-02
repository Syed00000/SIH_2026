export function formatChallengeItem(c, { code, uniName, defaultNodalUser } = {}) {
  const loc = c.location || c.locationDetails || {};
  const district = loc.district || c.district || '';
  const block = loc.block || loc.subDivision || '';
  const subDivision = loc.subDivision || loc.block || '';
  const panchayatOrWard = loc.panchayatOrWard || loc.gramPanchayat || loc.ward || '';
  const landmark = loc.landmark || '';
  const pincode = loc.pincode || '';
  const state = loc.state || '';
  const coordinates = loc.coordinates || '';
  const fullAddress = loc.fullAddress || [
    landmark,
    panchayatOrWard,
    block,
    district,
    state,
    pincode
  ].filter(Boolean).join(', ') || district;

  const rawPhone = c.submitter?.mobileNumber || '';
  const maskedMobile = rawPhone && rawPhone.length >= 4
    ? `+91 ******${rawPhone.slice(-4)}`
    : (rawPhone || '');

  const accStatus = c.assignedUniversity?.acceptanceStatus || c.acceptanceStatus || (c.status === 'Accepted' ? 'Accepted' : c.status === 'Declined' ? 'Declined' : 'Pending Review');

  const assignedUni = {
    id: c.assignedUniversity?.id || c.universityCode || code || '',
    name: c.assignedUniversity?.name || uniName || '',
    department: c.assignedUniversity?.department || c.assignedFaculty?.department || '',
    mentorName: c.assignedUniversity?.mentorName || c.assignedFaculty?.name || '',
    assignedAt: c.assignedUniversity?.assignedAt || c.assignedOn || c.submittedAt || c.createdAt || new Date(),
    acceptanceStatus: accStatus,
    declineReason: c.assignedUniversity?.declineReason || c.declineReason || ''
  };

  const assignedFac = (c.assignedFaculty?.name || c.assignedUniversity?.mentorName) ? {
    name: c.assignedFaculty?.name || c.assignedUniversity?.mentorName || '',
    department: c.assignedFaculty?.department || assignedUni.department || '',
    email: c.assignedFaculty?.email || c.assignedUniversity?.mentorEmail || '',
    designation: c.assignedFaculty?.designation || ''
  } : null;

  const realNodalName = c.allocatedBy?.name || defaultNodalUser?.fullName || defaultNodalUser?.name || '';
  const realNodalPhone = c.allocatedBy?.phone || c.allocatedBy?.mobileNumber || defaultNodalUser?.mobileNumber || defaultNodalUser?.phone || '';
  const realNodalEmail = c.allocatedBy?.email || defaultNodalUser?.email || '';
  const realNodalDesignation = c.allocatedBy?.designation || defaultNodalUser?.designation || '';
  const realNodalDepartment = c.allocatedBy?.department || defaultNodalUser?.department || '';

  const allocatedByInfo = {
    name: realNodalName,
    phone: realNodalPhone ? (String(realNodalPhone).startsWith('+91') ? realNodalPhone : `+91 ${realNodalPhone}`) : '',
    mobileNumber: realNodalPhone ? (String(realNodalPhone).startsWith('+91') ? realNodalPhone : `+91 ${realNodalPhone}`) : '',
    email: realNodalEmail,
    designation: realNodalDesignation,
    department: realNodalDepartment
  };

  return {
    challengeId: c.challengeId || c.id,
    id: c.challengeId || c.id,
    universityCode: code || c.universityCode || '',
    title: c.title || '',
    domain: c.domain || '',
    district,
    state,
    priority: c.priority || 'Medium',
    status: accStatus === 'Accepted'
      ? 'Accepted'
      : accStatus === 'Declined'
        ? 'Declined'
        : accStatus === 'Clarified' || c.status === 'Clarified'
          ? 'Clarified'
          : accStatus === 'Clarification Requested' || c.status === 'Clarification Requested'
            ? 'Clarification Requested'
            : 'Pending',
    acceptanceStatus: accStatus,
    declineReason: assignedUni.declineReason,
    clarificationQuery: c.clarificationQuery || c.assignedUniversity?.clarificationQuery || '',
    clarificationResponse: c.clarificationResponse || '',
    clarificationStatus: c.clarificationStatus || (c.clarificationResponse ? 'RESOLVED' : c.clarificationQuery ? 'PENDING' : 'NONE'),
    clarificationDate: c.clarificationDate || null,
    assignedOn: assignedUni.assignedAt,
    deadline: c.deadline || '',
    problemStatement: c.problemStatement || c.description || '',
    description: c.description || c.problemStatement || '',
    affectedPopulation: c.affectedPopulation || c.impactMetrics?.affectedPopulation || '',
    aiCategory: c.aiCategory || c.domain || '',
    requiredSkills: c.requiredSkills?.length ? c.requiredSkills : [],
    submitter: {
      name: c.submitter?.name || '',
      role: c.submitter?.role || 'Citizen',
      mobileNumber: maskedMobile,
      maskedMobile: maskedMobile,
      isVerified: Boolean(c.citizenId || c.submitter?.mobileNumber),
      email: c.submitter?.email || '',
      organization: c.submitter?.organization || ''
    },
    location: { state, district, block, subDivision, panchayatOrWard, landmark, pincode, fullAddress, coordinates },
    locationDetails: { state, district, block, subDivision, panchayatOrWard, landmark, pincode, fullAddress, coordinates },
    allocatedBy: allocatedByInfo,
    nodalOfficer: allocatedByInfo,
    assignedUniversity: assignedUni,
    assignedFaculty: assignedFac,
    milestones: c.milestones || [],
    mediaUrls: c.mediaUrls || [],
    actionLabel: accStatus === 'Accepted' ? 'View' : accStatus === 'Declined' ? 'Declined' : 'Review'
  };
}
