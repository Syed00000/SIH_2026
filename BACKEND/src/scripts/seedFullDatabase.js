import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectMongo, closeMongo } from '../infrastructure/database/mongo/client.js';
import { MongooseUser } from '../modules/users/infrastructure/model.js';
import { MongooseUniversity } from '../modules/government/heis/infrastructure/model.js';
import { MongooseIndustry } from '../modules/government/industries/infrastructure/model.js';
import {
  UniversityChallenge,
  UniversityProject,
  UniversityFaculty,
  UniversityTeam,
  UniversityApproval,
  UniversityActivity
} from '../modules/university/infrastructure/model.js';

dotenv.config();

const seedData = async () => {
  console.log('Connecting to database...');
  await connectMongo();

  console.log('Clearing old mock collections...');
  await MongooseUniversity.deleteMany({});
  await MongooseIndustry.deleteMany({});
  await UniversityChallenge.deleteMany({});
  await UniversityProject.deleteMany({});
  await UniversityFaculty.deleteMany({});
  await UniversityTeam.deleteMany({});
  await UniversityApproval.deleteMany({});
  await UniversityActivity.deleteMany({});

  // Seed User accounts for University & Industry
  const passHashUniv = await bcrypt.hash('Univ@123456', 12);
  const passHashInd = await bcrypt.hash('Ind@123456', 12);

  // 1. Seed Universities (HEIs)
  console.log('Seeding HEIs...');
  const uni1 = await MongooseUniversity.create({
    name: 'Ranchi University',
    shortName: 'RU',
    code: 'RU001',
    universityType: 'State University',
    institutionCategory: 'University',
    status: 'Approved',
    accessStatus: 'Enabled',
    establishmentYear: 1960,
    website: 'https://ranchiuniversity.ac.in',
    district: 'Ranchi',
    quickSummary: {
      departments: 24,
      totalFaculty: 120,
      availableFaculty: 85,
      labsAndFacilities: 30,
      activeProjects: 3,
      capacityStatus: 'Available'
    },
    focusAreas: ['Water Management', 'Agriculture', 'Rural Development', 'Tribal Welfare'],
    accreditation: {
      naacGrade: 'A',
      validity: '2029-06-30',
      nirfRanking: 120
    },
    nodalOfficer: {
      name: 'Dr. Mukund Chandra Mehta',
      designation: 'Registrar & Coordinator',
      email: 'registrar@ranchiuniversity.ac.in',
      phone: '9431102938'
    },
    universityEmail: 'registrar@ranchiuniversity.ac.in',
    universityPhone: '06512201595',
    credentials: {
      loginEmail: 'registrar@ranchiuniversity.ac.in',
      generatedPassword: 'Univ@123456',
      passwordHash: passHashUniv
    },
    aisheCode: 'U-0182'
  });

  // Ensure university user is also in Users collection for auth
  await MongooseUser.findOneAndUpdate(
    { email: 'registrar@ranchiuniversity.ac.in' },
    {
      fullName: 'Dr. Mukund Chandra Mehta',
      email: 'registrar@ranchiuniversity.ac.in',
      passwordHash: passHashUniv,
      mobileNumber: '9431102938',
      role: 'UNIVERSITY',
      accountStatus: 'ACTIVE',
      emailVerification: { verified: true, verifiedAt: new Date() }
    },
    { upsert: true, new: true }
  );

  console.log('Universities seeded.');

  // 2. Seed Industries (CSR Partners)
  console.log('Seeding CSR Industries...');
  await MongooseIndustry.create({
    industryId: 'IND-TSF',
    legalName: 'Tata Steel Foundation',
    shortName: 'TSF',
    category: 'Private Industry',
    registrationNumber: 'U85300JH2016NPL009028',
    thematicDomain: 'Water Management, Agriculture',
    thematicDomains: ['Water Management', 'Agriculture'],
    supportModes: ['Funding', 'Mentorship'],
    website: 'https://tatasteelfoundation.org',
    spocName: 'Sourav Roy',
    designation: 'Chief of CSR',
    officialEmail: 'csr@tatasteelfoundation.org',
    loginEmail: 'csr@tatasteelfoundation.org',
    initialPassword: 'Ind@123456',
    mobileNumber: '9835012345',
    address: {
      addressLine1: 'Tata Steel Works',
      city: 'Jamshedpur',
      district: 'East Singhbhum',
      state: 'Jharkhand',
      pincode: '831001'
    },
    status: 'Active',
    verificationStatus: 'Verified',
    userId: null,
    financials: {
      csrCommittedCr: 12.5,
      supportedProjectsCount: 3,
      labsCount: 2
    }
  });

  await MongooseUser.findOneAndUpdate(
    { email: 'csr@tatasteelfoundation.org' },
    {
      fullName: 'Sourav Roy (Tata Steel)',
      email: 'csr@tatasteelfoundation.org',
      passwordHash: passHashInd,
      mobileNumber: '9835012345',
      role: 'INDUSTRY',
      accountStatus: 'ACTIVE',
      emailVerification: { verified: true, verifiedAt: new Date() }
    },
    { upsert: true, new: true }
  );

  console.log('Industries seeded.');

  // 3. Seed University Faculty
  console.log('Seeding University Faculty...');
  await UniversityFaculty.create([
    {
      universityCode: 'RU001',
      name: 'Dr. Priya Sharma',
      designation: 'Professor',
      department: 'Water Resources Engineering',
      email: 'priya.sharma@ru.ac.in',
      phone: '+91 94311 02931',
      specialization: ['Arsenic Mitigation', 'Hydrology'],
      experience: '15 Years',
      qualification: 'Ph.D. in Water Resources',
      researchAreas: ['Groundwater Quality', 'IoT Sensors'],
      activeProjects: 1,
      completedProjects: 4,
      availabilityStatus: 'Available'
    },
    {
      universityCode: 'RU001',
      name: 'Dr. Alok Prasad',
      designation: 'Associate Professor',
      department: 'Computer Science & Engineering',
      email: 'alok.prasad@ru.ac.in',
      phone: '+91 94311 02932',
      specialization: ['AI/ML', 'IoT Embedded Systems'],
      experience: '12 Years',
      qualification: 'Ph.D. in Computer Science',
      researchAreas: ['Edge Computing', 'Precision Agriculture'],
      activeProjects: 1,
      completedProjects: 2,
      availabilityStatus: 'Available'
    },
    {
      universityCode: 'RU001',
      name: 'Dr. Rajesh Chandra',
      designation: 'Professor',
      department: 'Electrical & Electronics',
      email: 'rajesh.chandra@ru.ac.in',
      phone: '+91 94311 02933',
      specialization: ['Power Systems', 'Solar Microgrids'],
      experience: '18 Years',
      qualification: 'Ph.D. in Renewable Energy',
      researchAreas: ['Microgrids', 'Grid Telemetry'],
      activeProjects: 1,
      completedProjects: 5,
      availabilityStatus: 'Available'
    }
  ]);

  // 4. Seed University Teams
  console.log('Seeding University Teams...');
  await UniversityTeam.create([
    {
      teamCode: 'TEAM-RU-01',
      universityCode: 'RU001',
      name: 'Smart Aqua Innovators',
      leader: 'Rahul Kumar (M.Tech CSE)',
      membersCount: 4,
      members: ['Rahul Kumar', 'Sneha Kumari', 'Amit Mahto', 'Priyanka Oraon'],
      project: 'IoT Ground Water Arsenic Detector',
      mentor: 'Dr. Priya Sharma',
      nepCredits: '4 Credits',
      status: 'Active'
    },
    {
      teamCode: 'TEAM-RU-02',
      universityCode: 'RU001',
      name: 'Ranchi AgriTech',
      leader: 'Ravi Kisku (B.Tech ECE)',
      membersCount: 4,
      members: ['Ravi Kisku', 'Anjali Munda', 'Sumit Oraon', 'Vikash Singh'],
      project: 'Ranchi smart Soil Moisture System',
      mentor: 'Dr. Alok Prasad',
      nepCredits: '4 Credits',
      status: 'Active'
    }
  ]);

  // 5. Seed University Challenges
  console.log('Seeding University Challenges...');
  await UniversityChallenge.create([
    {
      challengeId: 'CHL-1024',
      universityCode: 'RU001',
      title: 'Sensor-based Ground Water Arsenic Monitoring',
      domain: 'Water Quality & Monitoring',
      district: 'Ranchi',
      priority: 'High',
      status: 'Assigned',
      problemStatement: 'Arsenic contamination in drinking water sources across Ranchi rural blocks remains undetected, posing chronic health risks to residents.',
      affectedPopulation: '~ 12,500 People',
      aiCategory: 'Water Quality & Monitoring',
      requiredSkills: ['Embedded Systems', 'IoT', 'Sensor Networks'],
      locationDetails: { block: 'Namkum', villages: ['Lali', 'Saparom'], coordinates: '23.3444, 85.3999' },
      assignedFaculty: { id: 'F001', name: 'Dr. Priya Sharma', department: 'Water Resources Engineering', email: 'priya.sharma@ru.ac.in' }
    },
    {
      challengeId: 'CHL-1025',
      universityCode: 'RU001',
      title: 'Smart Soil Moisture Irrigation System',
      domain: 'Agriculture',
      district: 'Khunti',
      priority: 'Medium',
      status: 'Assigned',
      problemStatement: 'Irrigation management is highly inefficient in local farming communities, leading to water wastage and reduced crop yield.',
      affectedPopulation: '~ 8,00,000 Farmers', // Increased to match realistic scale if needed
      aiCategory: 'Precision Agriculture',
      requiredSkills: ['Sensors', 'Microcontrollers', 'Mobile Apps'],
      locationDetails: { block: 'Murhu', villages: ['Ganaloya', 'Selda'], coordinates: '22.9833, 85.2833' },
      assignedFaculty: { id: 'F002', name: 'Dr. Alok Prasad', department: 'Computer Science & Engineering', email: 'alok.prasad@ru.ac.in' }
    },
    {
      challengeId: 'CHL-1026',
      universityCode: 'RU001',
      title: 'Solar Microgrid Telemetry System',
      domain: 'Renewable Energy',
      district: 'Latehar',
      priority: 'High',
      status: 'Assigned',
      problemStatement: 'Rural solar microgrids lack real-time load and generation monitoring, causing frequent battery deep-discharge issues.',
      affectedPopulation: '~ 15,000 Rural Residents',
      aiCategory: 'Renewable Energy',
      requiredSkills: ['Power Electronics', 'LoRaWAN', 'Telemetry'],
      locationDetails: { block: 'Mahuadanr', villages: ['Orsa', 'Gari'], coordinates: '23.3900, 84.1100' },
      assignedFaculty: { id: 'F003', name: 'Dr. Rajesh Chandra', department: 'Electrical & Electronics', email: 'rajesh.chandra@ru.ac.in' }
    }
  ]);

  // 6. Seed University Projects (Active Projects)
  console.log('Seeding University Projects...');
  await UniversityProject.create([
    {
      projectId: 'PRJ-1024',
      challengeId: 'CHL-1024',
      universityCode: 'RU001',
      title: 'IoT Ground Water Arsenic Detector',
      domain: 'Water Quality & Monitoring',
      status: 'In Progress',
      progressPercentage: 60,
      leadMentor: 'Dr. Priya Sharma',
      facultyMentor: {
        name: 'Dr. Priya Sharma',
        department: 'Water Resources Engineering',
        email: 'priya.sharma@ru.ac.in'
      },
      studentTeam: 'Smart Aqua Innovators',
      teamMembersCount: 4,
      teamMembers: ['Rahul Kumar', 'Sneha Kumari', 'Amit Mahto', 'Priyanka Oraon'],
      problemStatement: 'Arsenic contamination in drinking water sources across Ranchi rural blocks remains undetected, posing chronic health risks to residents.',
      budget: '₹ 7,50,000',
      startDate: '20 May 2026',
      deadline: '30 Nov 2026',
      daysLeft: '192 days left',
      milestonesTotal: 3,
      milestonesCompleted: 1,
      milestones: [
        { id: 'M1', name: 'Sensor Array Development & Testing', status: 'Completed', progress: 100, remarks: 'Verified by NABL' },
        { id: 'M2', name: 'LoRaWAN Mesh Testing', status: 'In Progress', progress: 50, remarks: 'Telemetry broadcast active' },
        { id: 'M3', name: 'Final Handover & Approval', status: 'Pending', progress: 0 }
      ],
      documents: [
        { name: 'Detailed Project Report (DPR)', size: '2.4 MB', date: '22 May 2026' },
        { name: 'NABL Chemical Analysis Certificate', size: '1.1 MB', date: '10 June 2026' }
      ],
      recentActivity: [
        { text: 'Field calibration run in Lali village', timestamp: new Date() },
        { text: 'NABL Lab verification received', timestamp: new Date(Date.now() - 3600000) }
      ]
    },
    {
      projectId: 'PRJ-1025',
      challengeId: 'CHL-1025',
      universityCode: 'RU001',
      title: 'Ranchi smart Soil Moisture System',
      domain: 'Agriculture',
      status: 'In Progress',
      progressPercentage: 45,
      leadMentor: 'Dr. Alok Prasad',
      facultyMentor: {
        name: 'Dr. Alok Prasad',
        department: 'Computer Science & Engineering',
        email: 'alok.prasad@ru.ac.in'
      },
      studentTeam: 'Ranchi AgriTech',
      teamMembersCount: 4,
      teamMembers: ['Ravi Kisku', 'Anjali Munda', 'Sumit Oraon', 'Vikash Singh'],
      problemStatement: 'Irrigation management is highly inefficient in local farming communities, leading to water wastage and reduced crop yield.',
      budget: '₹ 5,00,000',
      startDate: '25 May 2026',
      deadline: '15 Dec 2026',
      daysLeft: '210 days left',
      milestonesTotal: 2,
      milestonesCompleted: 1,
      milestones: [
        { id: 'M1', name: 'Site Selection & Soil Mapping', status: 'Completed', progress: 100, remarks: 'Completed at Murhu block' },
        { id: 'M2', name: 'Sensor Probe Prototype Fabrication', status: 'Pending', progress: 0 }
      ],
      documents: [
        { name: 'Technical Architecture Schema', size: '1.8 MB', date: '26 May 2026' }
      ],
      recentActivity: [
        { text: 'Soil samples gathered from Murhu', timestamp: new Date() }
      ]
    },
    {
      projectId: 'PRJ-1026',
      challengeId: 'CHL-1026',
      universityCode: 'RU001',
      title: 'State Solar Microgrid Network',
      domain: 'Renewable Energy',
      status: 'In Progress',
      progressPercentage: 80,
      leadMentor: 'Dr. Rajesh Chandra',
      facultyMentor: {
        name: 'Dr. Rajesh Chandra',
        department: 'Electrical & Electronics',
        email: 'rajesh.chandra@ru.ac.in'
      },
      studentTeam: 'BIT Solar Cell Team',
      teamMembersCount: 5,
      teamMembers: ['Abhishek Roy', 'Pooja Verma', 'Karan Munda', 'Rita Roy', 'John Gari'],
      problemStatement: 'Rural solar microgrids lack real-time load and generation monitoring, causing frequent battery deep-discharge issues.',
      budget: '₹ 12,00,000',
      startDate: '18 May 2026',
      deadline: '20 Nov 2026',
      daysLeft: '182 days left',
      milestonesTotal: 3,
      milestonesCompleted: 2,
      milestones: [
        { id: 'M1', name: 'Inverter Design & Control Board', status: 'Completed', progress: 100 },
        { id: 'M2', name: 'Cell Array Assembly & Rack Setup', status: 'Completed', progress: 100 },
        { id: 'M3', name: 'Telemetry Node Integration', status: 'In Progress', progress: 40 }
      ],
      documents: [
        { name: 'Microgrid Controller Spec sheet', size: '3.1 MB', date: '19 May 2026' }
      ],
      recentActivity: [
        { text: 'Inverter design approved by Lab head', timestamp: new Date() }
      ]
    }
  ]);

  // 7. Seed University Activities
  console.log('Seeding University Activities...');
  await UniversityActivity.create([
    { universityCode: 'RU001', text: 'Dr. Priya Sharma submitted chemical analysis lab reports for PRJ-1024 deliverable verification.', type: 'success' },
    { universityCode: 'RU001', text: 'Smart Aqua Innovators team registered 4 members under PRJ-1024 IoT development framework.', type: 'info' }
  ]);

  console.log('--- Database successfully seeded with authentic datasets! ---');
  await closeMongo();
  process.exit(0);
};

seedData().catch(async (err) => {
  console.error('Seeding failed', err);
  await closeMongo();
  process.exit(1);
});
