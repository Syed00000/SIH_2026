export const buildInitialFormData = (university) => ({
  name: university?.name || '',
  shortName: university?.shortName || '',
  code: university?.code || '',
  universityType: university?.universityType || 'State University',
  institutionCategory: university?.institutionCategory || 'University',
  status: university?.status || 'Approved',
  establishmentYear: university?.establishmentYear || '2012',
  website: university?.website || '',
  district: university?.district || 'Ranchi',

  nodalOfficerName: university?.nodalOfficer?.name || '',
  nodalOfficerDesignation: university?.nodalOfficer?.designation || 'Registrar',
  nodalOfficerEmail: university?.nodalOfficer?.email || '',
  nodalOfficerPhone: university?.nodalOfficer?.phone || '',
  universityEmail: university?.universityEmail || '',
  universityPhone: university?.universityPhone || '',

  naacGrade: university?.accreditation?.naacGrade || 'A',
  naacValidity: university?.accreditation?.validity || '2028-12-31',
  nirfRanking: university?.accreditation?.nirfRanking || '',

  focusAreas: university?.focusAreas || ['Water Management', 'Infrastructure', 'Education', 'Public Health'],

  departments: university?.quickSummary?.departments ?? '',
  totalFaculty: university?.quickSummary?.totalFaculty ?? '',
  availableFaculty: university?.quickSummary?.availableFaculty ?? '',
  labsAndFacilities: university?.quickSummary?.labsAndFacilities ?? '',
  activeProjects: university?.quickSummary?.activeProjects ?? '',
  capacityStatus: university?.quickSummary?.capacityStatus || 'Available',

  loginPassword: university?.credentials?.generatedPassword || ''
});

export const FOCUS_AREA_OPTIONS = [
  'Water Management', 'Waste Management', 'Environmental Science', 'Infrastructure',
  'Renewable Energy', 'AI / ML', 'IoT', 'Agriculture', 'Education', 'Public Health',
  'Rural Development', 'Transportation', 'Skill Development', 'Governance', 'Public Safety', 'Other'
];

export const buildUpdatePayload = (formData) => ({
  name: formData.name.trim(),
  shortName: formData.shortName.trim(),
  code: formData.code.trim().toUpperCase(),
  universityType: formData.universityType,
  institutionCategory: formData.institutionCategory,
  status: formData.status,
  establishmentYear: formData.establishmentYear,
  website: formData.website.trim(),
  district: formData.district,
  nodalOfficer: {
    name: formData.nodalOfficerName.trim(),
    designation: formData.nodalOfficerDesignation.trim(),
    email: formData.nodalOfficerEmail.trim(),
    phone: formData.nodalOfficerPhone.trim()
  },
  universityEmail: formData.universityEmail.trim(),
  universityPhone: formData.universityPhone.trim(),
  accreditation: {
    naacGrade: formData.naacGrade,
    validity: formData.naacValidity,
    nirfRanking: formData.nirfRanking ? Number(formData.nirfRanking) : undefined
  },
  focusAreas: formData.focusAreas,
  quickSummary: {
    departments: Number(formData.departments) || 0,
    totalFaculty: Number(formData.totalFaculty) || 0,
    availableFaculty: Number(formData.availableFaculty) || 0,
    labsAndFacilities: Number(formData.labsAndFacilities) || 0,
    activeProjects: Number(formData.activeProjects) || 0,
    capacityStatus: formData.capacityStatus
  },
  credentials: {
    loginEmail: formData.nodalOfficerEmail.trim(),
    generatedPassword: formData.loginPassword
  }
});
