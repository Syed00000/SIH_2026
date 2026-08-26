/**
 * Jharkhand Societal Innovation Hub - Projects & Solutions Comprehensive Dataset
 * Ultra-high-density dataset for Innovation Lifecycle Management, Proposals,
 * Active Projects, Milestones, Prototypes, Field Deployments, and Geospatial Mapping.
 * Covering 24 Districts, 20+ Detailed Solution Proposals, 20+ Active Projects with
 * Full Itemized DPR Budgets, Hardware BOM Specs, Live Telemetry Streams & Milestones.
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

export const FINANCIAL_GRANT_METRICS = {
  totalPoolCr: '₹ 2.50 Cr',
  disbursedCr: '₹ 1.80 Cr',
  pendingCr: '₹ 70.00 Lakhs',
  disbursedPercentage: 72,
  sanctionedProjectsCount: 28,
  averageGrantPerProject: '₹ 18.50 Lakhs',
  utilizationAuditStatus: 'Verified & Clear',
  nextTrancheReleaseDate: '15 Sep 2026'
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
  'Seraikela Kharsawan',
  'Khunti',
  'Gumla',
  'Simdega',
  'Lohardaga',
  'Latehar',
  'Garhwa',
  'Chatra',
  'Koderma',
  'Jamtara',
  'Godda',
  'Sahebganj',
  'Pakur'
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

export const ATTENTION_REQUIRED_ALERTS = [
  {
    id: 'ALT-101',
    severity: 'HIGH',
    title: '4 Projects Milestone Phase Delayed',
    desc: 'PRJ-103 (Coal Mine Gas) and PRJ-108 (Sal Bio-Plastic) pending Lab Stage 2 clearance by >14 days.',
    actionRequired: 'Audit Stage Gates',
    targetTab: 'projects_milestones'
  },
  {
    id: 'ALT-102',
    severity: 'MEDIUM',
    title: '7 Pending Proposal Evaluations',
    desc: 'PROP-209, PROP-211, and PROP-214 awaiting technical committee score submission.',
    actionRequired: 'Review Proposals',
    targetTab: 'projects_proposals'
  },
  {
    id: 'ALT-103',
    severity: 'LOW',
    title: 'Sensor Node Telemetry Alert in Deoghar',
    desc: 'Node DEO-04 battery dropped below 15% due to continuous cloud coverage on solar panel.',
    actionRequired: 'Inspect Telemetry',
    targetTab: 'projects_deployment'
  }
];

export const RECENT_ACTIVITY_TIMELINE = [
  {
    id: 'ACT-901',
    project: 'Smart Dam Water Quality (PRJ-102)',
    action: 'State Deployment Certificate issued for Dimna Lake Node (East Singhbhum).',
    time: '12 mins ago',
    type: 'CERTIFICATE'
  },
  {
    id: 'ACT-902',
    project: 'AI Crop Disease Detector (PROP-201)',
    action: 'Technical Committee approved ₹18.50 Lakhs Grant with score 94.5/100.',
    time: '45 mins ago',
    type: 'SANCTION'
  },
  {
    id: 'ACT-903',
    project: 'Solar PCM Cold Storage (PRJ-104)',
    action: 'Milestone 2 (Phase Change Thermal Testing) verified by NABL lab auditor.',
    time: '2 hours ago',
    type: 'MILESTONE'
  },
  {
    id: 'ACT-904',
    project: 'Tribal Lac Blockchain (PROP-209)',
    action: 'New DPR Submission received from Sido Kanhu Murmu University (Dumka).',
    time: '3 hours ago',
    type: 'SUBMISSION'
  },
  {
    id: 'ACT-905',
    project: 'Underground Miner UWB Mesh (PRJ-116)',
    action: 'Tranche 2 Grant of ₹6.50 Lakhs disbursed following Stage Gate 2 sign-off.',
    time: '5 hours ago',
    type: 'DISBURSAL'
  }
];

export const HEI_IMPACT_PARTNERS = [
  {
    id: 'HEI-BIT-SINDRI',
    name: 'BIT Sindri',
    district: 'Dhanbad',
    activeProjects: 6,
    sanctionedGrants: '₹ 54.5 Lakhs',
    leadDomain: 'Mining, Civil & IoT Sensors',
    telemetryNodes: 42,
    beneficiaries: '18,500 Citizens'
  },
  {
    id: 'HEI-NIT-JSR',
    name: 'NIT Jamshedpur',
    district: 'East Singhbhum',
    activeProjects: 5,
    sanctionedGrants: '₹ 48.0 Lakhs',
    leadDomain: 'Water Quality & Clean Energy',
    telemetryNodes: 38,
    beneficiaries: '14,200 Citizens'
  },
  {
    id: 'HEI-IIT-ISM',
    name: 'IIT (ISM) Dhanbad',
    district: 'Dhanbad',
    activeProjects: 7,
    sanctionedGrants: '₹ 72.0 Lakhs',
    leadDomain: 'Geotechnical, Mine Safety & AI',
    telemetryNodes: 45,
    beneficiaries: '22,000 Miners & Citizens'
  },
  {
    id: 'HEI-BIT-MESRA',
    name: 'BIT Mesra',
    district: 'Ranchi',
    activeProjects: 4,
    sanctionedGrants: '₹ 38.5 Lakhs',
    leadDomain: 'AI Robotics & Urban Infrastructure',
    telemetryNodes: 28,
    beneficiaries: '11,000 Citizens'
  },
  {
    id: 'HEI-BAU-RANCHI',
    name: 'Birsa Agricultural University',
    district: 'Ranchi',
    activeProjects: 4,
    sanctionedGrants: '₹ 36.0 Lakhs',
    leadDomain: 'Agri-Tech, Crop AI & Solar Storage',
    telemetryNodes: 25,
    beneficiaries: '16,000 Farmers'
  },
  {
    id: 'HEI-AIIMS-DEO',
    name: 'AIIMS Deoghar',
    district: 'Deoghar',
    activeProjects: 2,
    sanctionedGrants: '₹ 22.0 Lakhs',
    leadDomain: 'Telemedicine & Wearable Vitals',
    telemetryNodes: 12,
    beneficiaries: '8,500 Rural Patients'
  }
];

export const JHARKHAND_DISTRICTS_GEODATA = [
  { id: 'DHN', name: 'Dhanbad', lat: 23.7957, lng: 86.4304, activeProjects: 7, totalSensors: 48, status: 'Active Sync', leadHei: 'IIT ISM & BIT Sindri', complianceRate: '98.5%' },
  { id: 'RNC', name: 'Ranchi', lat: 23.3441, lng: 85.3096, activeProjects: 6, totalSensors: 42, status: 'Active Sync', leadHei: 'BIT Mesra & BAU Ranchi', complianceRate: '99.1%' },
  { id: 'EAS', name: 'East Singhbhum', lat: 22.8046, lng: 86.2029, activeProjects: 5, totalSensors: 35, status: 'Active Sync', leadHei: 'NIT Jamshedpur', complianceRate: '97.8%' },
  { id: 'BOK', name: 'Bokaro', lat: 23.6693, lng: 86.1511, activeProjects: 3, totalSensors: 22, status: 'Active Sync', leadHei: 'Bokaro Steel City Nodal', complianceRate: '96.2%' },
  { id: 'DEO', name: 'Deoghar', lat: 24.4826, lng: 86.7000, activeProjects: 2, totalSensors: 14, status: 'Warning Sync', leadHei: 'AIIMS Deoghar', complianceRate: '92.4%' },
  { id: 'HAZ', name: 'Hazaribagh', lat: 23.9925, lng: 85.3637, activeProjects: 2, totalSensors: 16, status: 'Active Sync', leadHei: 'Vinoba Bhave University', complianceRate: '98.0%' },
  { id: 'DUM', name: 'Dumka', lat: 24.2676, lng: 87.2486, activeProjects: 2, totalSensors: 12, status: 'Active Sync', leadHei: 'SKM University', complianceRate: '94.5%' },
  { id: 'WES', name: 'West Singhbhum', lat: 22.5667, lng: 85.8167, activeProjects: 1, totalSensors: 8, status: 'Active Sync', leadHei: 'Kolhan University', complianceRate: '95.0%' },
  { id: 'PAL', name: 'Palamu', lat: 24.0415, lng: 84.0722, activeProjects: 1, totalSensors: 6, status: 'Active Sync', leadHei: 'Nilamber Pitamber Univ', complianceRate: '93.8%' },
  { id: 'GIR', name: 'Giridih', lat: 24.1865, lng: 86.3106, activeProjects: 1, totalSensors: 8, status: 'Active Sync', leadHei: 'Giridih College Nodal', complianceRate: '96.0%' },
  { id: 'RAM', name: 'Ramgarh', lat: 23.6332, lng: 85.5167, activeProjects: 1, totalSensors: 6, status: 'Active Sync', leadHei: 'Ramgarh Technical Hub', complianceRate: '97.2%' },
  { id: 'SER', name: 'Seraikela Kharsawan', lat: 22.7000, lng: 85.9333, activeProjects: 1, totalSensors: 6, status: 'Active Sync', leadHei: 'NIT Jamshedpur Extension', complianceRate: '96.5%' }
];

export const REGIONAL_DISTRICT_MAPPINGS = JHARKHAND_DISTRICTS_GEODATA;

export const INITIAL_SOLUTION_PROPOSALS = [
  {
    id: 'PROP-201',
    title: 'AI Crop Disease & Pest Detector with Multi-Spectral Edge Camera',
    shortCode: 'AI-AGR-201',
    sector: 'Agriculture & Food',
    district: 'Dhanbad',
    hei: 'BIT Sindri',
    heiType: 'State Technical University',
    teamLead: 'Dr. Kartik Kumar',
    leadEmail: 'kartik.agr@bitsindri.ac.in',
    leadMobile: '+91 94311 82910',
    requestedGrant: '₹ 18.50 Lakhs',
    estimatedMonths: 6,
    status: 'Approved',
    submissionDate: '2026-08-10',
    evaluationScore: 94.5,
    abstract: 'Deploying edge-AI multi-spectral micro-cameras on lightweight tripod poles across paddy and vegetable fields in Tundi block. Provides real-time early detection of bacterial blight, stem borer, and leaf blast before visible crop loss, sending automated voice & SMS alerts in Hindi & Santhali to farmers.',
    problemStatement: 'Over 35% of standing paddy crops in Dhanbad rural blocks suffer from recurring leaf blast and fungal blight, causing estimated annual farmer losses of ₹14 Cr. Existing lab testing takes 7-10 days, by which time infestations destroy crops.',
    methodology: '1. Train MobileNetV3-Quantized vision model on 25,000 Jharkhand agricultural field samples.\n2. Interface Sony IMX500 AI intelligent vision sensor with ESP32-S3 microcontroller.\n3. Solar-powered energy harvester with 18650 LiFePO4 battery pack for continuous 24x7 operation.\n4. LoRaWAN 868MHz mesh relay connecting field nodes to Krishi Vigyan Kendra gateway.',
    budgetBreakdown: [
      { item: 'Edge AI Camera Sensor Nodes (25 units @ ₹22,000)', cost: '₹ 5.50 Lakhs', category: 'Hardware CapEx' },
      { item: 'LoRaWAN Gateway & Solar Tower Mast (2 Base Stations)', cost: '₹ 2.80 Lakhs', category: 'Infrastructure' },
      { item: 'High-Performance GPU Model Training Server & Cloud Backend', cost: '₹ 3.20 Lakhs', category: 'Computation & Software' },
      { item: 'NABL Field Accuracy Testing & ICAR Validation Fees', cost: '₹ 2.00 Lakhs', category: 'Compliance & Audit' },
      { item: 'Junior Research Fellow Stipends (2 Fellows x 6 Months)', cost: '₹ 3.60 Lakhs', category: 'Human Resource' },
      { item: 'Contingency & Field Transit Logistics in Dhanbad Rural', cost: '₹ 1.40 Lakhs', category: 'Logistics' }
    ],
    reviewerNotes: 'Highly innovative, robust edge computing architecture with high socio-economic relevance for smallholder farmers. Approved for full grant sanctioning.',
    dossierFile: 'DPR_BIT_Sindri_Crop_AI_2026.pdf',
    nablCertificate: 'NABL_ICAR_Accredited_Test_Cert_9841.pdf'
  },
  {
    id: 'PROP-202',
    title: 'Smart IoT Dam & Groundwater Quality Monitoring with LoRaWAN Mesh',
    shortCode: 'IOT-WAT-202',
    sector: 'Water & Sanitation',
    district: 'East Singhbhum',
    hei: 'NIT Jamshedpur',
    heiType: 'National Institute of Technology',
    teamLead: 'Prof. Ananya Sen',
    leadEmail: 'ananya.civ@nitjsr.ac.in',
    leadMobile: '+91 98351 94021',
    requestedGrant: '₹ 22.00 Lakhs',
    estimatedMonths: 8,
    status: 'Verified',
    submissionDate: '2026-08-12',
    evaluationScore: 96.2,
    abstract: 'Autonomous floating buoys and groundwater piezometer telemetry nodes placed in Dimna reservoir and Subarnarekha intake channels. Monitors dissolved oxygen, heavy metals (Fe, Mn, As), turbidity, pH, and water temperature in real-time with predictive contamination flow modeling.',
    problemStatement: 'Industrial discharge and seasonal mining runoff lead to sudden spikes in turbidity and heavy metals in Jamshedpur drinking water reservoirs, impacting over 800,000 residents without early telemetry alarms.',
    methodology: '1. Multi-parameter industrial probe array (Optical DO, Industrial Glass pH, 4-Electrode Conductivity, Turbidity NTU).\n2. Waterproof IP68 solar-powered floating buoy housing with anti-fouling wiper.\n3. Long-range LoRaWAN Sub-GHz telemetry transmitting telemetry every 5 minutes.\n4. Edge anomaly detection algorithm detecting industrial discharge within 90 seconds.',
    budgetBreakdown: [
      { item: 'Floating IP68 Buoy Hardware & Solar Harvester (10 Units)', cost: '₹ 7.00 Lakhs', category: 'Hardware CapEx' },
      { item: 'Industrial Multi-Parameter Optical Sensor Probes', cost: '₹ 6.50 Lakhs', category: 'Sensors' },
      { item: 'LoRaWAN Mast Stations & Marine Anchor Kits', cost: '₹ 2.50 Lakhs', category: 'Installation' },
      { item: 'Cloud Telemetry Server & GIS Web Dashboard', cost: '₹ 2.20 Lakhs', category: 'Software' },
      { item: 'Research Assistant Stipends & Field Deployment', cost: '₹ 2.80 Lakhs', category: 'HR' },
      { item: 'Statutory Water Quality Lab Cross-Calibration', cost: '₹ 1.00 Lakhs', category: 'Validation' }
    ],
    reviewerNotes: 'Exceptional engineering design. Field calibration data verified by State Pollution Control Board.',
    dossierFile: 'DPR_NIT_JSR_Water_Quality_Buoy.pdf',
    nablCertificate: 'JSPCB_Calibration_Report_2026_08.pdf'
  },
  {
    id: 'PROP-203',
    title: 'Coalmine Toxic Gas (CH4/CO) & Strata Collapse Predictive Early Warning',
    shortCode: 'MIN-SAF-203',
    sector: 'Mining & Energy',
    district: 'Dhanbad',
    hei: 'IIT (ISM) Dhanbad',
    heiType: 'Institute of National Importance',
    teamLead: 'Dr. Vivek Sharma',
    leadEmail: 'vsharma.mine@iitism.ac.in',
    leadMobile: '+91 94711 50192',
    requestedGrant: '₹ 32.00 Lakhs',
    estimatedMonths: 9,
    status: 'Approved',
    submissionDate: '2026-08-14',
    evaluationScore: 97.8,
    abstract: 'Intrinsically safe ATEX-certified underground wireless mesh nodes monitoring combustible methane (CH4), toxic carbon monoxide (CO), hydrogen sulfide (H2S), and micro-seismic acoustic strata displacement in underground coal workings of BCCL Jharia.',
    problemStatement: 'Underground coal mines in Jharia and Katras face dangerous methane outbursts and roof falls. Traditional hand-held detectors cannot provide continuous 3D spatial gas profiling and strata displacement prediction.',
    methodology: '1. NDIR optical methane sensors and electrochemical CO/H2S sensors certified for Zone-0 explosive atmospheres.\n2. Acoustic emission piezoelectric sensors to detect micro-cracks inside rock roof strata.\n3. Intrinsically safe ultra-wideband (UWB) mesh networking capable of transmitting through dense coal pillars.\n4. Real-time escape route illumination and surface sirens trigger within 3 seconds of limit violation.',
    budgetBreakdown: [
      { item: 'Flameproof ATEX Zone-0 Sensor Node Fabrication (20 Units)', cost: '₹ 11.00 Lakhs', category: 'Hardware' },
      { item: 'Piezoelectric Micro-Seismic Strata Probes (8 Sets)', cost: '₹ 6.80 Lakhs', category: 'Instrumentation' },
      { item: 'Underground Intrinsic Optical Fiber & Surface Repeater Gateway', cost: '₹ 4.50 Lakhs', category: 'Infrastructure' },
      { item: 'Senior Mine Geotechnical Research Fellow (2 x 9 Months)', cost: '₹ 5.40 Lakhs', category: 'Human Resource' },
      { item: 'DGMS (Directorate General of Mines Safety) Certification Fees', cost: '₹ 3.00 Lakhs', category: 'Regulatory' },
      { item: 'Underground Field Pilot Testing & Safety Gear', cost: '₹ 1.30 Lakhs', category: 'Safety' }
    ],
    reviewerNotes: 'Critical life-safety innovation for Jharkhand mining corridor. Complies with DGMS statutory regulations.',
    dossierFile: 'DPR_IIT_ISM_Mine_Gas_Strata.pdf',
    nablCertificate: 'CIMFR_Flameproof_Explosion_Test_Cert_2026.pdf'
  },
  {
    id: 'PROP-204',
    title: 'Solar-Powered Phase Change Material (PCM) Cold Storage Kiosk for Mandis',
    shortCode: 'AGR-COLD-204',
    sector: 'Agriculture & Food',
    district: 'Ranchi',
    hei: 'Birsa Agricultural University',
    heiType: 'State Agricultural University',
    teamLead: 'Dr. Priya Ranjan',
    leadEmail: 'priyaranjan.agro@bauranchi.ac.in',
    leadMobile: '+91 94317 21980',
    requestedGrant: '₹ 19.50 Lakhs',
    estimatedMonths: 6,
    status: 'Approved',
    submissionDate: '2026-08-15',
    evaluationScore: 92.8,
    abstract: 'Modular 2-metric-ton micro cold storage unit powered by rooftop solar PV and organic thermal energy storage (Phase Change Materials). Keeps vegetables (tomatoes, green chillies, cauliflower) fresh at 4°C-8°C for 5 days without grid power in rural Haats/Mandis of Ormanjhi & Mandar.',
    problemStatement: 'Over 28% of perishable produce harvested by tribal farmers in Ranchi and Khunti decays due to lack of farm-gate cold storage and erratic electricity, forcing distress selling at throwaway prices.',
    methodology: '1. Modular polyurethane insulated sandwich panel cold room structure.\n2. Bio-based non-toxic Phase Change Material (PCM) thermal cooling battery providing 18 hours of cold retention.\n3. BLDC variable speed DC refrigeration compressor powered directly by 3.5 kW solar PV.\n4. IoT temperature, humidity, and door-opening telemetry logger with mobile booking app.',
    budgetBreakdown: [
      { item: 'PUF Insulated Chamber & Structure (2 Ton Capacity)', cost: '₹ 5.20 Lakhs', category: 'Structure' },
      { item: 'Phase Change Material (PCM) Thermal Storage Plates', cost: '₹ 4.10 Lakhs', category: 'Cooling Battery' },
      { item: '3.5 kW Solar PV Array, MPPT Controller & BLDC Compressor', cost: '₹ 4.80 Lakhs', category: 'Solar Power' },
      { item: 'IoT Telemetry, Digital Weighing & Farmer NFC Access Kiosk', cost: '₹ 1.80 Lakhs', category: 'Electronics' },
      { item: 'Research Engineer Stipend & Field Trials', cost: '₹ 2.40 Lakhs', category: 'HR' },
      { item: 'Transportation & Mandi Site Foundation Work', cost: '₹ 1.20 Lakhs', category: 'Civil' }
    ],
    reviewerNotes: 'Highly viable economic model for tribal farmer collectives. Technical thermal retention tests verified.',
    dossierFile: 'DPR_BAU_PCM_Solar_Cold_Storage.pdf',
    nablCertificate: 'Thermal_Retention_NABL_Report_BAU_0912.pdf'
  },
  {
    id: 'PROP-205',
    title: 'Rural Telemedicine & Emergency Diagnostic Drone Network for Remote Blocks',
    shortCode: 'MED-DRN-205',
    sector: 'Healthcare & Telemedicine',
    district: 'Ranchi',
    hei: 'RIMS Ranchi & BIT Mesra',
    heiType: 'Medical & Technical University Collaboration',
    teamLead: 'Dr. Alok Minz',
    leadEmail: 'alok.minz@rimsranchi.ac.in',
    leadMobile: '+91 94313 00812',
    requestedGrant: '₹ 28.00 Lakhs',
    estimatedMonths: 8,
    status: 'Pending Review',
    submissionDate: '2026-08-16',
    evaluationScore: 89.4,
    abstract: 'Heavy-lift autonomous medical drone network connecting sub-divisional health centers in Angara and Bero to RIMS Ranchi. Transports blood samples, anti-venom, emergency cardiac drugs, and delivers real-time tele-consultation video kits to tribal ASHA workers.',
    problemStatement: 'During monsoon floods and in remote forest pockets of Ranchi and Latehar, emergency ambulance transit exceeds 4 hours, causing preventable deaths from snakebites and high-risk maternal hemorrhages.',
    methodology: '1. VTOL (Vertical Take-Off & Landing) hybrid drone with 5kg payload and 45km operational radius.\n2. Temperature-controlled active cold container (2°C-8°C) for vaccines and blood vials.\n3. Fail-safe dual GPS navigation, 4G/Satellite C2 data link, and parachute recovery system.\n4. Integrated RIMS Tele-ICU telemedicine console for remote diagnostics.',
    budgetBreakdown: [
      { item: 'Autonomous Medical VTOL Drone Airframe & Power System', cost: '₹ 9.50 Lakhs', category: 'Aviation' },
      { item: 'Smart Active Temperature-Controlled Medical Payload Pod', cost: '₹ 3.80 Lakhs', category: 'Payload' },
      { item: 'Ground Control Station, Dual Telemetry & Satellite Link', cost: '₹ 4.20 Lakhs', category: 'Communications' },
      { item: 'DGCA Type Certification & BVLOS Corridor Clearance', cost: '₹ 3.50 Lakhs', category: 'Regulatory' },
      { item: 'Medical Research Assistant & Drone Pilots (2 Persons x 8 Mo)', cost: '₹ 4.80 Lakhs', category: 'HR' },
      { item: 'Field Validation & Trial Flights Insurance', cost: '₹ 2.20 Lakhs', category: 'Insurance' }
    ],
    reviewerNotes: 'Impressive proposal. Awaiting final BVLOS corridor clearance approval from DGCA.',
    dossierFile: 'DPR_RIMS_BIT_Medical_Drone.pdf',
    nablCertificate: 'DGCA_BVLOS_Test_Flight_Authorization_2026.pdf'
  },
  {
    id: 'PROP-206',
    title: 'Municipal Solid Waste AI Segregator & RDF Pelletizer for Urban Bodies',
    shortCode: 'ENV-WST-206',
    sector: 'Environment & Forest',
    district: 'Ranchi',
    hei: 'BIT Mesra',
    heiType: 'Deemed Technical University',
    teamLead: 'Prof. Sudhir Soren',
    leadEmail: 'ssoren.env@bitmesra.ac.in',
    leadMobile: '+91 94311 77312',
    requestedGrant: '₹ 24.50 Lakhs',
    estimatedMonths: 7,
    status: 'Under Evaluation',
    submissionDate: '2026-08-17',
    evaluationScore: 88.0,
    abstract: 'Automated conveyor sorting machine using high-speed edge computer vision and pneumatic blowers to segregate wet organics, recyclables, and high-calorific plastics. Converts non-recyclable waste into high-density Refuse Derived Fuel (RDF) pellets for local cement kilns.',
    problemStatement: 'Ranchi generates over 450 metric tons of unsegregated waste daily at Jhiri dumpsite, causing groundwater leachate and recurring methane dump fires.',
    methodology: '1. Hyperspectral camera combined with YOLOv9 vision model sorting waste on high-speed conveyor.\n2. Multi-nozzle pneumatic ejection matrix separating materials in 40 milliseconds.\n3. Twin-screw extrusion pelletizer producing dense 15mm RDF fuel pellets.\n4. Cloud-connected daily tonnage weighing and municipal waste dashboard.',
    budgetBreakdown: [
      { item: 'Conveyor Chassis, Pneumatic Air Valves & Blower Matrix', cost: '₹ 7.50 Lakhs', category: 'Mechanical' },
      { item: 'Industrial Vision System, Hyperspectral Lens & NVIDIA Edge GPU', cost: '₹ 6.20 Lakhs', category: 'AI Hardware' },
      { item: 'Heavy-Duty Waste Shredder & Pelletizer Machine', cost: '₹ 4.80 Lakhs', category: 'Pelletizer' },
      { item: 'Municipal Site Installation & 3-Phase Industrial Power Line', cost: '₹ 2.00 Lakhs', category: 'Electrical' },
      { item: 'Research Engineers & Waste Characterization Chemists', cost: '₹ 2.80 Lakhs', category: 'HR' },
      { item: 'NABL Fuel Calorific Value (GCV) Lab Testing', cost: '₹ 1.20 Lakhs', category: 'Testing' }
    ],
    reviewerNotes: 'Good potential for urban local bodies. Clarification requested regarding shredder blade wear resistance.',
    dossierFile: 'DPR_BIT_Mesra_Waste_AI_Segregator.pdf',
    nablCertificate: 'RDF_Pellet_Calorific_Test_NABL_Cert_2026.pdf'
  },
  {
    id: 'PROP-207',
    title: 'Forest Fire Early Optical & Thermal AI Watchtower Network for Saranda',
    shortCode: 'FOR-FIR-207',
    sector: 'Environment & Forest',
    district: 'West Singhbhum',
    hei: 'Kolhan University',
    heiType: 'State University',
    teamLead: 'Dr. Manoj Tirkey',
    leadEmail: 'mtirkey.bot@kolhanuniv.ac.in',
    leadMobile: '+91 94319 88120',
    requestedGrant: '₹ 17.50 Lakhs',
    estimatedMonths: 6,
    status: 'Approved',
    submissionDate: '2026-08-18',
    evaluationScore: 91.5,
    abstract: 'Solar-powered dual Optical/Thermal 360-degree pan-tilt surveillance towers deployed on hilltop forest outposts in Saranda forest. Detects smoke plumes and thermal hot-spots within a 15km radius in under 3 minutes, automatically alerting the Forest Division and Gram Sabha.',
    problemStatement: 'Saranda Forest loses over 3,000 hectares annually to devastating spring forest fires, destroying biodiversity and Sal timber before manual ranger patrols can locate the fire front.',
    methodology: '1. Long-wave infrared (LWIR) radiometric thermal camera + 4K 30x optical zoom lens.\n2. Edge AI smoke pattern detection algorithm distinguishing forest fires from fog/clouds.\n3. VHF long-range radio mesh network communicating across hilly forest terrain.\n4. Real-time GIS fire front propagation simulator factoring wind speed and humidity.',
    budgetBreakdown: [
      { item: 'Dual Thermal & Optical Pan-Tilt Camera Towers (3 Watchtowers)', cost: '₹ 6.50 Lakhs', category: 'Hardware' },
      { item: 'Solar PV 500W Mast, LiFePO4 Battery & Lightning Arresters', cost: '₹ 3.20 Lakhs', category: 'Power' },
      { item: 'VHF Long Range Radio Relays & DFO Control Room Console', cost: '₹ 2.80 Lakhs', category: 'Communications' },
      { item: 'GIS Fire Mapping Software & Web Dashboard', cost: '₹ 1.80 Lakhs', category: 'Software' },
      { item: 'Research Assistants & Forest Field Deployment Team', cost: '₹ 2.20 Lakhs', category: 'HR' },
      { item: 'Gram Sabha Training & Community Volunteer Kits', cost: '₹ 1.00 Lakhs', category: 'Community' }
    ],
    reviewerNotes: 'Approved. Forest Department nodal officer assigned for watchtower foundation clearance.',
    dossierFile: 'DPR_Kolhan_Univ_Saranda_Forest_Fire.pdf',
    nablCertificate: 'Thermal_Detection_Range_Audit_Report_2026.pdf'
  },
  {
    id: 'PROP-208',
    title: 'Fluoride & Arsenic Continuous Nano-Filtration System for Rural Borewells',
    shortCode: 'WAT-FIL-208',
    sector: 'Water & Sanitation',
    district: 'Hazaribagh',
    hei: 'Vinoba Bhave University',
    heiType: 'State University',
    teamLead: 'Prof. Rashmi Verma',
    leadEmail: 'rverma.chem@vbu.ac.in',
    leadMobile: '+91 94315 44219',
    requestedGrant: '₹ 16.00 Lakhs',
    estimatedMonths: 5,
    status: 'Verified',
    submissionDate: '2026-08-19',
    evaluationScore: 93.0,
    abstract: 'Community-scale gravity-fed water filter utilizing synthesized graphene-oxide and activated alumina nano-composites to reduce fluoride levels from 4.5 mg/L to <0.8 mg/L and arsenic to <5 ppb in rural borewells of Chouparan and Ichak.',
    problemStatement: 'Over 120 villages in Hazaribagh suffer from severe skeletal fluorosis and dental fluorosis due to natural fluoride leaching in deep groundwater aquifer formations.',
    methodology: '1. Low-cost regenerated graphene oxide/alumina hybrid adsorption column.\n2. Automatic backwash regeneration system utilizing food-grade citric acid.\n3. Inline digital fluoride/arsenic spectrophotometric telemetry sensor.\n4. Zero electricity gravity flow design with 1,000 Litres/hour clean output.',
    budgetBreakdown: [
      { item: 'Nano-Composite Adsorbent Media Synthesis & Reactant Chemicals', cost: '₹ 4.20 Lakhs', category: 'Materials' },
      { item: 'Community Stainless Steel Filter Tanks & Piping (5 Units)', cost: '₹ 4.50 Lakhs', category: 'Mechanical' },
      { item: 'Inline Telemetry Fluoride/TDS Electronic Sensor Kits', cost: '₹ 2.50 Lakhs', category: 'Electronics' },
      { item: 'Chemical Research Fellows & Water Sampling Logistics', cost: '₹ 2.80 Lakhs', category: 'HR' },
      { item: 'NABL Certified Water Quality Testing (Pre & Post Filtration)', cost: '₹ 1.20 Lakhs', category: 'Testing' },
      { item: 'Panchayat Operator Training & Maintenance Toolkits', cost: '₹ 0.80 Lakhs', category: 'Training' }
    ],
    reviewerNotes: 'Highly impactful public health project. Verified lab testing shows 96% fluoride reduction.',
    dossierFile: 'DPR_VBU_Fluoride_Filter_Hazaribagh.pdf',
    nablCertificate: 'NABL_Water_Fluoride_Reduction_Lab_Test_Cert.pdf'
  },
  {
    id: 'PROP-209',
    title: 'Tribal Artisan Lac & Silk Traceability via Hyperledger Blockchain & QR',
    shortCode: 'TRI-BLK-209',
    sector: 'Tribal Tech & Education',
    district: 'Dumka',
    hei: 'Sido Kanhu Murmu University',
    heiType: 'State University',
    teamLead: 'Dr. Hemant Murmu',
    leadEmail: 'hmurmu.cs@skmu.ac.in',
    leadMobile: '+91 94311 02938',
    requestedGrant: '₹ 14.50 Lakhs',
    estimatedMonths: 5,
    status: 'Pending Review',
    submissionDate: '2026-08-20',
    evaluationScore: 87.5,
    abstract: 'Blockchain-backed verifiable digital passport for Santhal Pargana tribal lac cultivators and Kuchai silk weavers. Provides tamper-proof geographic origin tagging, fair price transparent auctioning, and global buyer direct payment integration.',
    problemStatement: 'Tribal lac and silk producers in Dumka and Khunti lose up to 55% of market value to middlemen due to lack of verified origin certification and price discovery transparency.',
    methodology: '1. Permissioned Hyperledger Fabric blockchain ledger node architecture.\n2. NFC smart tags and encrypted QR codes attached to bulk silk and lac batches.\n3. Mobile app in Santhali, Hindi & English with voice assistance for illiterate farmers.\n4. Direct UPI payment gateway integration guaranteeing minimum support price (MSP).',
    budgetBreakdown: [
      { item: 'Blockchain Node Servers, Cloud Hosting & Security Audits', cost: '₹ 4.20 Lakhs', category: 'Cloud Infrastructure' },
      { item: 'Mobile Application & Web Auction Platform Development', cost: '₹ 3.80 Lakhs', category: 'Software' },
      { item: 'Industrial NFC Tag Printers & 10,000 Encrypted Tags', cost: '₹ 2.00 Lakhs', category: 'Hardware' },
      { item: 'Graduate Research Assistant & Tribal Community Coordinators', cost: '₹ 2.50 Lakhs', category: 'HR' },
      { item: 'Field Workshops & Panchayat Level Digital Onboarding', cost: '₹ 2.00 Lakhs', category: 'Training' }
    ],
    reviewerNotes: 'Solid proposal for tribal economic empowerment. Technical architecture review underway.',
    dossierFile: 'DPR_SKMU_Tribal_Silk_Blockchain.pdf',
    nablCertificate: 'Security_Audit_Certificate_Blockchain_2026.pdf'
  },
  {
    id: 'PROP-210',
    title: 'Open-Cast Mine Slope Stability & Landslide Prediction Millimeter Radar',
    shortCode: 'MIN-RAD-210',
    sector: 'Mining & Energy',
    district: 'Bokaro',
    hei: 'IIT (ISM) Dhanbad',
    heiType: 'Institute of National Importance',
    teamLead: 'Prof. Sanjay Banerjee',
    leadEmail: 'sbanerjee.geo@iitism.ac.in',
    leadMobile: '+91 94311 33901',
    requestedGrant: '₹ 34.00 Lakhs',
    estimatedMonths: 9,
    status: 'High Priority',
    submissionDate: '2026-08-21',
    evaluationScore: 98.2,
    abstract: 'Continuous 77 GHz FMCW interferometric synthetic aperture radar (InSAR) scanning open-cast coal mine benches. Detects sub-millimeter rock face movement and bench creep up to 48 hours prior to catastrophic bench failure in CCL/BCCL mines.',
    problemStatement: 'Monsoon slope failures in large open-cast mines in Bokaro and Dhanbad cause fatal machinery burial and mine closure costing hundreds of crores.',
    methodology: '1. 77 GHz high-frequency FMCW MIMO radar transceiver with beam-steering.\n2. Phase interferometry algorithm resolving 0.2mm differential surface displacement.\n3. Solar-powered autonomous rover platform with automatic thermal drift compensation.\n4. Real-time mine dispatch audio siren and automated vehicle exclusion zone triggering.',
    budgetBreakdown: [
      { item: '77 GHz InSAR Radar Front-End & Beamforming Array', cost: '₹ 14.50 Lakhs', category: 'Radar CapEx' },
      { item: 'Industrial Heavy-Duty Pan-Tilt Mast & All-Weather Enclosure', cost: '₹ 5.20 Lakhs', category: 'Mechanical' },
      { item: 'Real-Time Edge FPGA Processing Board & Surface Telemetry', cost: '₹ 4.80 Lakhs', category: 'Electronics' },
      { item: 'Geotechnical & Radar Postdoc Fellows (2 x 9 Months)', cost: '₹ 5.50 Lakhs', category: 'HR' },
      { item: 'Open-Cast Mine Bench Calibration & DGMS Pilot Testing', cost: '₹ 4.00 Lakhs', category: 'Validation' }
    ],
    reviewerNotes: 'Top tier safety technology. Approved for priority sanctioning by Department of Mines.',
    dossierFile: 'DPR_IIT_ISM_Slope_Radar_Bokaro.pdf',
    nablCertificate: 'DGMS_Radar_Interferometry_Validation_Report.pdf'
  }
];

export const INITIAL_ACTIVE_PROJECTS = [
  {
    id: 'PRJ-101',
    title: 'AI Crop Disease & Pest Detector with Multi-Spectral Edge Camera',
    shortCode: 'AI-AGR-201',
    sector: 'Agriculture & Food',
    district: 'Dhanbad',
    hei: 'BIT Sindri',
    heiType: 'State Technical University',
    teamLead: 'Dr. Kartik Kumar',
    leadEmail: 'kartik.agr@bitsindri.ac.in',
    sanctionedGrant: '₹ 18.50 Lakhs',
    disbursedAmount: '₹ 13.50 Lakhs',
    disbursedPercentage: 73,
    milestonePhase: 'Phase 3: Field Testing',
    milestoneProgress: 75,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-7',
    trlDescription: 'Operational demonstration in representative field environment across 5 Dhanbad panchayats.',
    deploymentStatus: 'Active Telemetry',
    deploymentLocation: 'Tundi & Topchanchi Agricultural Blocks',
    liveSensorsCount: 25,
    telemetryUptime: '99.2%',
    beneficiariesCount: '3,800 Farmers',
    hardwareSpecs: 'Sony IMX500 Multi-Spectral Edge AI Sensor, ESP32-S3 Dual-Core MCU, SX1262 LoRaWAN 868MHz, 30W Monocrystalline Solar Panel with 12V 20Ah LiFePO4 Battery.',
    labsAndFacilities: 'Embedded Systems & AI Center of Excellence, BIT Sindri',
    milestones: [
      { id: 'M1', title: 'System Architecture & Multi-Spectral Optical Design', status: 'Completed', progress: 100, date: '2026-03-15', remarks: 'Optical enclosure and lens specs verified.' },
      { id: 'M2', title: 'Edge AI Quantized Model Training on 25k Leaf Samples', status: 'Completed', progress: 100, date: '2026-05-20', remarks: 'Achieved 96.4% F1-score on paddy blight classification.' },
      { id: 'M3', title: 'Fabrication of 25 Solar Field Camera Nodes', status: 'Completed', progress: 100, date: '2026-07-10', remarks: 'NABL environmental testing IP66 passed.' },
      { id: 'M4', title: 'District Field Deployment & LoRa Gateway Telemetry', status: 'In Progress', progress: 65, date: '2026-09-30', remarks: '20 of 25 nodes installed in Tundi block.' },
      { id: 'M5', title: 'Farmer App SMS Integration & State Scaling Report', status: 'Pending', progress: 0, date: '2026-11-15', remarks: 'Awaiting completion of field telemetry trial.' }
    ],
    telemetryReadings: [
      { timestamp: '08:00 AM', node: 'TUN-01', blightProbability: '12%', batteryLevel: '98%', status: 'Normal' },
      { timestamp: '10:00 AM', node: 'TUN-04', blightProbability: '88%', batteryLevel: '95%', status: 'Alert: Early Leaf Blast Detected' },
      { timestamp: '12:00 PM', node: 'TOP-02', blightProbability: '8%', batteryLevel: '100%', status: 'Normal' },
      { timestamp: '02:00 PM', node: 'TUN-03', blightProbability: '15%', batteryLevel: '97%', status: 'Normal' }
    ]
  },
  {
    id: 'PRJ-102',
    title: 'Smart IoT Dam & Groundwater Quality Monitoring with LoRaWAN Mesh',
    shortCode: 'IOT-WAT-202',
    sector: 'Water & Sanitation',
    district: 'East Singhbhum',
    hei: 'NIT Jamshedpur',
    heiType: 'National Institute of Technology',
    teamLead: 'Prof. Ananya Sen',
    leadEmail: 'ananya.civ@nitjsr.ac.in',
    sanctionedGrant: '₹ 22.00 Lakhs',
    disbursedAmount: '₹ 22.00 Lakhs',
    disbursedPercentage: 100,
    milestonePhase: 'Phase 4: State Scaling',
    milestoneProgress: 100,
    prototypeType: 'Hybrid',
    trlLevel: 'TRL-8',
    trlDescription: 'System qualified and state validation certified across Dimna Lake and Subarnarekha intake.',
    deploymentStatus: 'Validated ✓',
    deploymentLocation: 'Dimna Lake & Subarnarekha Water Intake, Jamshedpur',
    liveSensorsCount: 14,
    telemetryUptime: '99.8%',
    beneficiariesCount: '800,000 Citizens',
    hardwareSpecs: 'Industrial Optical Dissolved Oxygen (DO), Glass pH Probe, 4-Electrode Conductivity, Platinum Turbidity Sensor, IP68 Waterproof Marine Buoy, Dual LoRaWAN + 4G Gateway.',
    labsAndFacilities: 'Environmental Engineering & Advanced Water Testing Lab, NIT Jamshedpur',
    milestones: [
      { id: 'M1', title: 'Buoy Hull Hydrodynamic Design & Marine Prototyping', status: 'Completed', progress: 100, date: '2026-02-10', remarks: 'Hydrodynamic stability verified in Subarnarekha currents.' },
      { id: 'M2', title: 'Sensor Multiplexer Electronics & Solar Power Circuitry', status: 'Completed', progress: 100, date: '2026-04-12', remarks: 'Sub-GHz radio range tested up to 14 km.' },
      { id: 'M3', title: 'Lake Deployment & JSPCB Cross-Calibration Audit', status: 'Completed', progress: 100, date: '2026-06-18', remarks: 'NABL laboratory cross-check variance <1.2%.' },
      { id: 'M4', title: 'State Water Board Integration & Cloud Telemetry', status: 'Completed', progress: 100, date: '2026-08-05', remarks: 'Official State Deployment Certificate issued.' }
    ],
    telemetryReadings: [
      { timestamp: '09:00 AM', node: 'DIMNA-BUOY-01', ph: '7.42', turbidity: '2.1 NTU', doLevel: '7.8 mg/L', status: 'Potable Quality: Excellent' },
      { timestamp: '11:00 AM', node: 'SUB-INTAKE-02', ph: '7.15', turbidity: '4.8 NTU', doLevel: '6.9 mg/L', status: 'Normal Intake Stream' },
      { timestamp: '01:00 PM', node: 'DIMNA-BUOY-02', ph: '7.38', turbidity: '2.0 NTU', doLevel: '7.9 mg/L', status: 'Potable Quality: Excellent' }
    ]
  },
  {
    id: 'PRJ-103',
    title: 'Coalmine Toxic Gas (CH4/CO) & Strata Collapse Predictive Early Warning',
    shortCode: 'MIN-SAF-203',
    sector: 'Mining & Energy',
    district: 'Dhanbad',
    hei: 'IIT (ISM) Dhanbad',
    heiType: 'Institute of National Importance',
    teamLead: 'Dr. Vivek Sharma',
    leadEmail: 'vsharma.mine@iitism.ac.in',
    sanctionedGrant: '₹ 32.00 Lakhs',
    disbursedAmount: '₹ 18.00 Lakhs',
    disbursedPercentage: 56,
    milestonePhase: 'Phase 2: Lab Testing',
    milestoneProgress: 60,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-5',
    trlDescription: 'Technology validated in simulated explosion chamber at CIMFR Dhanbad.',
    deploymentStatus: 'In Progress',
    deploymentLocation: 'BCCL Jharia Underground Colliery Block-IV',
    liveSensorsCount: 18,
    telemetryUptime: '98.5%',
    beneficiariesCount: '4,500 Underground Miners',
    hardwareSpecs: 'NDIR Optical Methane Gas Sensor (0-100% Vol), Electrochemical CO (0-1000 ppm), Piezo Strata Acoustic Sensor, Intrinsically Safe Ex-d Enclosure with UWB Mesh Repeater.',
    labsAndFacilities: 'Mine Safety & Geomechanics Testing Facility, IIT (ISM) Dhanbad & CSIR-CIMFR',
    milestones: [
      { id: 'M1', title: 'Ex-Proof Intrinsically Safe Circuitry & ATEX CAD Design', status: 'Completed', progress: 100, date: '2026-03-22', remarks: 'Passed spark ignition tests.' },
      { id: 'M2', title: 'Explosion Chamber Gas Calibration at CSIR-CIMFR', status: 'In Progress', progress: 80, date: '2026-07-30', remarks: 'CH4 precision calibrated; CO sensor testing underway.' },
      { id: 'M3', title: 'Underground Colliery Mesh Network Pilot Installation', status: 'Pending', progress: 0, date: '2026-10-15', remarks: 'Awaiting DGMS final underground entry pass.' },
      { id: 'M4', title: 'Real-time Surface Alert & Evacuation Guidance Test', status: 'Pending', progress: 0, date: '2026-12-20', remarks: 'Scheduled post underground installation.' }
    ],
    telemetryReadings: [
      { timestamp: '08:30 AM', node: 'MINE-SECT-01', ch4: '0.12%', co: '4 ppm', acousticVibe: '0.04 mm/s', status: 'Normal Mine Environment' },
      { timestamp: '10:45 AM', node: 'MINE-FACE-03', ch4: '0.85%', co: '18 ppm', acousticVibe: '0.12 mm/s', status: 'Caution: Gas Level Elevated' }
    ]
  },
  {
    id: 'PRJ-104',
    title: 'Solar-Powered Phase Change Material (PCM) Cold Storage Kiosk for Mandis',
    shortCode: 'AGR-COLD-204',
    sector: 'Agriculture & Food',
    district: 'Ranchi',
    hei: 'Birsa Agricultural University',
    heiType: 'State Agricultural University',
    teamLead: 'Dr. Priya Ranjan',
    leadEmail: 'priyaranjan.agro@bauranchi.ac.in',
    sanctionedGrant: '₹ 19.50 Lakhs',
    disbursedAmount: '₹ 14.50 Lakhs',
    disbursedPercentage: 74,
    milestonePhase: 'Phase 3: Field Testing',
    milestoneProgress: 85,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-7',
    trlDescription: 'Operational cold kiosk operating at Ormanjhi Mandi supporting 350 vegetable farmers.',
    deploymentStatus: 'Active Telemetry',
    deploymentLocation: 'Ormanjhi Rural Haat Mandi, Ranchi District',
    liveSensorsCount: 8,
    telemetryUptime: '99.6%',
    beneficiariesCount: '1,200 Smallholder Farmers',
    hardwareSpecs: '3.5kW Monocrystalline Solar Array, MPPT Inverter, 2-Ton PUF Chamber, Bio-PCM Organic Cooling Battery Pack (4°C Phase Transition), IoT Temperature & Door Telemetry.',
    labsAndFacilities: 'Post-Harvest Technology & Renewable Energy Center, BAU Ranchi',
    milestones: [
      { id: 'M1', title: 'Thermal Insulation Design & Bio-PCM Matrix Formulation', status: 'Completed', progress: 100, date: '2026-03-01', remarks: 'Achieved 18-hour cold retention at 38°C ambient.' },
      { id: 'M2', title: 'Solar PV & BLDC Refrigeration Integration & Trial', status: 'Completed', progress: 100, date: '2026-05-15', remarks: 'Zero grid power dependency demonstrated.' },
      { id: 'M3', title: 'Ormanjhi Mandi Site Civil Installation & Commissioning', status: 'Completed', progress: 100, date: '2026-07-25', remarks: 'Kiosk active with farmer booking app.' },
      { id: 'M4', title: 'Economic Impact Assessment & 5 Mandi Scaling Plan', status: 'In Progress', progress: 40, date: '2026-10-30', remarks: 'Tracking farmer spoilage savings.' }
    ],
    telemetryReadings: [
      { timestamp: '09:00 AM', node: 'COLD-ORM-01', chamberTemp: '4.2°C', humidity: '88%', pcmCharge: '98%', status: 'Optimal Storage Condition' },
      { timestamp: '01:00 PM', node: 'COLD-ORM-01', chamberTemp: '4.8°C', humidity: '86%', pcmCharge: '92%', status: 'Optimal Storage Condition' }
    ]
  },
  {
    id: 'PRJ-105',
    title: 'Forest Fire Early Optical & Thermal AI Watchtower Network for Saranda',
    shortCode: 'FOR-FIR-207',
    sector: 'Environment & Forest',
    district: 'West Singhbhum',
    hei: 'Kolhan University',
    heiType: 'State University',
    teamLead: 'Dr. Manoj Tirkey',
    leadEmail: 'mtirkey.bot@kolhanuniv.ac.in',
    sanctionedGrant: '₹ 17.50 Lakhs',
    disbursedAmount: '₹ 11.00 Lakhs',
    disbursedPercentage: 62,
    milestonePhase: 'Phase 3: Field Testing',
    milestoneProgress: 70,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-6',
    trlDescription: 'Prototype demonstrated in Saranda Forest Division with 2 hilltop watchtowers active.',
    deploymentStatus: 'Active Telemetry',
    deploymentLocation: 'Gua & Manoharpur Forest Ranges, Saranda',
    liveSensorsCount: 6,
    telemetryUptime: '98.9%',
    beneficiariesCount: '25 Forest Villages & Wildlife Sanctuary',
    hardwareSpecs: 'FLIR Lepton 3.5 Radiometric Thermal Camera + 4K Optical PTZ Lens, Jetson Orin Nano AI Processor, 500W Solar Mast, VHF Long-Range Radio Transceiver.',
    labsAndFacilities: 'Applied Electronics & Forestry Research Lab, Kolhan University',
    milestones: [
      { id: 'M1', title: 'Optical & Thermal Camera Pod Fabrication & Weatherproofing', status: 'Completed', progress: 100, date: '2026-03-30', remarks: 'IP67 tested against tropical downpours.' },
      { id: 'M2', title: 'Smoke & Thermal Flare AI Algorithm Quantization', status: 'Completed', progress: 100, date: '2026-05-28', remarks: 'Smoke detection latency <1.8 seconds.' },
      { id: 'M3', title: 'Watchtower 1 (Gua Ridge) Mast Installation & Solar Link', status: 'Completed', progress: 100, date: '2026-07-20', remarks: '15km optical line of sight verified.' },
      { id: 'M4', title: 'Watchtower 2 (Manoharpur) Installation & DFO Dashboard Link', status: 'In Progress', progress: 50, date: '2026-09-25', remarks: 'Radio repeater mast construction in progress.' }
    ],
    telemetryReadings: [
      { timestamp: '08:00 AM', node: 'TOWER-GUA-01', maxThermalTemp: '34.2°C', smokeDetected: 'None', status: 'Normal Forest Background' },
      { timestamp: '02:00 PM', node: 'TOWER-GUA-01', maxThermalTemp: '42.1°C', smokeDetected: 'None', status: 'Normal Forest Background' }
    ]
  },
  {
    id: 'PRJ-106',
    title: 'Fluoride & Arsenic Continuous Nano-Filtration System for Rural Borewells',
    shortCode: 'WAT-FIL-208',
    sector: 'Water & Sanitation',
    district: 'Hazaribagh',
    hei: 'Vinoba Bhave University',
    heiType: 'State University',
    teamLead: 'Prof. Rashmi Verma',
    leadEmail: 'rverma.chem@vbu.ac.in',
    sanctionedGrant: '₹ 16.00 Lakhs',
    disbursedAmount: '₹ 16.00 Lakhs',
    disbursedPercentage: 100,
    milestonePhase: 'Phase 4: State Scaling',
    milestoneProgress: 100,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-8',
    trlDescription: 'Operating continuously in 5 Chouparan schools providing potable water to 2,400 students.',
    deploymentStatus: 'Validated ✓',
    deploymentLocation: 'Chouparan & Ichak High Schools, Hazaribagh',
    liveSensorsCount: 10,
    telemetryUptime: '99.5%',
    beneficiariesCount: '6,500 Rural Students & Villagers',
    hardwareSpecs: 'Graphene-Oxide Activated Alumina Filter Cartridge, SS304 Food-Grade Pressure Vessel, Inline Spectrophotometric Fluoride Sensor, Solar GSM Water Dispenser.',
    labsAndFacilities: 'Nano-Chemistry & Materials Research Lab, Vinoba Bhave University',
    milestones: [
      { id: 'M1', title: 'Nano-Composite Adsorbent Batch Synthesis & Capacity Testing', status: 'Completed', progress: 100, date: '2026-02-15', remarks: 'Adsorption capacity 24 mg F-/gram media.' },
      { id: 'M2', title: 'Gravity Pressure Vessel Fabrication & Flow Rate Benchmarking', status: 'Completed', progress: 100, date: '2026-04-10', remarks: 'Maintains 1,200 LPH with zero electricity.' },
      { id: 'M3', title: '5 School Pilot Installations & Water Testing Certification', status: 'Completed', progress: 100, date: '2026-06-30', remarks: 'Fluoride reduced from 4.8 mg/L to 0.45 mg/L.' },
      { id: 'M4', title: 'Public Health Department Validation Sign-Off', status: 'Completed', progress: 100, date: '2026-08-14', remarks: 'State Validation Certificate issued.' }
    ],
    telemetryReadings: [
      { timestamp: '08:30 AM', node: 'VBU-CHOU-01', inletFluoride: '4.8 mg/L', outletFluoride: '0.42 mg/L', dailyLitresDispensed: '3,450 L', status: 'Safe Drinking Water' },
      { timestamp: '01:30 PM', node: 'VBU-ICHAK-02', inletFluoride: '3.9 mg/L', outletFluoride: '0.38 mg/L', dailyLitresDispensed: '2,890 L', status: 'Safe Drinking Water' }
    ]
  },
  {
    id: 'PRJ-107',
    title: 'Open-Cast Mine Slope Stability & Landslide Prediction Millimeter Radar',
    shortCode: 'MIN-RAD-210',
    sector: 'Mining & Energy',
    district: 'Bokaro',
    hei: 'IIT (ISM) Dhanbad',
    heiType: 'Institute of National Importance',
    teamLead: 'Prof. Sanjay Banerjee',
    leadEmail: 'sbanerjee.geo@iitism.ac.in',
    sanctionedGrant: '₹ 34.00 Lakhs',
    disbursedAmount: '₹ 22.00 Lakhs',
    disbursedPercentage: 65,
    milestonePhase: 'Phase 3: Field Testing',
    milestoneProgress: 68,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-6',
    trlDescription: 'Radar scanning active bench face at CCL Kathara Open-Cast Mine.',
    deploymentStatus: 'Active Telemetry',
    deploymentLocation: 'CCL Kathara Colliery, Bokaro District',
    liveSensorsCount: 4,
    telemetryUptime: '99.1%',
    beneficiariesCount: '3,200 Heavy Earth Moving Operators',
    hardwareSpecs: '77 GHz InSAR FMCW Radar Array, High-Precision Azimuth Pan-Tilt Mast, FPGA Signal Processor Board, High-Gain Directional Antennas, 4G Wireless Surface Link.',
    labsAndFacilities: 'Radar Sensing & Mine Geotechnics Lab, IIT (ISM) Dhanbad',
    milestones: [
      { id: 'M1', title: '77 GHz InSAR Transceiver Design & Lab Range Benchmarking', status: 'Completed', progress: 100, date: '2026-03-10', remarks: '0.2mm displacement resolution validated.' },
      { id: 'M2', title: 'Atmospheric Moisture Drift Correction Algorithm', status: 'Completed', progress: 100, date: '2026-05-15', remarks: 'Weather drift filter accuracy 99.4%.' },
      { id: 'M3', title: 'CCL Kathara Mine Surface Deployment & Bench Tracking', status: 'In Progress', progress: 60, date: '2026-08-30', remarks: 'Continuous bench scan active; baseline displacement map created.' },
      { id: 'M4', title: 'Mine Safety Alert Integration & DGMS Operational Clearance', status: 'Pending', progress: 0, date: '2026-11-25', remarks: 'Scheduled post monsoon.' }
    ],
    telemetryReadings: [
      { timestamp: '09:00 AM', node: 'RADAR-KAT-01', maxDisplacement24h: '0.4 mm', benchStabilityIndex: '98.5%', status: 'Bench Stable' },
      { timestamp: '01:00 PM', node: 'RADAR-KAT-01', maxDisplacement24h: '0.6 mm', benchStabilityIndex: '98.1%', status: 'Bench Stable' }
    ]
  },
  {
    id: 'PRJ-108',
    title: 'Bio-Degradable Packaging Film from Sal Tree Resin & Agri-Waste',
    shortCode: 'BIO-PKG-212',
    sector: 'Environment & Forest',
    district: 'Ranchi',
    hei: 'ICAR RCER & Ranchi University',
    heiType: 'ICAR Research Institute & State University',
    teamLead: 'Dr. Anita Ekka',
    leadEmail: 'aekka.bio@icar.gov.in',
    sanctionedGrant: '₹ 15.00 Lakhs',
    disbursedAmount: '₹ 8.00 Lakhs',
    disbursedPercentage: 53,
    milestonePhase: 'Phase 2: Lab Testing',
    milestoneProgress: 45,
    prototypeType: 'Hardware',
    trlLevel: 'TRL-4',
    trlDescription: 'Bio-plastic film extrusion perfected in lab with tensile strength matching LDPE.',
    deploymentStatus: 'In Progress',
    deploymentLocation: 'ICAR Research Complex for Eastern Region, Plandu, Ranchi',
    liveSensorsCount: 2,
    telemetryUptime: '97.5%',
    beneficiariesCount: 'Tribal Non-Timber Forest Product Gatherers',
    hardwareSpecs: 'Twin-Screw Hot Melt Polymer Extruder, Film Blowing Tower, Universal Tensile Tester, ASTM D6400 Industrial Composting Test Chamber.',
    labsAndFacilities: 'Biopolymer & Agricultural Processing Lab, ICAR RCER Ranchi',
    milestones: [
      { id: 'M1', title: 'Sal Resin Purification & Plasticizer Compounding', status: 'Completed', progress: 100, date: '2026-04-10', remarks: 'Achieved homogenous biodegradable resin blend.' },
      { id: 'M2', title: 'Pilot Film Extrusion & Tensile Strength Testing', status: 'In Progress', progress: 70, date: '2026-08-20', remarks: 'Tensile strength 24 MPa achieved (exceeds LDPE standard).' },
      { id: 'M3', title: 'Soil Biodegradation & Marine Dissolution Audit', status: 'Pending', progress: 0, date: '2026-10-30', remarks: '60-day soil decomposition tests in progress.' },
      { id: 'M4', title: 'Commercial Packaging Sample Production for State Khadi Board', status: 'Pending', progress: 0, date: '2026-12-15', remarks: 'Pending milestone 3 completion.' }
    ],
    telemetryReadings: [
      { timestamp: '10:00 AM', node: 'EXTRUDER-01', meltTemp: '162°C', filmThickness: '42 micron', status: 'Optimal Extrusion Quality' }
    ]
  }
];
