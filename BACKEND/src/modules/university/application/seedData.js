/**
 * Default Seed Data for Ranchi University and HEIs
 */
export const getSeedDataForUniversity = (code, name = 'Ranchi University') => ({
  challenges: [
    {
      challengeId: 'CHL-1024',
      title: 'Water Quality Monitoring',
      domain: 'Water',
      district: 'Dumka',
      priority: 'High',
      status: 'Review',
      assignedOn: new Date('2026-05-20'),
      actionLabel: 'Review',
      summary: 'Automated IoT sensor telemetry to detect mineral contaminants in local water supplies.'
    },
    {
      challengeId: 'CHL-1040',
      title: 'School Dropout Rate',
      domain: 'Education',
      district: 'Ranchi',
      priority: 'Medium',
      status: 'Accepted',
      assignedOn: new Date('2026-05-19'),
      actionLabel: 'View',
      assignedFaculty: { name: 'Dr. Priya Sharma', department: 'Social Sciences' },
      summary: 'Data-driven early warning intervention system for rural primary schools.'
    },
    {
      challengeId: 'CHL-1055',
      title: 'Rural Road Connectivity',
      domain: 'Infrastructure',
      district: 'Gumla',
      priority: 'High',
      status: 'Faculty Pending',
      assignedOn: new Date('2026-05-18'),
      actionLabel: 'Assign',
      summary: 'GIS topographical route optimization for all-weather tribal road links.'
    },
    {
      challengeId: 'CHL-1078',
      title: 'Solid Waste Management',
      domain: 'Environment',
      district: 'Jamshedpur',
      priority: 'Medium',
      status: 'Clarification',
      assignedOn: new Date('2026-05-17'),
      actionLabel: 'Respond',
      summary: 'Segregated waste collection optimization and micro-composting system.'
    },
    {
      challengeId: 'CHL-1088',
      title: 'Crop Disease Detection',
      domain: 'Agriculture',
      district: 'Pakur',
      priority: 'High',
      status: 'Review',
      assignedOn: new Date('2026-05-16'),
      actionLabel: 'Review',
      summary: 'Computer vision mobile tool for rapid detection of paddy blast disease.'
    }
  ],
  projects: [
    { projectId: 'PRJ-101', title: 'Smart Aqua IoT Network', domain: 'Water', status: 'On Track', progressPercentage: 75, leadMentor: 'Dr. Priya Sharma', studentTeam: 'Smart Aqua', milestonesTotal: 4, milestonesCompleted: 3 },
    { projectId: 'PRJ-102', title: 'AgriSoil Health Diagnostics', domain: 'Agriculture', status: 'Delayed', progressPercentage: 40, leadMentor: 'Dr. Arvind Kumar', studentTeam: 'Kisan Mitra', milestonesTotal: 5, milestonesCompleted: 2 },
    { projectId: 'PRJ-103', title: 'Rural Tele-Education Node', domain: 'Education', status: 'On Track', progressPercentage: 60, leadMentor: 'Prof. S. Soren', studentTeam: 'Vidya Vahini', milestonesTotal: 4, milestonesCompleted: 2 },
    { projectId: 'PRJ-104', title: 'Solar Cold Storage Unit', domain: 'Agriculture', status: 'At Risk', progressPercentage: 35, leadMentor: 'Dr. Neha Verma', studentTeam: 'Surya Urja', milestonesTotal: 4, milestonesCompleted: 1 },
    { projectId: 'PRJ-105', title: 'Bio-waste Micro Composter', domain: 'Environment', status: 'On Track', progressPercentage: 80, leadMentor: 'Dr. R. K. Singh', studentTeam: 'EcoCleaners', milestonesTotal: 4, milestonesCompleted: 3 }
  ],
  faculty: [
    { name: 'Dr. Priya Sharma', designation: 'Professor & Head', department: 'Environmental Sciences', email: 'priya.sharma@ranchiuniv.ac.in', specialization: ['Water Treatment', 'Hydrology'], activeProjects: 2, status: 'Active' },
    { name: 'Dr. Arvind Kumar', designation: 'Associate Professor', department: 'Computer Science', email: 'arvind.kumar@ranchiuniv.ac.in', specialization: ['AI/ML', 'IoT'], activeProjects: 3, status: 'Active' },
    { name: 'Dr. S. N. Soren', designation: 'Assistant Professor', department: 'Civil Engineering', email: 'soren.sn@ranchiuniv.ac.in', specialization: ['GIS Mapping', 'Geotechnical'], activeProjects: 1, status: 'On Leave' },
    { name: 'Dr. Neha Verma', designation: 'Associate Professor', department: 'Renewable Energy', email: 'neha.verma@ranchiuniv.ac.in', specialization: ['Solar Photovoltaics'], activeProjects: 2, status: 'Active' }
  ],
  activities: [
    { text: 'Dr. Priya Sharma accepted challenge CHL-1040', type: 'acceptance', relativeTime: '2 hours ago' },
    { text: 'Team "Smart Aqua" completed a milestone', type: 'milestone', relativeTime: '4 hours ago' },
    { text: 'Proposal for "IoT Based Water Monitoring" submitted', type: 'proposal', relativeTime: '6 hours ago' },
    { text: 'ABC Foundation accepted partnership invitation', type: 'partnership', relativeTime: '1 day ago' },
    { text: 'Milestone overdue in project "AgriSoil Health"', type: 'warning', relativeTime: '1 day ago' }
  ]
});
