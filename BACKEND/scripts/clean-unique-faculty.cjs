const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.URL;

const cleanFacultyList = [
  {
    name: 'Dr. Priya Sharma',
    designation: 'Professor & Dean R&D',
    department: 'Computer Science & Engineering',
    email: 'priya.sharma@ru.ac.in',
    phone: '+91 98351 10001',
    specialization: ['Artificial Intelligence', 'IoT Systems', 'Data Science'],
    experience: '16 Years',
    qualification: 'Ph.D. (IIT Kharagpur)',
    researchAreas: ['AI in Smart Water Grids', 'Edge Computing', 'Environmental Telemetry'],
    availabilityStatus: 'Available',
    bio: 'Pioneered several IoT sensor deployment initiatives in Jharkhand with state department funding.',
    totalProjects: { active: 1, completed: 8 },
    currentLoad: 1,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Arvind Kumar',
    designation: 'Associate Professor',
    department: 'Computer Science & Engineering',
    email: 'arvind.kumar@ru.ac.in',
    phone: '+91 98351 10002',
    specialization: ['Cloud Architecture', 'Distributed Systems', 'Blockchain'],
    experience: '12 Years',
    qualification: 'Ph.D. (BIT Mesra)',
    researchAreas: ['Decentralized Governance', 'Cloud Security'],
    availabilityStatus: 'Available',
    bio: 'Lead coordinator for state institutional data centers and distributed ledgers.',
    totalProjects: { active: 0, completed: 5 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. S. N. Soren',
    designation: 'Professor & Head',
    department: 'Civil Engineering',
    email: 'soren.sn@ru.ac.in',
    phone: '+91 98351 10003',
    specialization: ['Structural Engineering', 'Rural Road Infrastructure', 'GIS Mapping'],
    experience: '20 Years',
    qualification: 'Ph.D. (IIT Roorkee)',
    researchAreas: ['Sustainable Pavements', 'Disaster Resilient Bridges'],
    availabilityStatus: 'Available',
    bio: 'Adviser to Jharkhand State Rural Road Development Authority (JSRRDA).',
    totalProjects: { active: 0, completed: 11 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Neha Verma',
    designation: 'Associate Professor',
    department: 'Electrical Engineering',
    email: 'neha.verma@ru.ac.in',
    phone: '+91 98351 10004',
    specialization: ['Renewable Energy', 'Microgrid Systems', 'Power Electronics'],
    experience: '11 Years',
    qualification: 'Ph.D. (NIT Jamshedpur)',
    researchAreas: ['Solar Hybrid Systems', 'Battery Energy Storage Systems'],
    availabilityStatus: 'Available',
    bio: 'Technical lead for tribal village solar microgrid electrification projects.',
    totalProjects: { active: 0, completed: 4 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Amitabh Verma',
    designation: 'Professor',
    department: 'Mechanical Engineering',
    email: 'amitabh.verma@ru.ac.in',
    phone: '+91 98351 10005',
    specialization: ['Thermal Engineering', 'Agricultural Machinery', 'Robotics'],
    experience: '18 Years',
    qualification: 'Ph.D. (IIT Kanpur)',
    researchAreas: ['Low-cost Farm Automation', 'Solar Dehydrators for Forest Produce'],
    availabilityStatus: 'Available',
    bio: 'Specialist in custom agro-machinery and small-scale tribal farm equipment.',
    totalProjects: { active: 0, completed: 9 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Sandeep Oraon',
    designation: 'Assistant Professor',
    department: 'Biotechnology',
    email: 'sandeep.oraon@ru.ac.in',
    phone: '+91 98351 10006',
    specialization: ['Medicinal Plants', 'Bio-Remediation', 'Plant Tissue Culture'],
    experience: '8 Years',
    qualification: 'Ph.D. (Ranchi University)',
    researchAreas: ['Jharkhand Native Herbal Extraction', 'Mine Water Bio-Filtration'],
    availabilityStatus: 'Available',
    bio: 'Conducting indigenous flora biodiversity mapping across Chota Nagpur plateau.',
    totalProjects: { active: 0, completed: 3 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Ananya Mukherjee',
    designation: 'Associate Professor',
    department: 'Environmental Science',
    email: 'ananya.mukherjee@ru.ac.in',
    phone: '+91 98351 10007',
    specialization: ['Hydrology', 'Water Quality Assessment', 'Environmental Impact Studies'],
    experience: '14 Years',
    qualification: 'Ph.D. (ISM Dhanbad)',
    researchAreas: ['Groundwater Arsenic Mapping', 'Industrial Effluent Treatment'],
    availabilityStatus: 'Available',
    bio: 'Consultant on environmental compliance and industrial water recycling.',
    totalProjects: { active: 0, completed: 7 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Rajesh Toppo',
    designation: 'Professor & Dean',
    department: 'Social Work',
    email: 'rajesh.toppo@ru.ac.in',
    phone: '+91 98351 10008',
    specialization: ['Tribal Livelihoods', 'Rural Development Policy', 'Community Mobilization'],
    experience: '22 Years',
    qualification: 'Ph.D. (TISS Mumbai)',
    researchAreas: ['Minor Forest Produce Value Chain', 'Self Help Group Economics'],
    availabilityStatus: 'Available',
    bio: 'Lead researcher on Jharkhand PVTG (Particularly Vulnerable Tribal Groups) empowerment.',
    totalProjects: { active: 0, completed: 14 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Sunita Kujur',
    designation: 'Assistant Professor',
    department: 'Chemistry',
    email: 'sunita.kujur@ru.ac.in',
    phone: '+91 98351 10009',
    specialization: ['Analytical Chemistry', 'Polymer Science', 'Water Treatment Chemistry'],
    experience: '9 Years',
    qualification: 'Ph.D. (BHU Varanasi)',
    researchAreas: ['Polymeric Adsorbents for Heavy Metals', 'Soil Nutrient Profiling'],
    availabilityStatus: 'Available',
    bio: 'Published research on low-cost fluoride adsorption using modified clay minerals.',
    totalProjects: { active: 0, completed: 4 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Deepak Munda',
    designation: 'Associate Professor',
    department: 'Mechanical Engineering',
    email: 'deepak.munda@ru.ac.in',
    phone: '+91 98351 10010',
    specialization: ['Materials Testing', 'Additive Manufacturing', 'CAD/CAM Prototyping'],
    experience: '13 Years',
    qualification: 'Ph.D. (NIT Rourkela)',
    researchAreas: ['3D Printed Prosthetics', 'Lightweight Agricultural Components'],
    availabilityStatus: 'Available',
    bio: 'Director of Central Fabrication and 3D Prototyping Cell.',
    totalProjects: { active: 0, completed: 6 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Rashmi Tiwari',
    designation: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    email: 'rashmi.tiwari@ru.ac.in',
    phone: '+91 98351 10011',
    specialization: ['Cyber Security', 'Network Protocols', 'Mobile App Systems'],
    experience: '7 Years',
    qualification: 'Ph.D. (IIIT Allahabad)',
    researchAreas: ['IoT Security Gateways', 'Rural Digital Health Telemedicine'],
    availabilityStatus: 'Available',
    bio: 'Mentor for state hackathons and women in engineering student chapters.',
    totalProjects: { active: 0, completed: 2 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  },
  {
    name: 'Dr. Manoj Hansda',
    designation: 'Professor',
    department: 'Civil Engineering',
    email: 'manoj.hansda@ru.ac.in',
    phone: '+91 98351 10012',
    specialization: ['Geotechnical Engineering', 'Soil Stabilization', 'Foundations'],
    experience: '19 Years',
    qualification: 'Ph.D. (IIT Delhi)',
    researchAreas: ['Fly-ash Soil Stabilization in Mining Belts', 'Slope Stability Analysis'],
    availabilityStatus: 'Available',
    bio: 'Consultant for state highway embankment stability and open-cast slope safety.',
    totalProjects: { active: 0, completed: 10 },
    currentLoad: 0,
    status: 'Active',
    universityCode: 'RU001'
  }
];

async function run() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    const Faculty = mongoose.connection.collection('university_faculty');

    const deleteRes = await Faculty.deleteMany({});
    console.log('Deleted old faculty records count:', deleteRes.deletedCount);

    const insertRes = await Faculty.insertMany(cleanFacultyList);
    console.log('Inserted clean unique faculty records count:', insertRes.insertedCount);

    const count = await Faculty.countDocuments();
    console.log('Verified current total unique faculty count in DB:', count);

    process.exit(0);
  } catch (err) {
    console.error('Error cleaning faculty:', err);
    process.exit(1);
  }
}

run();
