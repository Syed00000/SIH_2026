/**
 * Jharkhand Societal Innovation Hub - Projects & Solutions Comprehensive Dataset
 * Real-world interconnected data for Innovation Lifecycle Management, Proposals,
 * Active Projects, Milestones, Prototypes, Deployments, and Regional Mapping.
 */

export const PROJECTS_AND_SOLUTIONS_KPIS = {
  totalChallenges: 124,
  totalChallengesChange: '+12 this month',
  solutionProposals: 86,
  solutionProposalsChange: '+8 this month',
  projectsApproved: 42,
  projectsApprovedChange: '+6 this month',
  inProgress: 28,
  inProgressChange: 'Active R&D',
  deployed: 11,
  deployedChange: '+2 this month',
  completed: 7,
  completedChange: '+1 this month'
};

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
  'Ranchi',
  'Dhanbad',
  'East Singhbhum',
  'Bokaro',
  'Deoghar',
  'Hazaribagh',
  'Dumka',
  'Palamu',
  'West Singhbhum',
  'Giridih',
  'Ramgarh',
  'Seraikela Kharsawan'
];

export const INITIAL_SOLUTION_PROPOSALS = [
  {
    id: 'PROP-201',
    title: 'AI Crop Disease & Pest Detector',
    shortCode: 'AI-AGR-201',
    sector: 'Agriculture & Food',
    district: 'Dhanbad',
    hei: 'BIT Sindri',
    heiType: 'State Technical University',
    teamLead: 'Kartik Kumar',
    leadEmail: 'kartik.agr@bitsindri.ac.in',
    leadMobile: '+91 94311 82910',
    teamMembers: ['Kartik Kumar (Lead)', 'Dr. R. K. Soren (Guide)', 'Pooja Verma (AI Engineer)', 'Amit Hansda (Agronomist)'],
    submittedTime: '3 hours ago',
    submissionDate: '2026-08-26',
    status: 'New Submission', // 'New Submission', 'Pending Review', 'High Priority', 'Under Evaluation', 'Verified', 'Approved', 'Rejected'
    requestedGrant: '₹ 18.5 Lakhs',
    estimatedDuration: '8 Months',
    abstract: 'Edge-AI powered handheld smartphone spectrometer device capable of early detection of blast disease and brown spot in Jharkhand paddy fields with 96.4% field accuracy without continuous internet connectivity.',
    problemStatement: 'Paddy crops in Santhal Pargana and Kolhan regions suffer up to 34% yield loss annually due to unaddressed bacterial leaf blight and stem borer infestations diagnosed late by tribal farmers.',
    methodology: 'Lightweight MobileNetV3 model trained on 42,000 localized leaf anomaly images; edge inference on low-cost NPU chip embedded inside a rugged dust-proof optical casing.',
    targetBeneficiaries: '35,000+ smallholder paddy farmers across 6 tribal blocks in Jharkhand.',
    budgetBreakdown: [
      { item: 'NPU Hardware Prototyping & Optical Sensors', amount: '₹ 6,20,000' },
      { item: 'Dataset Collection & Field Annotation in 5 Districts', amount: '₹ 4,10,000' },
      { item: 'Cloud Training Cluster & ML Optimization', amount: '₹ 3,20,000' },
      { item: 'Pilot Field Testing Kits (50 Units for KVKs)', amount: '₹ 3,50,000' },
      { item: 'Institutional Overhead & Contingency', amount: '₹ 1,50,000' }
    ],
    documents: [
      { name: 'Technical_Architecture_Dossier_v1.2.pdf', size: '3.4 MB', type: 'PDF' },
      { name: 'Detailed_Project_Report_Budget.xlsx', size: '1.8 MB', type: 'XLSX' },
      { name: 'BIT_Sindri_Institutional_Endorsement.pdf', size: '890 KB', type: 'PDF' },
      { name: 'Lab_Benchmarking_Accuracy_Report.pdf', size: '2.1 MB', type: 'PDF' }
    ],
    reviewerScore: 92,
    reviewerNotes: 'Strong domain alignment with state agriculture priorities. Hardware bill of materials is cost-effective for mass manufacturing.'
  },
  {
    id: 'PROP-202',
    title: 'IoT Ground Water Quality Monitor & Arsenic Alert',
    shortCode: 'IOT-WTR-202',
    sector: 'Water & Sanitation',
    district: 'East Singhbhum',
    hei: 'NIT Jamshedpur',
    heiType: 'NIT / Institute of National Importance',
    teamLead: 'Anjali Sharma',
    leadEmail: 'anjali.res@nitjsr.ac.in',
    leadMobile: '+91 98351 90234',
    teamMembers: ['Anjali Sharma (Lead)', 'Prof. A. K. Choudhary', 'Manish Rawani', 'Simran Murmu'],
    submittedTime: '1 day ago',
    submissionDate: '2026-08-25',
    status: 'Pending Review',
    requestedGrant: '₹ 22.0 Lakhs',
    estimatedDuration: '10 Months',
    abstract: 'Submersible multiparameter sensor node measuring TDS, pH, Arsenic, Fluoride, and heavy metals in real-time, transmitting hourly telemetry over LoRaWAN to Jharkhand Jal Seva servers.',
    problemStatement: 'Over 180 rural panchayats in Sahibganj and Bokaro experience heavy iron, arsenic and fluoride contamination in handpump aquifers causing chronic fluorosis and renal disorders.',
    methodology: 'Electrochemical solid-state ion-selective electrodes with auto-cleaning ultrasonics, solar micro-harvesting power supply, and mesh radio relay nodes.',
    targetBeneficiaries: '1,20,000+ residents in high-fluoride rural habitation clusters.',
    budgetBreakdown: [
      { item: 'Electrochemical Sensor Fabrication & Gold Micro-electrodes', amount: '₹ 8,50,000' },
      { item: 'LoRaWAN Gateway Installations in 3 Blocks', amount: '₹ 4,80,000' },
      { item: 'Calibration & NABL Lab Verification Tests', amount: '₹ 3,40,000' },
      { item: 'Field Demonstration & Community Awareness Hubs', amount: '₹ 3,80,000' },
      { item: 'Contingency & Audit Fee', amount: '₹ 1,50,000' }
    ],
    documents: [
      { name: 'NITJSR_Water_Quality_Sensor_TechSpec.pdf', size: '4.2 MB', type: 'PDF' },
      { name: 'Financial_Sanction_Breakup.pdf', size: '1.1 MB', type: 'PDF' },
      { name: 'Jharkhand_Water_Board_NOC.pdf', size: '740 KB', type: 'PDF' }
    ],
    reviewerScore: 88,
    reviewerNotes: 'Innovative use of ultrasonic self-cleaning extends sensor lifespan in rural deep borewells without frequent manual recalibration.'
  },
  {
    id: 'PROP-203',
    title: 'Underground Coalmine Gas Alert & Worker Telemetry System',
    shortCode: 'COAL-MIN-203',
    sector: 'Mining & Energy',
    district: 'Ranchi',
    hei: 'Ranchi University',
    heiType: 'State Public University',
    teamLead: 'Rohan Verma',
    leadEmail: 'rohan.physics@ranchiuniversity.ac.in',
    leadMobile: '+91 94313 77120',
    teamMembers: ['Rohan Verma (Lead)', 'Dr. S. K. Sinha', 'Abhishek Toppo', 'Kavita Mahato'],
    submittedTime: '2 days ago',
    submissionDate: '2026-08-24',
    status: 'High Priority',
    requestedGrant: '₹ 28.0 Lakhs',
    estimatedDuration: '12 Months',
    abstract: 'Intrinsically safe ATEX-compliant wearable helmet module with Methane (CH4), Carbon Monoxide (CO), and Oxygen starvation sensors coupled with Sub-GHz through-the-earth communication.',
    problemStatement: 'Underground mining shafts in Jharia and Ramgarh suffer hazardous toxic gas build-ups and ventilation failures that risk miner safety due to lack of real-time localized alerting.',
    methodology: 'NDIR optical methane sensor matrix with integrated bone-conduction siren, panic beacon, and low-frequency mesh broadcast capable of penetrating 40 meters of coal strata.',
    targetBeneficiaries: '14,000+ underground coal mine workers across BCCL and CCL coalfields.',
    budgetBreakdown: [
      { item: 'Flameproof Casing & ATEX Certification Testing', amount: '₹ 10,20,000' },
      { item: 'Optical Gas Sensors & FPGA Processing Boards', amount: '₹ 8,40,000' },
      { item: 'Shaft Radio Transceiver Testbed Deployment', amount: '₹ 5,10,000' },
      { item: 'Mine Safety Directorate Field Trials', amount: '₹ 2,80,000' },
      { item: 'Project Admin & Documentation', amount: '₹ 1,50,000' }
    ],
    documents: [
      { name: 'Mine_Safety_Gas_Telemetry_Proposal.pdf', size: '5.6 MB', type: 'PDF' },
      { name: 'DGMS_Compliance_Roadmap.pdf', size: '2.0 MB', type: 'PDF' }
    ],
    reviewerScore: 95,
    reviewerNotes: 'Crucial life-safety solution. High priority endorsement for coal belt worker protection.'
  },
  {
    id: 'PROP-204',
    title: 'Rural Telemedicine Health Kiosk & AI Triage Station',
    shortCode: 'MED-HLT-204',
    sector: 'Healthcare & Telemedicine',
    district: 'Dhanbad',
    hei: 'IIT (ISM) Dhanbad',
    heiType: 'IIT / Central Premier Institution',
    teamLead: 'Priya Singh',
    leadEmail: 'priya.singh@iitism.ac.in',
    leadMobile: '+91 97714 88391',
    teamMembers: ['Priya Singh (Lead)', 'Prof. V. M. S. R. Murthy', 'Dr. Alok Ranjan', 'Neha Kumari'],
    submittedTime: '3 days ago',
    submissionDate: '2026-08-23',
    status: 'Under Evaluation',
    requestedGrant: '₹ 32.5 Lakhs',
    estimatedDuration: '12 Months',
    abstract: 'Solar-powered self-diagnostic kiosk providing 12 point non-invasive vital checks (ECG, SPO2, Blood Pressure, Hemoglobin, Dermascopy) with multilingual voice guidance in Santali, Mundari, Ho, and Hindi.',
    problemStatement: 'Remote PHCs in tribal highlands face 78% shortage of specialist doctors. Villagers travel over 60 km for basic diagnostic screenings.',
    methodology: 'Plug-and-play medical grade IoT sensors with encrypted FHIR health record transmission over 4G/Satellite backup, integrated with RIMS Ranchi specialist tele-consultation queue.',
    targetBeneficiaries: '85,000+ tribal citizens in West Singhbhum and Latehar districts.',
    budgetBreakdown: [
      { item: 'Medical Grade Vital Sensor Integrations & Calibration', amount: '₹ 11,50,000' },
      { item: 'Ruggedized Solar Kiosk Fabrication (5 Prototype Units)', amount: '₹ 9,80,000' },
      { item: 'Tribal Language NLP Voice Interface Development', amount: '₹ 4,50,000' },
      { item: 'RIMS Telemedicine Server & API Gateway', amount: '₹ 4,20,000' },
      { item: 'Field Validation Staff & Operational Kits', amount: '₹ 2,50,000' }
    ],
    documents: [
      { name: 'Rural_Telemedicine_Kiosk_Detailed_DPR.pdf', size: '4.9 MB', type: 'PDF' },
      { name: 'Clinical_Safety_Protocol.pdf', size: '1.7 MB', type: 'PDF' },
      { name: 'IIT_Dhanbad_Ethics_Clearance.pdf', size: '820 KB', type: 'PDF' }
    ],
    reviewerScore: 91,
    reviewerNotes: 'Multilingual vernacular support in Santali and Mundari is exemplary for grassroots adoption.'
  },
  {
    id: 'PROP-205',
    title: 'Solar Powered Cold Storage Box with Phase Change Material',
    shortCode: 'SOL-COLD-205',
    sector: 'Agriculture & Food',
    district: 'Ranchi',
    hei: 'XIMR Ranchi',
    heiType: 'Private Autonomous Institute',
    teamLead: 'Aman Mehta',
    leadEmail: 'aman.mehta@ximr.ac.in',
    leadMobile: '+91 94311 02844',
    teamMembers: ['Aman Mehta (Lead)', 'Dr. Binod Kumar', 'Suresh Oraon'],
    submittedTime: '4 days ago',
    submissionDate: '2026-08-22',
    status: 'Verified',
    requestedGrant: '₹ 16.0 Lakhs',
    estimatedDuration: '6 Months',
    abstract: 'Modular 200 kg solar direct-drive micro-cold storage unit utilizing organic phase change materials (PCM) to maintain 4°C for 36 hours without grid electricity or chemical batteries.',
    problemStatement: 'Horticultural produce like tomatoes and strawberries grown in Bero and Ormanjhi blocks decay quickly during summer heatwaves due to zero cold chain infrastructure.',
    methodology: 'Direct DC rotary inverter compressor powered by 800W bifacial solar PV panels with eco-friendly PCM thermal thermal storage plates embedded in PUF insulated walls.',
    targetBeneficiaries: '2,500+ small-scale vegetable and floriculture farmers.',
    budgetBreakdown: [
      { item: 'PCM Material Formulation & Thermal Chamber Fabrication', amount: '₹ 5,80,000' },
      { item: 'Solar DC Inverter Compressor Hardware', amount: '₹ 4,20,000' },
      { item: 'Temperature & Humidity IoT Monitoring Nodes', amount: '₹ 2,10,000' },
      { item: 'Farmer Field Trials in 3 Mandis', amount: '₹ 2,70,000' },
      { item: 'Contingency & Reporting', amount: '₹ 1,20,000' }
    ],
    documents: [
      { name: 'PCM_Cold_Storage_Technical_Design.pdf', size: '3.1 MB', type: 'PDF' },
      { name: 'XIMR_Incubation_Approval.pdf', size: '650 KB', type: 'PDF' }
    ],
    reviewerScore: 89,
    reviewerNotes: 'Zero chemical battery maintenance makes it ideally sustainable for tribal farmer cooperatives.'
  },
  {
    id: 'PROP-206',
    title: 'Smart Pothole & Road Hazard Detection with LiDAR Mapping',
    shortCode: 'ROD-INF-206',
    sector: 'Infrastructure & Transport',
    district: 'Hazaribagh',
    hei: 'UCET Hazaribagh',
    heiType: 'State University Engineering College',
    teamLead: 'Neha Gupta',
    leadEmail: 'neha.gupta@ucet.ac.in',
    leadMobile: '+91 93041 55920',
    teamMembers: ['Neha Gupta (Lead)', 'Prof. Rajeshwar Prasad', 'Vikram Tigga'],
    submittedTime: '5 days ago',
    submissionDate: '2026-08-21',
    status: 'New Submission',
    requestedGrant: '₹ 14.5 Lakhs',
    estimatedDuration: '7 Months',
    abstract: 'Automated vehicle-mountable computer vision camera and single-beam LiDAR pod that maps road craters, cracks, and erosion spots automatically during government bus transit routes.',
    problemStatement: 'Monsoon flash floods in Hazaribagh and Ramgarh deteriorate rural roads rapidly, causing high accident rates and delayed road contractor maintenance.',
    methodology: 'Real-time road surface depth estimation using stereo optics, auto-geotagging road damage severity index, integrated with State PWD GIS road dashboard.',
    targetBeneficiaries: 'State Road Construction Dept & 4,50,000+ daily highway commuters.',
    budgetBreakdown: [
      { item: 'Stereo Vision & LiDAR Sensor Hardware Pods (10 Units)', amount: '₹ 5,20,000' },
      { item: 'State Road Surface AI Training Dataset Creation', amount: '₹ 3,40,000' },
      { item: 'PWD GIS Portal API Integration', amount: '₹ 2,90,000' },
      { item: 'State Transport Bus Pilot Installation', amount: '₹ 2,00,000' },
      { item: 'Project Documentation & Testing', amount: '₹ 1,00,000' }
    ],
    documents: [
      { name: 'LiDAR_Road_Inspection_Proposal.pdf', size: '2.8 MB', type: 'PDF' },
      { name: 'UCET_Department_Approval.pdf', size: '920 KB', type: 'PDF' }
    ],
    reviewerScore: 86,
    reviewerNotes: 'Simple retrofittable unit for public transport buses creates a continuous road audit loop.'
  },
  {
    id: 'PROP-207',
    title: 'Tribal Vernacular Language Learning & Literacy App',
    shortCode: 'TRB-EDU-207',
    sector: 'Tribal Tech & Education',
    district: 'Dumka',
    hei: 'Sido Kanhu Murmu University',
    heiType: 'State Public University',
    teamLead: 'Sonali Soren',
    leadEmail: 'sonali.soren@skmu.ac.in',
    leadMobile: '+91 94701 44102',
    teamMembers: ['Sonali Soren (Lead)', 'Dr. Anil Murmu', 'Prakash Hembrom'],
    submittedTime: '6 days ago',
    submissionDate: '2026-08-20',
    status: 'Pending Review',
    requestedGrant: '₹ 12.0 Lakhs',
    estimatedDuration: '6 Months',
    abstract: 'Interactive gamified educational app teaching primary mathematics and science concepts in Ol Chiki script and Santali audio for grades 1 to 5.',
    problemStatement: 'High primary school dropout rates among tribal children due to immediate Hindi-medium transition without mother tongue foundational learning materials.',
    methodology: 'Culturally localized storytelling, animated folk characters, speech recognition for Santali pronunciation scoring, offline sync for low-connectivity zones.',
    targetBeneficiaries: '50,000+ tribal students in Santhal Pargana primary schools.',
    budgetBreakdown: [
      { item: 'Linguistic Audio Corpus Recording & Ol Chiki Fonts', amount: '₹ 3,80,000' },
      { item: 'Mobile App UX/UI Design & Gamification Engine', amount: '₹ 4,20,000' },
      { item: 'Offline Content Preload on 200 School Tablets', amount: '₹ 2,50,000' },
      { item: 'Teacher Training Workshops in Dumka & Godda', amount: '₹ 1,50,000' }
    ],
    documents: [
      { name: 'Tribal_Education_App_Proposal.pdf', size: '3.6 MB', type: 'PDF' }
    ],
    reviewerScore: 90,
    reviewerNotes: 'High cultural impact aligning directly with NEP 2020 mother-tongue foundational literacy goals.'
  },
  {
    id: 'PROP-208',
    title: 'Fluoride Filtration Nano-Membrane Cartridge for Handpumps',
    shortCode: 'NANO-FLR-208',
    sector: 'Water & Sanitation',
    district: 'Palamu',
    hei: 'Nilamber-Pitamber University',
    heiType: 'State Public University',
    teamLead: 'Dr. Vivek Pandey',
    leadEmail: 'vivek.chem@npu.ac.in',
    leadMobile: '+91 98353 11890',
    teamMembers: ['Dr. Vivek Pandey (Lead)', 'Sunita Minz', 'Ramesh Yadav'],
    submittedTime: '1 week ago',
    submissionDate: '2026-08-19',
    status: 'Under Evaluation',
    requestedGrant: '₹ 20.0 Lakhs',
    estimatedDuration: '9 Months',
    abstract: 'Low-cost bio-char and nano-graphene composite filtration cylinder retrofittable onto standard India Mark II handpump spouts reducing fluoride from 8.5 ppm to safe < 0.8 ppm.',
    problemStatement: 'Severe skeletal and dental fluorosis prevalent in Palamu and Garhwa blocks due to natural fluoride leaching into deep granitic aquifers.',
    methodology: 'Acid-activated agricultural waste biochar combined with zirconium metal-organic framework (MOF) beads for high selective fluoride ion adsorption without chemical backwashing.',
    targetBeneficiaries: '45,000+ villagers in endemic fluorosis zones.',
    budgetBreakdown: [
      { item: 'Nano-composite synthesis & Pilot Batch Production', amount: '₹ 7,50,000' },
      { item: 'Handpump Adapter Casing Tooling & Molds', amount: '₹ 5,00,000' },
      { item: 'NABL Water Purity Testing & Certification', amount: '₹ 3,50,000' },
      { item: 'Panchayat Level Community Deployment (30 Units)', amount: '₹ 2,80,000' },
      { item: 'Contingency', amount: '₹ 1,20,000' }
    ],
    documents: [
      { name: 'Fluoride_NanoFilter_DPR.pdf', size: '4.1 MB', type: 'PDF' }
    ],
    reviewerScore: 94,
    reviewerNotes: 'Highly cost-effective water purification technology developed with indigenous Jharkhand biochar materials.'
  }
];

export const INITIAL_ACTIVE_PROJECTS = [
  {
    id: 'PRJ-101',
    title: 'IoT Water Quality Sensor & Telemetry Node',
    shortCode: 'WTR-PRJ-101',
    sector: 'Water & Sanitation',
    district: 'Dhanbad',
    hei: 'BIT Sindri',
    heiType: 'State Technical University',
    teamLead: 'Prof. Kartik Kumar',
    leadEmail: 'kartik.agr@bitsindri.ac.in',
    milestonePhase: 'Phase 3: Field Testing',
    milestoneProgress: 82,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-7',
    trlDescription: 'System prototype demonstration in operational environment',
    deploymentStatus: 'Validated ✓',
    deploymentStage: 'Validated',
    sanctionedGrant: '₹ 24.0 Lakhs',
    disbursedAmount: '₹ 19.2 Lakhs',
    pendingDisbursal: '₹ 4.8 Lakhs',
    startDate: '2025-09-15',
    targetEndDate: '2026-10-30',
    labsAndFacilities: 'Environmental IoT & Sensor Characterization Lab, BIT Sindri',
    hardwareSpecs: 'STM32L4 Ultra-Low-Power MCU, LoRa SX1262 Transceiver, Industrial Optical Turbidity & pH Probe, 15W Monocrystalline Solar Panel + LiFePO4 Battery Pack.',
    milestones: [
      { id: 'M1', title: 'Hardware Schematic & Sensor Interfacing', status: 'Completed', progress: 100, completedDate: '2025-11-20', remarks: 'Passed lab bench testing.' },
      { id: 'M2', title: 'Firmware & LoRaWAN Cloud Gateway Link', status: 'Completed', progress: 100, completedDate: '2026-02-15', remarks: 'Zero packet drop recorded over 12 km.' },
      { id: 'M3', title: 'Field Deployment across 15 Damodar River Points', status: 'In Progress', progress: 82, completedDate: null, remarks: '12 of 15 nodes deployed and broadcasting.' },
      { id: 'M4', title: 'State Pollution Control Board Integration', status: 'Pending', progress: 0, completedDate: null, remarks: 'API documentation submitted for review.' }
    ],
    deploymentLocation: 'Damodar Basin (Dhanbad & Bokaro)',
    liveSensorsCount: 12,
    telemetryUptime: '99.4%',
    beneficiariesCount: '65,000+ Citizens'
  },
  {
    id: 'PRJ-102',
    title: 'Smart Grid Energy Monitor & Peak Load Optimizer',
    shortCode: 'ENG-PRJ-102',
    sector: 'Mining & Energy',
    district: 'Ranchi',
    hei: 'Ranchi University',
    heiType: 'State Public University',
    teamLead: 'Dr. S. K. Sinha',
    leadEmail: 'sksinha.eng@ranchiuniversity.ac.in',
    milestonePhase: 'Phase 2: Prototype Build',
    milestoneProgress: 45,
    prototypeType: 'Software',
    trlLevel: 'TRL-5',
    trlDescription: 'Technology validated in relevant environment',
    deploymentStatus: 'In Progress',
    deploymentStage: 'In Progress',
    sanctionedGrant: '₹ 18.0 Lakhs',
    disbursedAmount: '₹ 9.0 Lakhs',
    pendingDisbursal: '₹ 9.0 Lakhs',
    startDate: '2025-12-01',
    targetEndDate: '2026-11-30',
    labsAndFacilities: 'Smart Grid & Power Electronics Simulation Lab, RU',
    hardwareSpecs: 'Distributed IoT Smart Energy Meters with Modbus RS485 to MQTT Edge Gateway running on Raspberry Pi CM4 Compute Module.',
    milestones: [
      { id: 'M1', title: 'Mathematical Load Forecasting Model', status: 'Completed', progress: 100, completedDate: '2026-02-10', remarks: 'Achieved 94.2% peak prediction accuracy.' },
      { id: 'M2', title: 'Smart Meter Data Ingestion Pipeline', status: 'In Progress', progress: 65, completedDate: null, remarks: 'Integrating with JBVNL feeder endpoints.' },
      { id: 'M3', title: 'Dynamic Tariff & Load Shedding Dispatcher', status: 'Pending', progress: 0, completedDate: null, remarks: 'Algorithms undergoing unit testing.' }
    ],
    deploymentLocation: 'JBVNL Ranchi Substation 4',
    liveSensorsCount: 4,
    telemetryUptime: '98.1%',
    beneficiariesCount: '35,000+ Households'
  },
  {
    id: 'PRJ-103',
    title: 'AI Soil Health Analyzer & Micro-Nutrient Scanner',
    shortCode: 'AGR-PRJ-103',
    sector: 'Agriculture & Food',
    district: 'East Singhbhum',
    hei: 'NIT Jamshedpur',
    heiType: 'NIT / Institute of National Importance',
    teamLead: 'Dr. Anjali Sharma',
    leadEmail: 'anjali.res@nitjsr.ac.in',
    milestonePhase: 'Phase 3: Pilot Deployment',
    milestoneProgress: 90,
    prototypeType: 'Hybrid',
    trlLevel: 'TRL-8',
    trlDescription: 'Actual system completed and qualified through test and demonstration',
    deploymentStatus: 'Validated ✓',
    deploymentStage: 'Validated',
    sanctionedGrant: '₹ 26.5 Lakhs',
    disbursedAmount: '₹ 23.85 Lakhs',
    pendingDisbursal: '₹ 2.65 Lakhs',
    startDate: '2025-08-10',
    targetEndDate: '2026-09-30',
    labsAndFacilities: 'Sensors & Bio-MEMS Research Center, NIT Jamshedpur',
    hardwareSpecs: 'Reflectance NIR optical sensor probe (900-1700nm), integrated Bluetooth 5.2 link, 3.5 inch sunlight-readable capacitive touchscreen, rechargeable Li-ion battery (14 hours continuous soil testing).',
    milestones: [
      { id: 'M1', title: 'NIR Soil Spectroscopy Dataset Collection', status: 'Completed', progress: 100, completedDate: '2025-10-30', remarks: '12,000 soil samples from 24 districts analyzed.' },
      { id: 'M2', title: 'Handheld Optical Device Prototyping', status: 'Completed', progress: 100, completedDate: '2026-01-20', remarks: 'NABL precision calibration achieved.' },
      { id: 'M3', title: 'KVK Field Deployment & Soil Health Card Generator', status: 'In Progress', progress: 90, completedDate: null, remarks: 'Deployed at 8 Krishi Vigyan Kendras.' },
      { id: 'M4', title: 'State Agristack Portal API Handshake', status: 'In Progress', progress: 75, completedDate: null, remarks: 'Automated digital soil card sync operational.' }
    ],
    deploymentLocation: 'Potka & Ghatshila Blocks (East Singhbhum)',
    liveSensorsCount: 20,
    telemetryUptime: '99.8%',
    beneficiariesCount: '28,000+ Farmers'
  },
  {
    id: 'PRJ-104',
    title: 'Municipal Waste Route Tracker & Smart Bin Monitor',
    shortCode: 'WST-PRJ-104',
    sector: 'Environment & Forest',
    district: 'Ranchi',
    hei: 'BIT Mesra',
    heiType: 'Deemed Technical University',
    teamLead: 'Dr. Vivek Kumar',
    leadEmail: 'vkumar@bitmesra.ac.in',
    milestonePhase: 'Phase 1: Design & Arch',
    milestoneProgress: 30,
    prototypeType: 'Software',
    trlLevel: 'TRL-3',
    trlDescription: 'Analytical and experimental critical function and/or characteristic proof of concept',
    deploymentStatus: 'Pending Review',
    deploymentStage: 'Pending Review',
    sanctionedGrant: '₹ 15.0 Lakhs',
    disbursedAmount: '₹ 5.0 Lakhs',
    pendingDisbursal: '₹ 10.0 Lakhs',
    startDate: '2026-03-01',
    targetEndDate: '2027-02-28',
    labsAndFacilities: 'Smart Cities & GIS Computing Lab, BIT Mesra',
    hardwareSpecs: 'Ultrasonic bin level sensors + GPS/GSM vehicle tracking telemetry modules for municipal waste compactors.',
    milestones: [
      { id: 'M1', title: 'RMC Ward Spatial Mapping & Fleet Model', status: 'Completed', progress: 100, completedDate: '2026-05-15', remarks: 'Mapped 53 wards of Ranchi Municipal Corp.' },
      { id: 'M2', title: 'Dynamic Route Optimization Engine', status: 'In Progress', progress: 40, completedDate: null, remarks: 'Simulating fuel reduction algorithms.' }
    ],
    deploymentLocation: 'Ranchi Municipal Corporation (Wards 1-15)',
    liveSensorsCount: 30,
    telemetryUptime: '96.5%',
    beneficiariesCount: '1,40,000+ Urban Residents'
  },
  {
    id: 'PRJ-105',
    title: 'Automated Silkworm Feed System & Cocoon Climate Controller',
    shortCode: 'TRB-PRJ-105',
    sector: 'Tribal Tech & Education',
    district: 'Dumka',
    hei: 'Sido Kanhu Murmu University',
    heiType: 'State Public University',
    teamLead: 'Dr. S. K. Murmu',
    leadEmail: 'skmurmu@skmu.ac.in',
    milestonePhase: 'Phase 2: Lab Testing',
    milestoneProgress: 55,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-4',
    trlDescription: 'Component and/or breadboard validation in laboratory environment',
    deploymentStatus: 'In Progress',
    deploymentStage: 'In Progress',
    sanctionedGrant: '₹ 16.5 Lakhs',
    disbursedAmount: '₹ 8.25 Lakhs',
    pendingDisbursal: '₹ 8.25 Lakhs',
    startDate: '2025-11-01',
    targetEndDate: '2026-10-31',
    labsAndFacilities: 'Sericulture & Tribal Agro-Technologies Lab, SKMU Dumka',
    hardwareSpecs: 'Dual-axis automatic mulberry leaf feeder with PID temperature (24-28°C) and RH humidity (70-85%) misting controller.',
    milestones: [
      { id: 'M1', title: 'Tasar Silkworm Micro-climate Chamber Build', status: 'Completed', progress: 100, completedDate: '2026-01-15', remarks: 'Chamber maintains target climate within 0.5°C.' },
      { id: 'M2', title: 'Automatic Rotary Feeder Mechanism', status: 'In Progress', progress: 60, completedDate: null, remarks: 'Fabricating stainless steel feeder racks.' }
    ],
    deploymentLocation: 'Kathikund Sericulture Center, Dumka',
    liveSensorsCount: 6,
    telemetryUptime: '97.8%',
    beneficiariesCount: '4,200+ Tasar Silk Rearers'
  },
  {
    id: 'PRJ-106',
    title: 'Solar Cold Storage Unit with PCM Storage Plates',
    shortCode: 'SOL-PRJ-106',
    sector: 'Agriculture & Food',
    district: 'Ranchi',
    hei: 'XIMR Ranchi',
    heiType: 'Private Autonomous Institute',
    teamLead: 'Aman Mehta',
    leadEmail: 'aman.mehta@ximr.ac.in',
    milestonePhase: 'Phase 3: Field Deployment',
    milestoneProgress: 88,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-7',
    trlDescription: 'System prototype demonstration in operational environment',
    deploymentStatus: 'Validated ✓',
    deploymentStage: 'Validated',
    sanctionedGrant: '₹ 22.0 Lakhs',
    disbursedAmount: '₹ 19.8 Lakhs',
    pendingDisbursal: '₹ 2.2 Lakhs',
    startDate: '2025-07-01',
    targetEndDate: '2026-08-31',
    labsAndFacilities: 'Thermal Engineering & Renewable Refrigeration Lab, XIMR',
    hardwareSpecs: '1.2 MT cold chamber with organic PCM eutectics (Solidification at 3.5°C), 1.5 kW rooftop bifacial solar PV array, GSM temperature logger.',
    milestones: [
      { id: 'M1', title: 'Thermal Insulation & PCM Formulation', status: 'Completed', progress: 100, completedDate: '2025-09-30', remarks: 'Achieved 42-hour cooling retention.' },
      { id: 'M2', title: 'Field Installation at Ormanjhi Mandi', status: 'Completed', progress: 100, completedDate: '2026-03-20', remarks: 'Operating without grid power for 120 days.' },
      { id: 'M3', title: 'Economic Impact Assessment & Farmer Onboarding', status: 'In Progress', progress: 88, completedDate: null, remarks: 'Farmer vegetable spoilage reduced by 84%.' }
    ],
    deploymentLocation: 'Ormanjhi & Bero Weekly Mandis',
    liveSensorsCount: 8,
    telemetryUptime: '99.9%',
    beneficiariesCount: '1,800+ Vegetable Farmers'
  },
  {
    id: 'PRJ-107',
    title: 'Low-Cost MEMS Seismic & Landslide Early Warning Sensor',
    shortCode: 'GEO-PRJ-107',
    sector: 'Infrastructure & Transport',
    district: 'Dhanbad',
    hei: 'IIT (ISM) Dhanbad',
    heiType: 'IIT / Central Premier Institution',
    teamLead: 'Dr. V. M. Murthy',
    leadEmail: 'vmurthy@iitism.ac.in',
    milestonePhase: 'Phase 1: Component Sourcing',
    milestoneProgress: 25,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-2',
    trlDescription: 'Technology concept and/or application formulated',
    deploymentStatus: 'Initial Stage',
    deploymentStage: 'Initial Stage',
    sanctionedGrant: '₹ 28.0 Lakhs',
    disbursedAmount: '₹ 8.4 Lakhs',
    pendingDisbursal: '₹ 19.6 Lakhs',
    startDate: '2026-02-01',
    targetEndDate: '2027-03-31',
    labsAndFacilities: 'Rock Mechanics & Geophysics Instrumentation Lab, IIT ISM',
    hardwareSpecs: 'Triaxial ultra-sensitive MEMS accelerometer array (<10 micro-g noise floor) with solar mesh relay and underground pore-pressure transducers.',
    milestones: [
      { id: 'M1', title: 'Geological Slope Stability Modeling', status: 'Completed', progress: 100, completedDate: '2026-04-10', remarks: 'Analyzed 8 opencast overburden dump slopes.' },
      { id: 'M2', title: 'Subsurface Inclinometer Fabrication', status: 'In Progress', progress: 35, completedDate: null, remarks: 'Machining weatherproof stainless-steel probes.' }
    ],
    deploymentLocation: 'Jharia Open Cast Overburden Slopes',
    liveSensorsCount: 4,
    telemetryUptime: '95.0%',
    beneficiariesCount: '25,000+ Mine Colony Inhabitants'
  },
  {
    id: 'PRJ-108',
    title: 'Tribal Healthcare Tele-Kiosk with Diagnostic Suite',
    shortCode: 'HLT-PRJ-108',
    sector: 'Healthcare & Telemedicine',
    district: 'West Singhbhum',
    hei: 'Kolhan University',
    heiType: 'State Public University',
    teamLead: 'Dr. Alok Ranjan',
    leadEmail: 'alok.med@kolhanuniversity.ac.in',
    milestonePhase: 'Phase 3: Pilot Rollout',
    milestoneProgress: 94,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-8',
    trlDescription: 'Actual system completed and qualified through test and demonstration',
    deploymentStatus: 'Active ✓',
    deploymentStage: 'Active',
    sanctionedGrant: '₹ 30.0 Lakhs',
    disbursedAmount: '₹ 28.5 Lakhs',
    pendingDisbursal: '₹ 1.5 Lakhs',
    startDate: '2025-06-01',
    targetEndDate: '2026-08-31',
    labsAndFacilities: 'Biomedical Engineering & Telehealth Center, KU Chaibasa',
    hardwareSpecs: 'Integrated 12-lead ECG, non-invasive digital hemoglobin, otoscope, dermascope, urine analyzer, and video-conferencing terminal with dual battery backup.',
    milestones: [
      { id: 'M1', title: 'Kiosk Ergonomic Design & Sensor Integration', status: 'Completed', progress: 100, completedDate: '2025-09-15', remarks: 'ISO 13485 medical device compliance verified.' },
      { id: 'M2', title: 'Vernacular Audio Voice Assist System (Ho & Mundari)', status: 'Completed', progress: 100, completedDate: '2025-12-20', remarks: 'Preloaded 140 voice instructions in local dialects.' },
      { id: 'M3', title: 'Deploy at 4 Remote Primary Health Centers in Saranda', status: 'Completed', progress: 100, completedDate: '2026-04-10', remarks: 'Operational in Manoharpur and Goilkera PHCs.' },
      { id: 'M4', title: 'RIMS Medical Teleconsultation Linkage', status: 'In Progress', progress: 94, completedDate: null, remarks: 'Conducted 1,840 tele-consultations to date.' }
    ],
    deploymentLocation: 'Saranda Forest Region PHCs (West Singhbhum)',
    liveSensorsCount: 16,
    telemetryUptime: '99.7%',
    beneficiariesCount: '48,000+ Tribal Villagers'
  }
];

export const REGIONAL_DISTRICT_MAPPINGS = [
  {
    district: 'Ranchi District',
    code: 'RNC',
    status: 'Sync Complete',
    statusType: 'success',
    activeProjects: 15,
    lastSync: '2h ago',
    leadInstitute: 'Ranchi University & BIT Mesra',
    sectorsActive: ['Environment & Forest', 'Mining & Energy', 'Agriculture & Food'],
    totalFundingCr: '₹ 3.84 Cr',
    beneficiaries: '1,80,000+'
  },
  {
    district: 'Dhanbad District',
    code: 'DHN',
    status: 'Syncing',
    statusType: 'warning',
    activeProjects: 12,
    lastSync: '5h ago',
    leadInstitute: 'IIT (ISM) Dhanbad & BIT Sindri',
    sectorsActive: ['Mining & Energy', 'Water & Sanitation', 'Infrastructure & Transport'],
    totalFundingCr: '₹ 4.10 Cr',
    beneficiaries: '1,45,000+'
  },
  {
    district: 'East Singhbhum District',
    code: 'ESB',
    status: 'Active',
    statusType: 'info',
    activeProjects: 9,
    lastSync: '1h ago',
    leadInstitute: 'NIT Jamshedpur',
    sectorsActive: ['Agriculture & Food', 'Water & Sanitation', 'Healthcare & Telemedicine'],
    totalFundingCr: '₹ 2.65 Cr',
    beneficiaries: '95,000+'
  },
  {
    district: 'Bokaro District',
    code: 'BKR',
    status: 'Under Review',
    statusType: 'neutral',
    activeProjects: 6,
    lastSync: '4h ago',
    leadInstitute: 'Bokaro Steel City R&D Hub',
    sectorsActive: ['Mining & Energy', 'Environment & Forest'],
    totalFundingCr: '₹ 1.80 Cr',
    beneficiaries: '60,000+'
  },
  {
    district: 'Deoghar District',
    code: 'DGH',
    status: 'Active Hub',
    statusType: 'success',
    activeProjects: 8,
    lastSync: '3h ago',
    leadInstitute: 'AIIMS Deoghar / SKMU Campus',
    sectorsActive: ['Healthcare & Telemedicine', 'Water & Sanitation', 'Tribal Tech & Education'],
    totalFundingCr: '₹ 2.20 Cr',
    beneficiaries: '78,000+'
  },
  {
    district: 'Hazaribagh District',
    code: 'HZB',
    status: 'Sync Complete',
    statusType: 'success',
    activeProjects: 7,
    lastSync: '2h ago',
    leadInstitute: 'Vinoba Bhave University & UCET',
    sectorsActive: ['Infrastructure & Transport', 'Agriculture & Food'],
    totalFundingCr: '₹ 1.95 Cr',
    beneficiaries: '55,000+'
  },
  {
    district: 'Dumka District',
    code: 'DMK',
    status: 'Active Hub',
    statusType: 'success',
    activeProjects: 8,
    lastSync: '6h ago',
    leadInstitute: 'Sido Kanhu Murmu University',
    sectorsActive: ['Tribal Tech & Education', 'Agriculture & Food'],
    totalFundingCr: '₹ 2.15 Cr',
    beneficiaries: '72,000+'
  },
  {
    district: 'West Singhbhum District',
    code: 'WSB',
    status: 'Active Hub',
    statusType: 'success',
    activeProjects: 7,
    lastSync: '1h ago',
    leadInstitute: 'Kolhan University',
    sectorsActive: ['Healthcare & Telemedicine', 'Water & Sanitation', 'Tribal Tech & Education'],
    totalFundingCr: '₹ 2.45 Cr',
    beneficiaries: '85,000+'
  }
];

export const INNOVATION_LIFECYCLE_STEPS = [
  { step: 1, label: 'Problem Identified', sub: 'Citizen / Department', icon: 'AlertCircle' },
  { step: 2, label: 'Challenge Created', sub: 'Government Admin', icon: 'Settings' },
  { step: 3, label: 'Solution Proposed', sub: 'HEI / Innovator Teams', icon: 'FileText' },
  { step: 4, label: 'Proposal Evaluated', sub: 'Domain Experts', icon: 'FileCheck' },
  { step: 5, label: 'Project Approved', sub: 'Funding Sanctioned', icon: 'Award' },
  { step: 6, label: 'Implementation', sub: 'Milestones & Development', icon: 'Cpu' },
  { step: 7, label: 'Verification', sub: 'Evidence & Audit Review', icon: 'ShieldCheck' },
  { step: 8, label: 'Deployment', sub: 'Field Implementation', icon: 'Rocket' },
  { step: 9, label: 'Impact Measured', sub: 'Results & Analytics', icon: 'BarChart3' },
  { step: 10, label: 'Scaling', sub: 'Replicate & Expand', icon: 'TrendingUp' }
];

export const FINANCIAL_GRANT_METRICS = {
  totalPoolCr: '₹ 2.5 Cr',
  disbursedCr: '₹ 1.8 Cr',
  disbursedPercentage: 72,
  pendingCr: '₹ 70 Lakhs',
  sanctionedProjectsCount: 28,
  utilizationAuditStatus: 'Verified & Clear'
};

export const RECENT_ACTIVITY_TIMELINE = [
  {
    id: 'ACT-01',
    project: 'IoT Water Quality Sensor (PRJ-101)',
    institution: 'BIT Sindri',
    action: 'Phase 3 field milestone evidence submitted for verification',
    time: '2 hours ago',
    type: 'milestone'
  },
  {
    id: 'ACT-02',
    project: 'Smart Grid Energy Monitor (PRJ-102)',
    institution: 'Ranchi University',
    action: 'Grant installment ₹ 4.5 Lakhs disbursed after milestone audit',
    time: '5 hours ago',
    type: 'grant'
  },
  {
    id: 'ACT-03',
    project: 'AI Soil Health Analyzer (PRJ-103)',
    institution: 'NIT Jamshedpur',
    action: 'Phase 2 laboratory validation report verified with NABL accuracy clearance',
    time: '1 day ago',
    type: 'verification'
  },
  {
    id: 'ACT-04',
    project: 'Rural Telemedicine Health Kiosk (PROP-204)',
    institution: 'IIT (ISM) Dhanbad',
    action: 'Technical evaluation score 91/100 awarded by State Health Advisory Board',
    time: '1 day ago',
    type: 'evaluation'
  },
  {
    id: 'ACT-05',
    project: 'Tribal Healthcare Tele-Kiosk (PRJ-108)',
    institution: 'Kolhan University',
    action: '1,840th teleconsultation completed successfully in Saranda Forest PHC',
    time: '2 days ago',
    type: 'deployment'
  }
];

export const ATTENTION_REQUIRED_ALERTS = [
  {
    id: 'ALT-01',
    title: '4 Projects Delayed',
    desc: 'Milestones overdue for submission by > 14 days',
    severity: 'warning'
  },
  {
    id: 'ALT-02',
    title: '7 Pending Verification',
    desc: 'Field testing evidence awaiting expert reviewer clearance',
    severity: 'info'
  },
  {
    id: 'ALT-03',
    title: '3 Budget Risk Projects',
    desc: 'Possible budget variance detected in component procurement',
    severity: 'danger'
  }
];

export const HEI_IMPACT_PARTNERS = [
  {
    name: 'BIT Sindri',
    proposalsCount: 12,
    activeSolutions: '12 Active Solutions',
    badge: 'Top Contributing Institute',
    type: 'Partner'
  },
  {
    name: 'NIT Jamshedpur',
    proposalsCount: 8,
    activeSolutions: '8 Active Solutions',
    badge: 'Regional Lead',
    type: 'Partner'
  },
  {
    name: 'Ranchi University',
    proposalsCount: 10,
    activeSolutions: '10 Active Solutions',
    badge: 'Central Partner',
    type: 'Partner'
  },
  {
    name: 'IIT (ISM) Dhanbad',
    proposalsCount: 15,
    activeSolutions: '15 Active Solutions',
    badge: 'Hub Lead',
    type: 'Hub Lead'
  }
];
