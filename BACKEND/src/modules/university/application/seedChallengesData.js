import { FULL_PROJECTS_DATA } from './seedProjectsData.js';

export { FULL_PROJECTS_DATA };

export const FULL_CHALLENGES_DATA = [
  {
    challengeId: 'CHL-1024',
    title: 'Water Quality Monitoring in Rural Areas',
    domain: 'Water',
    district: 'Dumka',
    priority: 'High',
    status: 'Review',
    actionLabel: 'Review',
    assignedOn: '2026-05-20',
    deadline: '27 May 2026 (7 days left)',
    problemStatement: 'Unsafe drinking water in rural areas is causing waterborne diseases. Regular automated telemetry required.',
    affectedPopulation: '~ 12,500 People',
    aiCategory: 'Water Quality & Monitoring',
    requiredSkills: ['Water Testing', 'IoT', 'Data Analysis'],
    governmentRemarks: 'Critical for public health. University support required for field deployment.',
    suggestedFaculty: { name: 'Dr. Priya Sharma', department: 'Water Resources Engineering', matchScore: '92% Match' },
    locationDetails: { block: 'Shikaripara', villages: ['Haripur', 'Gopinathpur'], coordinates: '24.2698° N, 87.2560° E' }
  },
  {
    challengeId: 'CHL-1040',
    title: 'Smart Solar Crop Cold Storage',
    domain: 'Agriculture',
    district: 'Ranchi',
    priority: 'High',
    status: 'Review',
    actionLabel: 'Review',
    assignedOn: '2026-05-19',
    deadline: '29 May 2026 (9 days left)',
    problemStatement: 'Perishable tomato and vegetable post-harvest loss due to lack of off-grid cold rooms.',
    affectedPopulation: '~ 8,200 Farmers',
    aiCategory: 'Solar Cold Storage & IoT',
    requiredSkills: ['Solar Thermal', 'Microcontroller', 'Agronomy'],
    governmentRemarks: 'Department of Agriculture priority pilot.',
    suggestedFaculty: { name: 'Dr. Sandeep Oraon', department: 'Agriculture', matchScore: '94% Match' }
  },
  {
    challengeId: 'CHL-1055',
    title: 'Rural Road Connectivity Improvement',
    domain: 'Infrastructure',
    district: 'Gumla',
    priority: 'High',
    status: 'Faculty Pending',
    actionLabel: 'Assign',
    assignedOn: '2026-05-18',
    deadline: '25 May 2026 (5 days left)',
    problemStatement: 'Unpaved tracks washed away during monsoon, cutting off 14 tribal hamlets.',
    affectedPopulation: '~ 16,000 People',
    aiCategory: 'Rural Infrastructure & GIS',
    requiredSkills: ['Civil Engineering', 'GIS Mapping'],
    suggestedFaculty: { name: 'Dr. Rahul Kumar', department: 'Civil Engineering', matchScore: '95% Match' }
  },
  {
    challengeId: 'CHL-1078',
    title: 'Solid Waste Management Solution',
    domain: 'Environment',
    district: 'Jamshedpur',
    priority: 'Medium',
    status: 'Clarification',
    actionLabel: 'Respond',
    assignedOn: '2026-05-15',
    deadline: '20 Oct 2026',
    problemStatement: 'Organic waste conversion into bio-fertilizer for peri-urban farmer clusters.',
    affectedPopulation: '~ 24,000 People',
    aiCategory: 'Waste Management',
    requiredSkills: ['Bio-Engineering', 'Agronomy']
  },
  {
    challengeId: 'CHL-1088',
    title: 'Crop Disease Early Detection App',
    domain: 'Agriculture',
    district: 'Pakur',
    priority: 'High',
    status: 'Review',
    actionLabel: 'Review',
    assignedOn: '2026-05-16',
    deadline: '02 Jun 2026',
    problemStatement: 'Paddy blast disease computer vision diagnostic mobile tool.',
    affectedPopulation: '~ 14,000 Farmers',
    aiCategory: 'AI Vision & Agronomy'
  },
  {
    challengeId: 'CHL-1096',
    title: 'Rural Healthcare Tele-Clinic Pod',
    domain: 'Healthcare',
    district: 'Khunti',
    priority: 'High',
    status: 'Accepted',
    actionLabel: 'View',
    assignedOn: '2026-05-10',
    assignedFaculty: { name: 'Dr. Neha Verma', department: 'Computer Science & Health AI' },
    problemStatement: 'Point-of-care vital telemetry van connected to Ranchi District Hospital.'
  },
  {
    challengeId: 'CHL-1112',
    title: 'Solar Energy Net-Metering in Govt Buildings',
    domain: 'Energy',
    district: 'Dhanbad',
    priority: 'Medium',
    status: 'Accepted',
    actionLabel: 'View',
    assignedOn: '2026-05-08',
    assignedFaculty: { name: 'Dr. Amit Singh', department: 'Mechanical Engineering' },
    problemStatement: 'Rooftop micro-inverter grid tie with smart cloud net-metering.'
  },
  {
    challengeId: 'CHL-1101',
    title: 'Precision Micro-Irrigation Drip Network',
    domain: 'Water',
    district: 'Simdega',
    priority: 'Medium',
    status: 'Accepted',
    actionLabel: 'View',
    assignedOn: '2026-05-05',
    assignedFaculty: { name: 'Dr. Kavita Kumari', department: 'Chemistry & Water Testing' },
    problemStatement: 'Solar smart drip irrigation network with soil moisture sensors.'
  }
];

export const FULL_FACULTY_DATA = [
  { name: 'Dr. Priya Sharma', designation: 'Professor', department: 'Water Resources Engineering', email: 'priya.sharma@ru.ac.in', phone: '+91 98765 43210', specialization: ['Water Quality', 'Treatment', 'IoT Sensors'], experience: '12 Years', qualification: 'Ph.D. in Environmental Engineering', researchAreas: ['Water Quality', 'Treatment'], totalProjects: { active: 1, completed: 7 }, currentLoad: 1, availabilityStatus: 'Available', status: 'Active' },
  { name: 'Dr. Rahul Kumar', designation: 'Associate Professor', department: 'Civil Engineering', email: 'rahul.kumar@ru.ac.in', phone: '+91 98351 99881', specialization: ['Structural Engg.', 'Hydrology'], experience: '10 Years', qualification: 'Ph.D. in Structural Engineering', researchAreas: ['Rural Roads', 'Bridge Stability'], totalProjects: { active: 1, completed: 5 }, currentLoad: 1, availabilityStatus: 'Available', status: 'Active' },
  { name: 'Dr. Neha Verma', designation: 'Associate Professor', department: 'Computer Science & Engineering', email: 'neha.verma@ru.ac.in', phone: '+91 94311 77665', specialization: ['IoT', 'Machine Learning'], experience: '8 Years', qualification: 'Ph.D. in Computer Science', researchAreas: ['Edge Computing'], totalProjects: { active: 1, completed: 4 }, currentLoad: 1, availabilityStatus: 'In Project', status: 'Active' },
  { name: 'Dr. Amit Singh', designation: 'Professor', department: 'Mechanical Engineering', email: 'amit.singh@ru.ac.in', phone: '+91 97714 33221', specialization: ['Automation', 'Robotics'], experience: '11 Years', qualification: 'Ph.D. in Robotics', researchAreas: ['Mechatronics'], totalProjects: { active: 1, completed: 6 }, currentLoad: 1, availabilityStatus: 'Available', status: 'Active' },
  { name: 'Dr. Sandeep Oraon', designation: 'Assistant Professor', department: 'Agriculture', email: 'sandeep.oraon@ru.ac.in', phone: '+91 94315 88990', specialization: ['Soil Science', 'Irrigation'], experience: '7 Years', qualification: 'Ph.D. in Agronomy', researchAreas: ['Dryland Farming'], totalProjects: { active: 1, completed: 2 }, currentLoad: 1, availabilityStatus: 'Available', status: 'Active' },
  { name: 'Dr. Kavita Kumari', designation: 'Assistant Professor', department: 'Chemistry', email: 'kavita.kumari@ru.ac.in', phone: '+91 98355 44112', specialization: ['Water Testing', 'Environmental Chemistry'], experience: '9 Years', qualification: 'Ph.D. in Applied Chemistry', researchAreas: ['Heavy Metal Filtration'], totalProjects: { active: 1, completed: 3 }, currentLoad: 1, availabilityStatus: 'In Project', status: 'Active' }
];

export const FULL_TEAMS_DATA = [
  { teamCode: 'TM-AQUA-01', name: 'Aqua Sentinel', leader: 'Ali Khan (CSE 4th Year)', membersCount: 5, members: [{ name: 'Ali Khan', rollNo: 'RU-2023-CS-041', department: 'Computer Science', year: '4th Year' }], project: 'Water Quality Monitoring (PRJ-1024)', mentor: 'Dr. Priya Sharma', nepCredits: '4 Credits', status: 'Active' }
];

export const FULL_PARTNERS_DATA = [
  { partnerId: 'CSR-01', name: 'Tata Steel CSR Foundation', type: 'Industrial CSR (Sec 135)', committedGrant: '₹ 5.00 Lakhs', focusArea: 'Clean Water & IoT', mouStatus: 'Active', activePilots: 2 },
  { partnerId: 'CSR-02', name: 'Central Coalfields Limited (CCL)', type: 'PSU CSR Partner', committedGrant: '₹ 5.00 Lakhs', focusArea: 'Rural Roads & Energy', mouStatus: 'Active', activePilots: 2 },
  { partnerId: 'CSR-03', name: 'Jharkhand State Innovation Council', type: 'State Government R&D', committedGrant: '₹ 5.00 Lakhs', focusArea: 'Agritech & Health AI', mouStatus: 'Active', activePilots: 2 }
];

export const FULL_APPROVALS_DATA = [
  { approvalId: 'APP-101', title: 'District Field Testing Permit', type: 'Administrative Clearance', project: 'Water Quality Monitoring in Rural Areas', requestedBy: 'Dr. Priya Sharma', date: '21 May 2026', status: 'Pending' },
  { approvalId: 'APP-102', title: 'Rooftop Solar Structural Sanction', type: 'Infrastructure Clearance', project: 'Solar Energy Usage in Govt Buildings', requestedBy: 'Dr. Amit Singh', date: '19 May 2026', status: 'Pending' },
  { approvalId: 'APP-103', title: 'Rural Tele-Clinic Van Route Clearance', type: 'Health Dept Permission', project: 'Rural Healthcare Tele-Clinic Pod', requestedBy: 'Dr. Neha Verma', date: '18 May 2026', status: 'Approved' }
];

export const FULL_ACTIVITIES_DATA = [
  { text: "Milestone 'Data Collection' completed for Water Quality Monitoring", type: 'milestone', relativeTime: '2 hours ago' },
  { text: "Dr. Priya Sharma submitted line-item budget proposal for PRJ-1024", type: 'proposal', relativeTime: '4 hours ago' }
];

export default {
  FULL_CHALLENGES_DATA,
  FULL_PROJECTS_DATA,
  FULL_FACULTY_DATA,
  FULL_TEAMS_DATA,
  FULL_PARTNERS_DATA,
  FULL_APPROVALS_DATA,
  FULL_ACTIVITIES_DATA
};
