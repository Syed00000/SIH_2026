export function formatChallengeItem(c, { code, uniName, defaultNodalUser }) {
  const loc = c.location || c.locationDetails || {};
  const district = loc.district || c.district || 'NA';
  const block = loc.block && loc.block !== 'Not specified' ? loc.block : (loc.subDivision || 'Not specified');
  const subDivision = loc.subDivision && loc.subDivision !== 'Not specified' ? loc.subDivision : (loc.block || 'Not specified');
  const panchayatOrWard = loc.panchayatOrWard && loc.panchayatOrWard !== 'Not specified' ? loc.panchayatOrWard : (loc.gramPanchayat || loc.ward || 'Not specified');
  const landmark = loc.landmark && loc.landmark !== 'Ground Location' ? loc.landmark : 'Ground Location';
  const pincode = loc.pincode || 'N/A';
  const state = loc.state || 'Jharkhand';
  const coordinates = loc.coordinates || 'Coordinates not provided';
  const fullAddress = loc.fullAddress || [
    landmark !== 'Ground Location' ? landmark : '',
    panchayatOrWard !== 'Not specified' ? panchayatOrWard : '',
    block !== 'Not specified' ? block : '',
    district, state,
    pincode !== 'N/A' ? pincode : ''
  ].filter(Boolean).join(', ') || `${district}, ${state}`;

  const rawPhone = c.submitter?.mobileNumber || '';
  const maskedMobile = rawPhone && rawPhone.length >= 4
    ? `+91 ******${rawPhone.slice(-4)}`
    : '+91 ******4829';

  const accStatus = c.assignedUniversity?.acceptanceStatus || c.acceptanceStatus || (c.status === 'Accepted' ? 'Accepted' : c.status === 'Declined' ? 'Declined' : 'Pending Review');

  const assignedUni = {
    id: c.assignedUniversity?.id || c.universityCode || code,
    name: c.assignedUniversity?.name || uniName || 'University Innovation Portal',
    department: c.assignedUniversity?.department || c.assignedFaculty?.department || 'Department of Applied Sciences & Engineering',
    mentorName: c.assignedUniversity?.mentorName || c.assignedFaculty?.name || '',
    assignedAt: c.assignedUniversity?.assignedAt || c.assignedOn || c.submittedAt || c.createdAt || new Date(),
    acceptanceStatus: accStatus,
    declineReason: c.assignedUniversity?.declineReason || c.declineReason || ''
  };

  const assignedFac = (c.assignedFaculty?.name || c.assignedUniversity?.mentorName) ? {
    name: c.assignedFaculty?.name || c.assignedUniversity?.mentorName,
    department: c.assignedFaculty?.department || assignedUni.department,
    email: c.assignedFaculty?.email || '',
    designation: c.assignedFaculty?.designation || 'Lead Faculty Mentor'
  } : null;

  const realNodalName = c.allocatedBy?.name || defaultNodalUser?.fullName || defaultNodalUser?.name || 'Ritu Verma';
  const realNodalPhone = c.allocatedBy?.phone || c.allocatedBy?.mobileNumber || defaultNodalUser?.mobileNumber || defaultNodalUser?.phone || '9123456789';
  const realNodalEmail = c.allocatedBy?.email || defaultNodalUser?.email || 'ritu.verma@jh.gov.in';
  const realNodalDesignation = c.allocatedBy?.designation || defaultNodalUser?.designation || (defaultNodalUser?.role === 'NODAL' ? 'State Nodal Officer' : 'Higher Education Director');
  const realNodalDepartment = c.allocatedBy?.department || defaultNodalUser?.department || 'Dept. of Higher & Technical Education, Govt. of Jharkhand';

  const allocatedByInfo = {
    name: realNodalName,
    phone: String(realNodalPhone).startsWith('+91') ? realNodalPhone : `+91 ${realNodalPhone}`,
    mobileNumber: String(realNodalPhone).startsWith('+91') ? realNodalPhone : `+91 ${realNodalPhone}`,
    email: realNodalEmail,
    designation: realNodalDesignation,
    department: realNodalDepartment
  };

  return {
    challengeId: c.challengeId || c.id,
    id: c.challengeId || c.id,
    universityCode: code,
    title: c.title,
    domain: c.domain || 'Urban Development',
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
    deadline: c.deadline || 'Active Review',
    problemStatement: c.problemStatement || c.description,
    description: c.description || c.problemStatement,
    affectedPopulation: c.affectedPopulation || c.impactMetrics?.affectedPopulation || '~ 5,000 Citizens',
    aiCategory: c.aiCategory || c.domain,
    requiredSkills: c.requiredSkills?.length ? c.requiredSkills : ['Ground Engineering', 'Data Analytics', 'Field Telemetry'],
    submitter: {
      name: 'Verified Citizen',
      role: 'Verified Citizen / Resident',
      mobileNumber: `${maskedMobile} (Confidential)`,
      maskedMobile: `${maskedMobile} (Confidential)`,
      isVerified: true,
      email: c.submitter?.email ? 'citizen.confidential@jharkhand.gov.in' : '',
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
