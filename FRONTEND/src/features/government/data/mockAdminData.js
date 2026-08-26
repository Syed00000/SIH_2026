// 28 initial administrator records matching the JoharSetu Admin Directory specifications
export const MOCK_ADMIN_RECORDS = [
  { id: 'adm-001', fullName: 'Ankit Sharma', mobileNumber: '+91 98765 43210', email: 'ankit.sharma@jh.gov.in', role: 'Super Admin', district: 'Ranchi', lastLogin: '24 May 2026 10:30 AM', status: 'Active', avatarColor: 'purple' },
  { id: 'adm-002', fullName: 'Ritu Verma', mobileNumber: '+91 91234 56789', email: 'ritu.verma@jh.gov.in', role: 'Nodal Officer', district: 'Dhanbad', lastLogin: '23 May 2026 04:15 PM', status: 'Active', avatarColor: 'green' },
  { id: 'adm-003', fullName: 'Prakash Singh', mobileNumber: '+91 92345 67890', email: 'prakash.singh@jh.gov.in', role: 'District Admin', district: 'Jamshedpur', lastLogin: '22 May 2026 11:20 AM', status: 'Active', avatarColor: 'orange' },
  { id: 'adm-004', fullName: 'Manoj Kumar', mobileNumber: '+91 98345 67812', email: 'manoj.kumar@jh.gov.in', role: 'HEI Admin', district: 'Ranchi', lastLogin: '21 May 2026 09:45 AM', status: 'Suspended', avatarColor: 'pink' },
  { id: 'adm-005', fullName: 'Neha Sinha', mobileNumber: '+91 91232 45678', email: 'neha.sinha@jh.gov.in', role: 'Nodal Officer', district: 'Bokaro', lastLogin: '20 May 2026 02:30 PM', status: 'Suspended', avatarColor: 'yellow' },
  { id: 'adm-006', fullName: 'Amit Kumar', mobileNumber: '+91 90000 11122', email: 'amit.kumar@jh.gov.in', role: 'HEI Admin', district: 'Dhanbad', lastLogin: '18 May 2026 10:10 AM', status: 'Removed', avatarColor: 'teal' },
  { id: 'adm-007', fullName: 'Sneha Priya', mobileNumber: '+91 93456 78901', email: 'sneha.priya@jh.gov.in', role: 'District Admin', district: 'Palamu', lastLogin: 'Today 09:05 AM', status: 'Active', avatarColor: 'blue' },
  { id: 'adm-008', fullName: 'Deepak Barman', mobileNumber: '+91 95777 22111', email: 'deepak.barman@jh.gov.in', role: 'Nodal Officer', district: 'Giridih', lastLogin: 'Yesterday 03:25 PM', status: 'Active', avatarColor: 'cyan' },
  { id: 'adm-009', fullName: 'Sanjay Murmu', mobileNumber: '+91 94311 88990', email: 'sanjay.murmu@jh.gov.in', role: 'District Admin', district: 'Dumka', lastLogin: '24 May 2026 08:30 AM', status: 'Active', avatarColor: 'emerald' },
  { id: 'adm-010', fullName: 'Pooja Agarwal', mobileNumber: '+91 98350 12345', email: 'pooja.agarwal@jh.gov.in', role: 'Nodal Officer', district: 'Hazaribagh', lastLogin: '23 May 2026 11:15 AM', status: 'Active', avatarColor: 'violet' },
  { id: 'adm-011', fullName: 'Vikram Soren', mobileNumber: '+91 94701 23456', email: 'vikram.soren@jh.gov.in', role: 'HEI Admin', district: 'Deoghar', lastLogin: '22 May 2026 04:00 PM', status: 'Active', avatarColor: 'amber' },
  { id: 'adm-012', fullName: 'Kavita Das', mobileNumber: '+91 99341 23890', email: 'kavita.das@jh.gov.in', role: 'District Admin', district: 'East Singhbhum', lastLogin: '21 May 2026 01:20 PM', status: 'Active', avatarColor: 'rose' },
  { id: 'adm-013', fullName: 'Rajesh Tiwary', mobileNumber: '+91 98359 87654', email: 'rajesh.tiwary@jh.gov.in', role: 'Super Admin', district: 'Ranchi', lastLogin: 'Today 11:45 AM', status: 'Active', avatarColor: 'indigo' },
  { id: 'adm-014', fullName: 'Sunil Hansda', mobileNumber: '+91 94301 56789', email: 'sunil.hansda@jh.gov.in', role: 'Nodal Officer', district: 'Pakur', lastLogin: '20 May 2026 10:00 AM', status: 'Active', avatarColor: 'teal' },
  { id: 'adm-015', fullName: 'Ananya Roy', mobileNumber: '+91 91223 34455', email: 'ananya.roy@jh.gov.in', role: 'HEI Admin', district: 'Ranchi', lastLogin: '19 May 2026 03:30 PM', status: 'Active', avatarColor: 'pink' },
  { id: 'adm-016', fullName: 'Arun Oraon', mobileNumber: '+91 94315 67812', email: 'arun.oraon@jh.gov.in', role: 'District Admin', district: 'Gumla', lastLogin: '18 May 2026 09:15 AM', status: 'Active', avatarColor: 'emerald' },
  { id: 'adm-017', fullName: 'Meena Kumari', mobileNumber: '+91 98351 23987', email: 'meena.kumari@jh.gov.in', role: 'Nodal Officer', district: 'Latehar', lastLogin: '17 May 2026 05:10 PM', status: 'Suspended', avatarColor: 'yellow' },
  { id: 'adm-018', fullName: 'Tarun Besra', mobileNumber: '+91 94709 87123', email: 'tarun.besra@jh.gov.in', role: 'HEI Admin', district: 'West Singhbhum', lastLogin: '16 May 2026 12:00 PM', status: 'Active', avatarColor: 'blue' },
  { id: 'adm-019', fullName: 'Rashmi Tirkey', mobileNumber: '+91 99345 67123', email: 'rashmi.tirkey@jh.gov.in', role: 'District Admin', district: 'Simdega', lastLogin: '15 May 2026 02:40 PM', status: 'Active', avatarColor: 'purple' },
  { id: 'adm-020', fullName: 'Subhashish Ghosh', mobileNumber: '+91 98352 34567', email: 'subhashish.ghosh@jh.gov.in', role: 'Nodal Officer', district: 'Jamtara', lastLogin: '14 May 2026 11:30 AM', status: 'Active', avatarColor: 'cyan' },
  { id: 'adm-021', fullName: 'Shikha Pandey', mobileNumber: '+91 91236 78901', email: 'shikha.pandey@jh.gov.in', role: 'HEI Admin', district: 'Koderma', lastLogin: '13 May 2026 10:15 AM', status: 'Active', avatarColor: 'green' },
  { id: 'adm-022', fullName: 'Gopal Mahto', mobileNumber: '+91 94318 90123', email: 'gopal.mahto@jh.gov.in', role: 'District Admin', district: 'Ramgarh', lastLogin: '12 May 2026 04:45 PM', status: 'Active', avatarColor: 'orange' },
  { id: 'adm-023', fullName: 'Divya Sen', mobileNumber: '+91 98357 89012', email: 'divya.sen@jh.gov.in', role: 'Nodal Officer', district: 'Godda', lastLogin: '11 May 2026 01:10 PM', status: 'Active', avatarColor: 'rose' },
  { id: 'adm-024', fullName: 'Kamlesh Soren', mobileNumber: '+91 94702 34567', email: 'kamlesh.soren@jh.gov.in', role: 'District Admin', district: 'Sahibganj', lastLogin: '10 May 2026 09:30 AM', status: 'Suspended', avatarColor: 'amber' },
  { id: 'adm-025', fullName: 'Priyanka Topno', mobileNumber: '+91 99348 90123', email: 'priyanka.topno@jh.gov.in', role: 'HEI Admin', district: 'Khunti', lastLogin: '09 May 2026 03:20 PM', status: 'Active', avatarColor: 'violet' },
  { id: 'adm-026', fullName: 'Rameshwar Tudu', mobileNumber: '+91 94310 12345', email: 'rameshwar.tudu@jh.gov.in', role: 'District Admin', district: 'Garhwa', lastLogin: '08 May 2026 11:50 AM', status: 'Active', avatarColor: 'teal' },
  { id: 'adm-027', fullName: 'Nandita Roy', mobileNumber: '+91 98353 45678', email: 'nandita.roy@jh.gov.in', role: 'Nodal Officer', district: 'Chatra', lastLogin: '07 May 2026 02:15 PM', status: 'Active', avatarColor: 'indigo' },
  { id: 'adm-028', fullName: 'Binod Munda', mobileNumber: '+91 94703 45678', email: 'binod.munda@jh.gov.in', role: 'District Admin', district: 'Lohardaga', lastLogin: '06 May 2026 10:05 AM', status: 'Active', avatarColor: 'blue' }
];

export const ADMIN_ROLES_LIST = [
  'All Roles',
  'Super Admin',
  'Nodal Officer',
  'District Admin',
  'HEI Admin'
];

export const ADMIN_STATUS_LIST = [
  'All Status',
  'Active',
  'Suspended',
  'Removed'
];
