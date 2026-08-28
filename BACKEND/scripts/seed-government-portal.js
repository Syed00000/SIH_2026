import dotenv from 'dotenv';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';
import { MongooseAdmin } from '../src/modules/government/admins/infrastructure/model.js';
import { MongooseIndustry } from '../src/modules/government/industries/infrastructure/model.js';
import { MongooseUniversity } from '../src/modules/government/heis/infrastructure/model.js';

dotenv.config();

const ADMIN_SEEDS = [
  { fullName: 'Ankit Sharma', username: 'ankit.sharma', email: 'ankit.sharma@jh.gov.in', role: 'Super Admin', district: 'Ranchi', mobileNumber: '9876543210', status: 'Active', avatarColor: 'purple' },
  { fullName: 'Ritu Verma', username: 'ritu.verma', email: 'ritu.verma@jh.gov.in', role: 'Nodal Officer', district: 'Dhanbad', mobileNumber: '9123456789', status: 'Active', avatarColor: 'green' },
  { fullName: 'Prakash Singh', username: 'prakash.singh', email: 'prakash.singh@jh.gov.in', role: 'District Admin', district: 'Jamshedpur', mobileNumber: '9234567890', status: 'Active', avatarColor: 'orange' },
  { fullName: 'Sanjay Murmu', username: 'sanjay.murmu', email: 'sanjay.murmu@jh.gov.in', role: 'District Admin', district: 'Dumka', mobileNumber: '9431188990', status: 'Active', avatarColor: 'emerald' },
  { fullName: 'Pooja Agarwal', username: 'pooja.agarwal', email: 'pooja.agarwal@jh.gov.in', role: 'Nodal Officer', district: 'Hazaribagh', mobileNumber: '9835012345', status: 'Active', avatarColor: 'violet' }
];

const INDUSTRY_SEEDS = [
  {
    industryId: 'IND-TATA-01',
    legalName: 'Tata Steel CSR Foundation',
    shortName: 'Tata Steel',
    category: 'CSR',
    registrationNumber: 'CSR-JH-2021-009',
    thematicDomain: 'Water & Sanitation',
    thematicDomains: ['Water & Sanitation', 'Healthcare & Nutrition'],
    supportModes: ['Funding', 'Mentorship', 'Field Trials'],
    spocName: 'Rajeev Singhal',
    spocDesignation: 'VP - Corporate Services',
    officialEmail: 'csr.jharkhand@tatasteel.com',
    mobileNumber: '9835122110',
    state: 'Jharkhand',
    district: 'East Singhbhum',
    financials: { csrCommittedCr: 25.0, supportedProjectsCount: 8, labsCount: 3 },
    status: 'Active',
    accessStatus: 'Enabled'
  },
  {
    industryId: 'IND-JIND-02',
    legalName: 'Jindal Steel & Power Community Trust',
    shortName: 'Jindal Power',
    category: 'Private Industry',
    registrationNumber: 'CSR-JH-2022-044',
    thematicDomain: 'Renewable Energy',
    thematicDomains: ['Renewable Energy', 'Tribal Livelihood'],
    supportModes: ['Funding', 'Incubation Support'],
    spocName: 'Manish Agarwal',
    spocDesignation: 'Head - CSR Operations',
    officialEmail: 'csr@jindalpower.com',
    mobileNumber: '9835233440',
    state: 'Jharkhand',
    district: 'Ramgarh',
    financials: { csrCommittedCr: 18.5, supportedProjectsCount: 5, labsCount: 2 },
    status: 'Active',
    accessStatus: 'Enabled'
  },
  {
    industryId: 'IND-COAL-03',
    legalName: 'Central Coalfields Limited CSR Wing',
    shortName: 'CCL Ranchi',
    category: 'PSU',
    registrationNumber: 'PSU-JH-1975-001',
    thematicDomain: 'Environmental Bio-Remediation',
    thematicDomains: ['Environmental Bio-Remediation', 'Education & Skill Development'],
    supportModes: ['Funding', 'Lab Access', 'Data Sharing'],
    spocName: 'Dr. B. K. Soren',
    spocDesignation: 'General Manager - CSR',
    officialEmail: 'csr.ccl@coalindia.in',
    mobileNumber: '9431177880',
    state: 'Jharkhand',
    district: 'Ranchi',
    financials: { csrCommittedCr: 30.0, supportedProjectsCount: 12, labsCount: 4 },
    status: 'Active',
    accessStatus: 'Enabled'
  }
];

const seedGovernmentData = async () => {
  try {
    await connectMongo();
    console.log('🌱 Seeding Government Admins & Industries to MongoDB Atlas...');

    for (const adm of ADMIN_SEEDS) {
      await MongooseAdmin.findOneAndUpdate({ email: adm.email }, { $set: adm }, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${ADMIN_SEEDS.length} Administrative Officers in MongoDB.`);

    for (const ind of INDUSTRY_SEEDS) {
      await MongooseIndustry.findOneAndUpdate({ industryId: ind.industryId }, { $set: ind }, { upsert: true, new: true });
    }
    console.log(`✅ Seeded ${INDUSTRY_SEEDS.length} Industrial CSR Partners in MongoDB.`);

    console.log('\n🎉 Government collections successfully synced with real data in MongoDB Atlas!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

seedGovernmentData();
