export const SECTOR_OPTIONS = [
  'All Sectors',
  'Agriculture & Food',
  'Water & Sanitation',
  'Mining & Energy',
  'Healthcare & Telemedicine',
  'Infrastructure & Transport',
  'Environment & Forest',
  'Tribal Tech & Education'
];

export const DISTRICT_OPTIONS = [
  'All Districts',
  'Ranchi', 'Dhanbad', 'East Singhbhum', 'Bokaro', 'Deoghar',
  'Hazaribagh', 'Dumka', 'Palamu', 'West Singhbhum', 'Giridih',
  'Ramgarh', 'Seraikela Kharsawan', 'Khunti', 'Gumla', 'Simdega',
  'Lohardaga', 'Latehar', 'Garhwa', 'Chatra', 'Koderma', 'Jamtara', 'Godda', 'Sahebganj', 'Pakur'
];

export const INNOVATION_LIFECYCLE_STEPS = [
  { step: 1, label: 'Problem Identified', desc: 'Citizen / Panchayat ground issue mapped on GIS Triage' },
  { step: 2, label: 'Challenge Created', desc: 'State technical committee issues formal R&D RFP' },
  { step: 3, label: 'Solution Proposed', desc: 'HEIs & Innovators submit technical DPR & prototype roadmap' },
  { step: 4, label: 'Evaluation & DPR Audit', desc: 'Expert peer review, feasibility score & budget scrutiny' },
  { step: 5, label: 'Approved & Grant Sanctioned', desc: 'Government grants sanctioned & Tranche 1 released' },
  { step: 6, label: 'R&D & Lab Prototyping', desc: 'Milestone stage gates & NABL test benchmark verification' },
  { step: 7, label: 'Field Pilot & Telemetry', desc: 'District live deployment & real-time sensor broadcast' },
  { step: 8, label: 'State Validation & Scaling', desc: 'Deployment certificate issued & state-wide scaling' }
];

export default {
  SECTOR_OPTIONS,
  DISTRICT_OPTIONS,
  INNOVATION_LIFECYCLE_STEPS
};
