export const INDUSTRY_CATEGORIES = [
  'Private Industry',
  'MSME',
  'Govt Dept',
  'Research Lab',
  'Startup',
  'CSR',
  'PSU',
  'Industry Association',
  'Other'
];

export const THEMATIC_DOMAINS = [
  'Agriculture, Livelihoods',
  'Agriculture, Agri-tech',
  'AI / ML, Education',
  'AI / ML, IoT',
  'Healthcare, MedTech',
  'Healthcare, Mental Health',
  'Water Management',
  'Rural Livelihoods',
  'Education, Skill Dev.',
  'Innovation Ecosystem',
  'Clean Energy, Environment',
  'Infrastructure, Smart Cities',
  'Mining, Heavy Industry'
];

export const SUPPORT_MODES_LIST = [
  'Funding',
  'Mentorship',
  'Prototyping',
  'Tech Transfer',
  'Research',
  'Incubation',
  'CSR Support',
  'Skill Development'
];

export const JHARKHAND_DISTRICTS = [
  'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum',
  'Garhwa', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara',
  'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu',
  'Ramgarh', 'Ranchi', 'Sahibganj', 'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
];

export const INITIAL_INDUSTRY_FORM_DATA = {
  category: 'Private Industry',
  legalName: '',
  shortName: '',
  registrationNumber: '',
  thematicDomain: 'Agriculture, Livelihoods',
  website: '',
  spocName: '',
  designation: 'Nodal Officer / Manager',
  officialEmail: '',
  mobileNumber: '',
  alternateContact: '',
  addressLine1: '',
  addressLine2: '',
  state: 'Jharkhand',
  district: 'Ranchi',
  city: 'Ranchi',
  pincode: '834001',
  supportModes: ['Funding', 'Mentorship']
};

export const validateIndustryForm = (formData) => {
  const errs = {};
  if (!formData.legalName.trim()) {
    errs.legalName = 'Organization Legal Name is required';
  }
  if (!formData.category) {
    errs.category = 'Category is required';
  }
  if (!formData.thematicDomain) {
    errs.thematicDomain = 'Primary domain is required';
  }
  if (!formData.spocName.trim()) {
    errs.spocName = 'Contact Person Name is required';
  }
  if (!formData.officialEmail.trim() || !formData.officialEmail.includes('@')) {
    errs.officialEmail = 'Valid official email address is required';
  }
  const cleanMobile = formData.mobileNumber.replace(/\D/g, '');
  if (cleanMobile.length !== 10) {
    errs.mobileNumber = '10-digit mobile number is required';
  }
  if (!formData.addressLine1.trim()) {
    errs.addressLine1 = 'Address is required';
  }
  if (!formData.district) {
    errs.district = 'District is required';
  }
  if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
    errs.pincode = 'Valid 6-digit PIN Code is required';
  }

  return {
    isValid: Object.keys(errs).length === 0,
    errors: errs,
    firstError: Object.values(errs)[0] || 'Please fill in all required fields marked with *'
  };
};
