import logger from '../../../shared/logger/index.js';
import {
  UniversityChallenge,
  UniversityFaculty,
  UniversityProject,
  UniversityTeam,
  UniversityApproval,
  UniversityPartner,
  UniversityActivity
} from '../../../modules/university/infrastructure/model.js';

const SEED_CHALLENGES = [
  {
    challengeId: 'CHL-1024', universityCode: 'RU001', title: 'Smart Water Quality Monitoring in Subarnarekha River Basin',
    domain: 'Water Resources', district: 'Ranchi', priority: 'High', status: 'Pending', assignedOn: new Date('2026-05-20'),
    deadline: '27 May 2026 (7 days left)', problemStatement: 'Automated real-time telemetry sensors for river basin.', affectedPopulation: '~ 45,000 Citizens',
    aiCategory: 'Water Quality & IoT Telemetry', requiredSkills: ['IoT Sensors', 'Embedded C', 'Telemetry Dashboards'],
    governmentRemarks: 'High priority under State Water Security Mission.', suggestedFaculty: { name: 'Dr. Priya Sharma', department: 'Water Resources Engineering', matchScore: '96%' },
    locationDetails: { block: 'Namkum', villages: ['Tatisilwai', 'Mahilong'], coordinates: '23.3441° N, 85.3096° E' }, assignedFaculty: null, actionLabel: 'View'
  },
  {
    challengeId: 'CHL-1025', universityCode: 'RU001', title: 'Solar Microgrid & Energy Storage for Rural Primary Health Centers',
    domain: 'Renewable Energy', district: 'Khunti', priority: 'High', status: 'Pending', assignedOn: new Date('2026-05-18'),
    deadline: '02 Jun 2026 (12 days left)', problemStatement: 'Hybrid solar + LFP battery microgrid for vaccine cold chain.', affectedPopulation: '~ 22,000 Citizens',
    aiCategory: 'Renewable Energy & Power Systems', requiredSkills: ['Solar Inverters', 'BMS', 'Power Electronics'],
    governmentRemarks: 'Expedite faculty allocation for field deployment.', suggestedFaculty: { name: 'Dr. Sneha Roy', department: 'Electrical Engineering', matchScore: '94%' },
    locationDetails: { block: 'Torpa', villages: ['Dormo', 'Sundari'], coordinates: '22.9965° N, 85.2788° E' }, assignedFaculty: null, actionLabel: 'View'
  },
  {
    challengeId: 'CHL-1026', universityCode: 'RU001', title: 'AI-driven Pest Detection & Crop Yield Prediction for Tribal Farmers',
    domain: 'Agriculture & Agro', district: 'Gumla', priority: 'Medium', status: 'Accepted', assignedOn: new Date('2026-05-15'),
    deadline: '15 Jun 2026 (25 days left)', problemStatement: 'Early blight detection using mobile camera edge AI.', affectedPopulation: '~ 18,000 Farmers',
    aiCategory: 'Computer Vision & AgriTech', requiredSkills: ['Computer Vision', 'PyTorch', 'Mobile Dev'],
    governmentRemarks: 'Piloted with Birsa Agricultural Extension Office.', suggestedFaculty: { name: 'Prof. Rajesh Verma', department: 'Computer Science & Engineering', matchScore: '98%' },
    locationDetails: { block: 'Bishunpur', villages: ['Netarhat foothills'], coordinates: '23.3850° N, 84.5620° E' },
    assignedFaculty: { id: 'FAC-02', name: 'Prof. Rajesh Verma', department: 'Computer Science & Engineering', email: 'rajesh.verma@ru.ac.in' }, actionLabel: 'View'
  },
  {
    challengeId: 'CHL-1027', universityCode: 'RU001', title: 'Geospatial Landslide Risk Mapping & Early Warning in Mining Zones',
    domain: 'Infrastructure & GIS', district: 'Ramgarh', priority: 'High', status: 'Pending', assignedOn: new Date('2026-05-12'),
    deadline: '10 Jun 2026 (20 days left)', problemStatement: 'Satellite InSAR + ground tilt sensor alert network.', affectedPopulation: '~ 30,000 Citizens',
    aiCategory: 'Geotechnical & Remote Sensing', requiredSkills: ['GIS & Remote Sensing', 'InSAR', 'Geology'],
    governmentRemarks: 'Joint project with Directorate of Mines & Geology.', suggestedFaculty: { name: 'Dr. Vikas Kumar', department: 'Civil Engineering', matchScore: '92%' },
    locationDetails: { block: 'Patratu', villages: ['Bhurkunda'], coordinates: '23.6276° N, 85.5134° E' }, assignedFaculty: null, actionLabel: 'View'
  },
  {
    challengeId: 'CHL-1028', universityCode: 'RU001', title: 'Affordable Solar Food Processing & Cold Chain for Forest Produce',
    domain: 'Environment', district: 'Simdega', priority: 'Medium', status: 'Accepted', assignedOn: new Date('2026-05-10'),
    deadline: '25 Jun 2026 (35 days left)', problemStatement: 'Decentralized solar dehydrators for minor forest produce.', affectedPopulation: '~ 15,000 Tribals',
    aiCategory: 'Post-Harvest Technology', requiredSkills: ['Thermal Engineering', 'Food Processing'],
    governmentRemarks: 'Supported by TRIFED & JSLPS.', suggestedFaculty: { name: 'Dr. Meenakshi Soren', department: 'Environmental Science', matchScore: '91%' },
    locationDetails: { block: 'Kolebira', villages: ['Lachragarh'], coordinates: '22.6138° N, 84.6980° E' },
    assignedFaculty: { id: 'FAC-05', name: 'Dr. Meenakshi Soren', department: 'Environmental Science', email: 'meenakshi.soren@ru.ac.in' }, actionLabel: 'View'
  },
  {
    challengeId: 'CHL-1029', universityCode: 'RU001', title: 'IoT-enabled Ground Water Depletion Early Warning Sensor Network',
    domain: 'Water Resources', district: 'Ranchi', priority: 'Low', status: 'Completed', assignedOn: new Date('2026-04-10'),
    deadline: '01 May 2026', problemStatement: 'Piezometric telemetry probes across urban wards.', affectedPopulation: '~ 50,000 Citizens',
    aiCategory: 'Hydrology & Smart Cities', requiredSkills: ['Piezometer', 'LoRaWAN', 'Cloud Analytics'],
    governmentRemarks: 'Pilot successfully completed.', suggestedFaculty: { name: 'Dr. Priya Sharma', department: 'Water Resources Engineering', matchScore: '95%' },
    locationDetails: { block: 'Kanke', villages: ['Morabadi'], coordinates: '23.4000° N, 85.3200° E' },
    assignedFaculty: { id: 'FAC-01', name: 'Dr. Priya Sharma', department: 'Water Resources Engineering', email: 'priya.sharma@ru.ac.in' }, actionLabel: 'View'
  },
  {
    challengeId: 'CHL-1030', universityCode: 'RU001', title: 'Automated Telemedicine & Remote Diagnostic Kiosk for Rural Tribal PHCs',
    domain: 'Healthcare', district: 'Dumka', priority: 'High', status: 'Pending', assignedOn: new Date('2026-05-24'),
    deadline: '12 Jun 2026 (15 days left)', problemStatement: 'Decentralized AI vital screening (ECG, SpO2, BP) with automated doctor triage consultation for remote Santhal Pargana tribal blocks.',
    affectedPopulation: '~ 60,000 Tribal Citizens', aiCategory: 'Telemedicine & Edge Diagnostics', requiredSkills: ['IoT Biosensors', 'Edge AI', 'WebRTC Telehealth', 'Voice AI'],
    governmentRemarks: 'High priority under Jharkhand Rural Health Security Mission.', suggestedFaculty: { name: 'Prof. Rajesh Verma', department: 'Computer Science & Engineering', matchScore: '97%' },
    locationDetails: { block: 'Kathikund', villages: ['Asanpahari', 'Daldali'], coordinates: '24.2698° N, 87.2455° E' }, assignedFaculty: null, actionLabel: 'View'
  }
];

const SEED_FACULTY = [
  {
    id: 'FAC-01', facultyId: 'FAC-01', universityCode: 'RU001', name: 'Dr. Priya Sharma', email: 'priya.sharma@ru.ac.in',
    department: 'Water Resources Engineering', designation: 'Associate Professor & HOD', specialization: 'Water Quality, Hydrology, IoT Sensors',
    phone: '+91 94311 22334', activeProjects: 2, completedProjects: 5, availabilityStatus: 'Available', status: 'Active', rating: 4.9, experience: '12 Years', qualification: 'Ph.D.'
  },
  {
    id: 'FAC-02', facultyId: 'FAC-02', universityCode: 'RU001', name: 'Prof. Rajesh Verma', email: 'rajesh.verma@ru.ac.in',
    department: 'Computer Science & Engineering', designation: 'Professor & Dean (R&D)', specialization: 'AI/ML, Edge Computing, Computer Vision',
    phone: '+91 94311 33445', activeProjects: 3, completedProjects: 8, availabilityStatus: 'Available', status: 'Active', rating: 4.8, experience: '18 Years', qualification: 'Ph.D.'
  },
  {
    id: 'FAC-03', facultyId: 'FAC-03', universityCode: 'RU001', name: 'Dr. Sneha Roy', email: 'sneha.roy@ru.ac.in',
    department: 'Electrical Engineering', designation: 'Assistant Professor', specialization: 'Renewable Microgrids, Solar PV, BMS',
    phone: '+91 94311 44556', activeProjects: 1, completedProjects: 3, availabilityStatus: 'Available', status: 'Active', rating: 4.7, experience: '7 Years', qualification: 'Ph.D.'
  },
  {
    id: 'FAC-04', facultyId: 'FAC-04', universityCode: 'RU001', name: 'Dr. Amit Sinha', email: 'amit.sinha@ru.ac.in',
    department: 'Agriculture & Agro-Technology', designation: 'Associate Professor', specialization: 'Precision Farming, Soil Chemistry',
    phone: '+91 94311 55667', activeProjects: 2, completedProjects: 4, availabilityStatus: 'In Project', status: 'Active', rating: 4.8, experience: '11 Years', qualification: 'Ph.D.'
  },
  {
    id: 'FAC-05', facultyId: 'FAC-05', universityCode: 'RU001', name: 'Dr. Meenakshi Soren', email: 'meenakshi.soren@ru.ac.in',
    department: 'Environmental Science', designation: 'Assistant Professor', specialization: 'Tribal Forestry, Climate Adaptation',
    phone: '+91 94311 66778', activeProjects: 1, completedProjects: 2, availabilityStatus: 'In Project', status: 'Active', rating: 4.6, experience: '6 Years', qualification: 'Ph.D.'
  },
  {
    id: 'FAC-06', facultyId: 'FAC-06', universityCode: 'RU001', name: 'Dr. Vikas Kumar', email: 'vikas.kumar@ru.ac.in',
    department: 'Civil Engineering', designation: 'Associate Professor', specialization: 'GIS, Remote Sensing, Slope Stability',
    phone: '+91 94311 77889', activeProjects: 1, completedProjects: 6, availabilityStatus: 'On Leave', status: 'Active', rating: 4.7, experience: '14 Years', qualification: 'Ph.D.'
  }
];

const SEED_PROJECTS = [
  {
    projectId: 'PRJ-1024', challengeId: 'CHL-1024', universityCode: 'RU001', title: 'Smart Water Quality Monitoring in Subarnarekha River Basin',
    domain: 'Water Resources', status: 'In Progress', progressPercentage: 45, leadMentor: 'Dr. Priya Sharma',
    facultyMentor: { name: 'Dr. Priya Sharma', department: 'Water Resources Engineering', email: 'priya.sharma@ru.ac.in' },
    studentTeam: 'Smart Aqua Innovators', teamMembersCount: 5, budget: '₹ 75,000', startDate: '20 May 2026', deadline: '30 Nov 2026', daysLeft: '186 days left', milestonesTotal: 7, milestonesCompleted: 3
  },
  {
    projectId: 'PRJ-1025', challengeId: 'CHL-1025', universityCode: 'RU001', title: 'Solar Microgrid & Energy Storage for Rural Health Centers',
    domain: 'Renewable Energy', status: 'On Track', progressPercentage: 60, leadMentor: 'Dr. Sneha Roy',
    facultyMentor: { name: 'Dr. Sneha Roy', department: 'Electrical Engineering', email: 'sneha.roy@ru.ac.in' },
    studentTeam: 'Urja Jharkhand Innovators', teamMembersCount: 4, budget: '₹ 1,20,000', startDate: '10 May 2026', deadline: '15 Oct 2026', daysLeft: '140 days left', milestonesTotal: 6, milestonesCompleted: 4
  },
  {
    projectId: 'PRJ-1026', challengeId: 'CHL-1026', universityCode: 'RU001', title: 'AI Crop Health & Yield Predictor for Tribal Farmers',
    domain: 'Agriculture & Agro', status: 'On Track', progressPercentage: 35, leadMentor: 'Prof. Rajesh Verma',
    facultyMentor: { name: 'Prof. Rajesh Verma', department: 'Computer Science & Engineering', email: 'rajesh.verma@ru.ac.in' },
    studentTeam: 'Kisan AI Tech RU', teamMembersCount: 5, budget: '₹ 80,000', startDate: '01 May 2026', deadline: '20 Dec 2026', daysLeft: '205 days left', milestonesTotal: 8, milestonesCompleted: 3
  },
  {
    projectId: 'PRJ-1027', challengeId: 'CHL-1027', universityCode: 'RU001', title: 'Geospatial Landslide Risk Monitoring & Warning',
    domain: 'Infrastructure & GIS', status: 'At Risk', progressPercentage: 20, leadMentor: 'Dr. Vikas Kumar',
    facultyMentor: { name: 'Dr. Vikas Kumar', department: 'Civil Engineering', email: 'vikas.kumar@ru.ac.in' },
    studentTeam: 'GeoGuard RU', teamMembersCount: 4, budget: '₹ 95,000', startDate: '15 Apr 2026', deadline: '15 Sep 2026', daysLeft: '110 days left', milestonesTotal: 5, milestonesCompleted: 1
  },
  {
    projectId: 'PRJ-1028', challengeId: 'CHL-1028', universityCode: 'RU001', title: 'Affordable Solar Cold Storage for Forest Produce',
    domain: 'Environment', status: 'Delayed', progressPercentage: 15, leadMentor: 'Dr. Meenakshi Soren',
    facultyMentor: { name: 'Dr. Meenakshi Soren', department: 'Environmental Science', email: 'meenakshi.soren@ru.ac.in' },
    studentTeam: 'Vanya Tech Innovators', teamMembersCount: 5, budget: '₹ 1,10,000', startDate: '01 Apr 2026', deadline: '30 Aug 2026', daysLeft: '94 days left', milestonesTotal: 6, milestonesCompleted: 1
  },
  {
    projectId: 'PRJ-1029', challengeId: 'CHL-1029', universityCode: 'RU001', title: 'IoT Ground Water Sensor Network in Ranchi Urban',
    domain: 'Water Resources', status: 'Completed', progressPercentage: 100, leadMentor: 'Dr. Priya Sharma',
    facultyMentor: { name: 'Dr. Priya Sharma', department: 'Water Resources Engineering', email: 'priya.sharma@ru.ac.in' },
    studentTeam: 'AquaSense RU', teamMembersCount: 6, budget: '₹ 65,000', startDate: '10 Jan 2026', deadline: '01 May 2026', daysLeft: 'Completed', milestonesTotal: 5, milestonesCompleted: 5
  }
];

const SEED_APPROVALS = [
  { approvalId: 'APP-201', universityCode: 'RU001', title: 'Lab Equipment & IoT Telemetry Sensor Procurement', type: 'Budget Approval', submittedBy: 'Dr. Priya Sharma', department: 'Water Resources Engineering', amount: '₹ 45,000', date: '26 May 2026', status: 'Pending', description: 'Procurement of 6 industrial pH and turbidity probes.' },
  { approvalId: 'APP-202', universityCode: 'RU001', title: 'Field Survey & Vehicle Clearance in Gumla District', type: 'Travel & Field Work', submittedBy: 'Prof. Rajesh Verma', department: 'Computer Science & Engineering', amount: '₹ 15,000', date: '25 May 2026', status: 'Pending', description: '3-day agricultural field data collection in Bishunpur.' },
  { approvalId: 'APP-203', universityCode: 'RU001', title: 'MoU Renewal with Tata Steel CSR Innovation Cell', type: 'Industry Partnership', submittedBy: 'Dr. Ankit Verma', department: 'University Administration', amount: '₹ 5,00,000', date: '22 May 2026', status: 'Approved', description: 'Joint R&D sponsorship for sustainable mining reclamation.' }
];

const SEED_PARTNERS = [
  { partnerId: 'IND-01', name: 'Tata Steel CSR & Foundation', shortName: 'Tata Steel', logoText: 'TSF', industryType: 'Mining & Heavy Industries', committedGrant: '₹ 2.50 Cr', grantAmount: '₹ 2.50 Cr', focusArea: 'Water, Skill Development & Sustainable Tech', domains: ['Water Resources', 'Renewable Energy'], supportOffered: ['Funding', 'Lab Equipment', 'Mentorship'], activeProjectsCount: 4, status: 'Active', mouStatus: 'Active', contactPerson: { name: 'Mr. Arvind Saxena', role: 'Head of CSR', email: 'arvind.saxena@tatasteel.com', phone: '+91 657 664 1234' }, location: 'Jamshedpur & Ranchi, Jharkhand', registeredOn: '15 Jan 2024', engagementStatus: 'Government Verified Partner' },
  { partnerId: 'IND-02', name: 'Central Coalfields Limited (CCL)', shortName: 'CCL', logoText: 'CCL', industryType: 'Energy & Natural Resources', committedGrant: '₹ 1.80 Cr', grantAmount: '₹ 1.80 Cr', focusArea: 'Landslide Monitoring & Ecological Reclamation', domains: ['Infrastructure & GIS', 'Environment'], supportOffered: ['Research Grants', 'Field Access'], activeProjectsCount: 3, status: 'Active', mouStatus: 'Active', contactPerson: { name: 'Ms. Sunita Singh', role: 'General Manager', email: 'sunita.singh@ccl.gov.in', phone: '+91 651 236 0000' }, location: 'Ranchi, Jharkhand', registeredOn: '20 Mar 2024', engagementStatus: 'Government Verified Partner' },
  { partnerId: 'IND-03', name: 'Jindal Steel & Power (JSP)', shortName: 'Jindal Steel', logoText: 'JSP', industryType: 'Manufacturing & Infrastructure', committedGrant: '₹ 1.20 Cr', grantAmount: '₹ 1.20 Cr', focusArea: 'Renewable Microgrids & Rural Electrification', domains: ['Renewable Energy'], supportOffered: ['Equipment Sponsorship'], activeProjectsCount: 2, status: 'Active', mouStatus: 'Active', contactPerson: { name: 'Mr. R. K. Mukherjee', role: 'Vice President', email: 'rk.mukherjee@jindalsteel.com', phone: '+91 651 224 5566' }, location: 'Ranchi, Jharkhand', registeredOn: '10 Feb 2024', engagementStatus: 'Government Verified Partner' }
];

const SEED_ACTIVITIES = [
  { text: "Dr. Priya Sharma assigned as Primary Mentor on PRJ-1024", type: 'acceptance', relativeTime: '2 hours ago' },
  { text: "Milestone 'Field Sensor Calibration' completed for PRJ-1024", type: 'milestone', relativeTime: '4 hours ago' },
  { text: "Line-item grant proposal submitted for Subarnarekha River Monitoring", type: 'proposal', relativeTime: '1 day ago' },
  { text: "New Challenge CHL-1024 assigned by Government of Jharkhand", type: 'system', relativeTime: '2 days ago' },
  { text: "MoU renewal proposal approved by Tata Steel CSR Cell", type: 'partnership', relativeTime: '3 days ago' }
];

export const seedUniversityDatabase = async () => {
  try {
    logger.info('🌱 Verifying and seeding University Portal data in MongoDB Atlas...');

    // 1. Seed University Challenges (Upsert by challengeId)
    for (const c of SEED_CHALLENGES) {
      await UniversityChallenge.findOneAndUpdate(
        { challengeId: c.challengeId },
        {
          $set: {
            ...c,
            universityCode: 'RU001',
            actionLabel: 'View',
            isDeleted: false
          }
        },
        { upsert: true, new: true }
      );
    }
    logger.info(`✅ Seeded/Synchronized ${SEED_CHALLENGES.length} University Challenges`);

    // 2. Seed Faculty Mentors (Upsert by email)
    for (const f of SEED_FACULTY) {
      const email = f.email.toLowerCase().trim();
      await UniversityFaculty.findOneAndUpdate(
        { universityCode: 'RU001', email },
        {
          $set: {
            ...f,
            email,
            universityCode: 'RU001',
            status: f.status || 'Active'
          }
        },
        { upsert: true, new: true }
      );
    }
    logger.info(`✅ Seeded/Synchronized ${SEED_FACULTY.length} Faculty Mentors`);

    // 3. Seed Projects (Upsert by projectId)
    for (const p of SEED_PROJECTS) {
      await UniversityProject.findOneAndUpdate(
        { projectId: p.projectId },
        {
          $set: {
            ...p,
            universityCode: 'RU001',
            isDeleted: false
          }
        },
        { upsert: true, new: true }
      );
    }
    logger.info(`✅ Seeded/Synchronized ${SEED_PROJECTS.length} University Projects`);

    // 4. Seed Teams
    const teams = [
      { teamCode: 'TM-101', universityCode: 'RU001', name: 'Smart Aqua Innovators', leader: 'Amit Kumar', membersCount: 5, department: 'Water Resources', project: 'Smart Water Monitoring', mentor: 'Dr. Priya Sharma', nepCredits: '4 Credits', status: 'Active' },
      { teamCode: 'TM-102', universityCode: 'RU001', name: 'Urja Jharkhand Innovators', leader: 'Sneha Pandey', membersCount: 4, department: 'Electrical Eng', project: 'Solar Microgrid', mentor: 'Dr. Sneha Roy', nepCredits: '4 Credits', status: 'Active' },
      { teamCode: 'TM-103', universityCode: 'RU001', name: 'Kisan AI Tech RU', leader: 'Rahul Mahato', membersCount: 5, department: 'Computer Science', project: 'AI Pest Detection', mentor: 'Prof. Rajesh Verma', nepCredits: '4 Credits', status: 'Active' },
      { teamCode: 'TM-104', universityCode: 'RU001', name: 'GeoGuard RU', leader: 'Pooja Oraon', membersCount: 4, department: 'Civil Eng', project: 'Landslide Early Warning', mentor: 'Dr. Vikas Kumar', nepCredits: '4 Credits', status: 'Active' }
    ];
    for (const t of teams) {
      await UniversityTeam.findOneAndUpdate(
        { teamCode: t.teamCode },
        { $set: t },
        { upsert: true, new: true }
      );
    }
    logger.info(`✅ Seeded/Synchronized ${teams.length} Student Teams`);

    // 5. Seed Approvals
    for (const a of SEED_APPROVALS) {
      await UniversityApproval.findOneAndUpdate(
        { approvalId: a.approvalId },
        { $set: { ...a, universityCode: 'RU001' } },
        { upsert: true, new: true }
      );
    }
    logger.info(`✅ Seeded/Synchronized ${SEED_APPROVALS.length} Approvals`);

    // 6. Seed Partners
    for (const pt of SEED_PARTNERS) {
      await UniversityPartner.findOneAndUpdate(
        { partnerId: pt.partnerId },
        { $set: { ...pt, universityCode: 'RU001' } },
        { upsert: true, new: true }
      );
    }
    logger.info(`✅ Seeded/Synchronized ${SEED_PARTNERS.length} Industry Partners`);

    // 7. Seed Activities
    const actCount = await UniversityActivity.countDocuments({ universityCode: 'RU001' });
    if (actCount === 0) {
      for (const act of SEED_ACTIVITIES) {
        await UniversityActivity.create({ ...act, universityCode: 'RU001' });
      }
      logger.info(`✅ Seeded/Synchronized Activities`);
    }

    logger.info('🎉 University Portal Database Seeding Complete!');
    return true;
  } catch (err) {
    logger.error('Error during University Database Seeding:', err.message);
    return false;
  }
};

export default seedUniversityDatabase;
