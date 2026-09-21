export const createInitialFormData = () => ({
  name: '',
  code: '',
  category: 'State Ministry',
  departmentType: 'State Government Department',
  parentAuthority: 'Government of Jharkhand',
  officialWebsite: '',
  headEmail: '',
  officeAddress: '',
  applicableJurisdiction: 'Entire State of Jharkhand',
  headquartersLocation: 'Ranchi',
  operationalDistrictsType: 'All Districts',
  district: 'Ranchi',
  districtCoverage: [],
  hierarchyConfig: [
    'State Department',
    'District Department',
    'Block / Tehsil Office',
    'Ward / Field Office'
  ],
  headName: '',
  headRole: 'Principal Secretary',
  headPhone: '',
  officeSecretariatLocation: '',
  nodalOfficerName: '',
  nodalOfficerDesignation: 'Under Secretary',
  nodalOfficerEmail: '',
  nodalOfficerPhone: '',
  description: '',
  mandate: {
    objective: '',
    description: ''
  },
  keyFunctions: [''],
  powersApprovalAuthority: '',
  schemesManaged: '',
  departmentsCoordinated: '',
  problemCategoriesHandled: '',
  verificationStatus: 'Pending Verification',
  status: 'Active',
  effectiveFrom: new Date().toISOString().split('T')[0],
  approvalRequired: true,
  remarks: '',
  credentials: {
    loginId: '',
    loginEmail: '',
    password: '',
    mfaRequired: false,
    firstLoginPasswordChange: true,
    credentialCreatedBy: 'Super Admin (Government)',
    credentialStatus: 'Pending Activation'
  }
});

export const mapDepartmentToFormData = (dept) => {
  if (!dept) return createInitialFormData();
  return {
    name: dept.name || '',
    code: dept.code || dept.deptId || '',
    category: 'State Ministry',
    departmentType: dept.departmentType || 'State Government Department',
    parentAuthority: dept.parentAuthority || 'Government of Jharkhand',
    officialWebsite: dept.officialWebsite || '',
    headEmail: dept.headEmail || '',
    officeAddress: dept.officeAddress || '',
    applicableJurisdiction: dept.applicableJurisdiction || 'Entire State of Jharkhand',
    headquartersLocation: dept.headquartersLocation || 'Ranchi',
    operationalDistrictsType: dept.operationalDistrictsType || 'All Districts',
    district: dept.district || 'Ranchi',
    districtCoverage: dept.districtCoverage || [],
    hierarchyConfig: dept.hierarchyConfig?.length ? dept.hierarchyConfig : [
      'State Department',
      'District Department',
      'Block / Tehsil Office',
      'Ward / Field Office'
    ],
    headName: dept.headName || '',
    headRole: dept.headRole || 'Principal Secretary',
    headPhone: dept.headPhone || '',
    officeSecretariatLocation: dept.officeSecretariatLocation || '',
    nodalOfficerName: dept.nodalOfficerName || '',
    nodalOfficerDesignation: dept.nodalOfficerDesignation || 'Under Secretary',
    nodalOfficerEmail: dept.nodalOfficerEmail || '',
    nodalOfficerPhone: dept.nodalOfficerPhone || '',
    description: dept.description || '',
    mandate: dept.mandate || { objective: '', description: '' },
    keyFunctions: dept.keyFunctions?.length ? dept.keyFunctions : [''],
    powersApprovalAuthority: dept.powersApprovalAuthority || '',
    schemesManaged: dept.schemesManaged || '',
    departmentsCoordinated: dept.departmentsCoordinated || '',
    problemCategoriesHandled: dept.problemCategoriesHandled || '',
    verificationStatus: dept.verificationStatus || 'Pending Verification',
    status: dept.status || 'Active',
    effectiveFrom: dept.effectiveFrom || new Date().toISOString().split('T')[0],
    approvalRequired: dept.approvalRequired ?? true,
    remarks: dept.remarks || '',
    credentials: {
      loginId: dept.credentials?.loginId || '',
      loginEmail: dept.credentials?.loginEmail || '',
      password: dept.credentials?.password || '',
      mfaRequired: dept.credentials?.mfaRequired || false,
      firstLoginPasswordChange: dept.credentials?.firstLoginPasswordChange ?? true,
      credentialCreatedBy: dept.credentials?.credentialCreatedBy || 'Super Admin (Government)',
      credentialStatus: dept.credentials?.credentialStatus || 'Pending Activation'
    }
  };
};

export const generateSecurePassword = () => {
  const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
  const numberChars = '23456789';
  const specialChars = '!@#$%';
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  const getRandomChar = (charset) => {
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      return charset.charAt(arr[0] % charset.length);
    }
    return charset.charAt(Math.floor(Math.random() * charset.length));
  };

  const characters = [
    getRandomChar(uppercaseChars),
    getRandomChar(lowercaseChars),
    getRandomChar(numberChars),
    getRandomChar(specialChars)
  ];

  for (let i = 4; i < 12; i++) {
    characters.push(getRandomChar(allChars));
  }

  for (let i = characters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [characters[i], characters[j]] = [characters[j], characters[i]];
  }

  return characters.join('');
};
