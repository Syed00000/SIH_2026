export const JHARKHAND_DISTRICTS = {
  Ranchi: ['Kanke', 'Ratu', 'Namkum', 'Ormanjhi', 'Bero', 'Ranchi Municipal Corporation'],
  Dhanbad: ['Dhanbad Sadar', 'Jharia', 'Baghmara', 'Nirsa', 'Tundi'],
  Jamshedpur: ['Golmuri-cum-Jugsalai', 'Bahragora', 'Ghatshila', 'Patamda', 'Potka'],
  Hazaribagh: ['Hazaribagh Sadar', 'Ichak', 'Barkagaon', 'Katkamsandi', 'Chirki']
};

export const ACADEMIC_FOCUS_DOMAINS = [
  'AI_IT',
  'WATER',
  'CIVIL',
  'AGRICULTURE',
  'HEALTHCARE',
  'ENERGY'
];

export const CSR_SUPPORT_SECTORS = [
  'WATER',
  'INFRASTRUCTURE',
  'EDUCATION',
  'LIVELIHOOD',
  'HEALTHCARE',
  'ENVIRONMENT'
];

export const INSTITUTION_TYPES = [
  { value: 'STATE_UNIVERSITY', label: 'State University' },
  { value: 'CENTRAL_UNIVERSITY', label: 'Central University' },
  { value: 'DEEMED_UNIVERSITY', label: 'Deemed University' },
  { value: 'PRIVATE_UNIVERSITY', label: 'Private University' },
  { value: 'NIT_IIT', label: 'NIT / IIT' }
];

export const ENTITY_TYPES = [
  { value: 'CORPORATE', label: 'Corporate / PSU' },
  { value: 'NGO', label: 'NGO / Foundation' },
  { value: 'SOCIETY', label: 'Registered Society' }
];

export const INITIAL_FORM_DATA = {
  role: 'CITIZEN',
  fullName: '',
  mobileNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  district: '',
  blockOrULB: '',
  panchayatOrWard: '',
  preferredLanguage: 'HINDI',
  institutionName: '',
  aisheCode: '',
  registrationNumber: '',
  nodalOfficerDesignation: '',
  academicFocusDomains: [],
  institutionType: 'STATE_UNIVERSITY',
  organizationName: '',
  entityType: 'CORPORATE',
  cin: '',
  gstin: '',
  ngoDarpanId: '',
  primaryContactDesignation: '',
  supportSectors: [],
  termsAccepted: false
};

export const getPasswordStrength = (pass) => {
  if (!pass) return { label: 'None', width: '0%', color: 'bg-slate-200' };
  if (pass.length < 6) return { label: 'Weak', width: '33%', color: 'bg-slate-900' };
  if (pass.length < 10 || !/[A-Z]/.test(pass) || !/[0-9]/.test(pass)) {
    return { label: 'Medium', width: '66%', color: 'bg-slate-900' };
  }
  return { label: 'Strong', width: '100%', color: 'bg-slate-900' };
};
