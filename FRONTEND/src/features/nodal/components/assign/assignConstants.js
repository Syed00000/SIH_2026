export const DOMAIN_OPTIONS = [
  'Water Resources',
  'Agriculture',
  'Healthcare',
  'Education',
  'Environment',
  'Energy',
  'Urban Development',
  'Accessibility',
  'Public Administration',
  'Rural Livelihoods',
  'Other'
];

export const PRIORITY_OPTIONS = ['Critical', 'High', 'Medium', 'Low'];

export const VERIFICATION_OPTIONS = [
  { value: 'Verified', label: 'Verified & Approved for HEI R&D', color: 'emerald' },
  { value: 'Under Review', label: 'Under Review / Initial Screening', color: 'amber' },
  { value: 'Needs Clarification', label: 'Needs Field Clarification', color: 'blue' },
  { value: 'Rejected', label: 'Reject Challenge (Out of Scope)', color: 'rose' }
];

export default {
  DOMAIN_OPTIONS,
  PRIORITY_OPTIONS,
  VERIFICATION_OPTIONS
};
