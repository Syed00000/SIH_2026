export const PRESET_CATEGORIES = [
  { label: '+ Telemetry Sensors', title: 'Sensors & Microcontrollers', amount: 25000 },
  { label: '+ Lab Prototyping', title: '3D Enclosures & Lab PCB Rig', amount: 18000 },
  { label: '+ Ground Field Trials', title: 'District Field Trials & Calibration', amount: 15000 },
  { label: '+ Student Fellowship', title: 'Student Research Fellowship', amount: 10000 },
  { label: '+ Consumables & Reagents', title: 'Chemical Reagents & Test Kits', amount: 7000 }
];

export const ROADMAP_PRESETS = [
  {
    label: '⚡ Hardware & IoT Sensors',
    stages: [
      {
        stage: 1,
        title: 'Lab CAD, Schematic Design & Circuit Rig',
        targetDays: 'Days 1-30',
        deliverable: 'Component procurement, custom multi-layer PCB milling, breadboard circuit verification, sensor bench test under controlled chamber temperatures, and initial firmware flashing for low-power analog data acquisition.'
      },
      {
        stage: 2,
        title: 'Prototype Assembly & Field Ground Testing',
        targetDays: 'Days 31-75',
        deliverable: 'Assembly of weatherproof IP67 enclosures, LoRaWAN / GSM telemetry calibration in rural pilot sites, stress testing battery endurance under intermittent solar charging cycles, and continuous real-time packet loss analysis.'
      },
      {
        stage: 3,
        title: 'NABL Lab Certification & Quality Audit',
        targetDays: 'Days 76-120',
        deliverable: 'Submission of prototype hardware to NABL-accredited testing laboratory, electromagnetic compatibility (EMC) clearance, thermal shock testing report generation, and third-party benchmark certification.'
      },
      {
        stage: 4,
        title: 'District Pilot Rollout & Administrative Handover',
        targetDays: 'Days 121-180',
        deliverable: 'Deployment of 15 pilot node units across target district clusters, end-to-end telemetry synchronization with State JoharSetu dashboard, capacity building workshops for district nodal officers, and final DPR sign-off.'
      }
    ]
  },
  {
    label: '💧 Aqua & Water Quality',
    stages: [
      {
        stage: 1,
        title: 'Spectrometric Optical Rig & Lab Calibration',
        targetDays: 'Days 1-30',
        deliverable: 'Integration of multi-wavelength optical sensors, laboratory reagent titration benchmark testing, baseline calibration against standard fluoride/arsenic samples, and microcontroller interface firmware development.'
      },
      {
        stage: 2,
        title: 'Panchayat Borewell Ground Pilot Trials',
        targetDays: 'Days 31-60',
        deliverable: 'Deployment of continuous monitoring immersion probes in 5 high-fluoride village borewells, automated turbidity and pH telemetry logging, and comparative correlation with manual laboratory titrations.'
      },
      {
        stage: 3,
        title: 'State Water Board Quality Audit & Validation',
        targetDays: 'Days 61-100',
        deliverable: 'Official joint testing and audit with State Drinking Water & Sanitation Department engineers, verification of autonomous threshold alert triggers, and compliance documentation under Jal Jeevan Mission standards.'
      },
      {
        stage: 4,
        title: 'District Water Grid Telemetry Integration',
        targetDays: 'Days 101-150',
        deliverable: 'Full integration of live sensor data streams into State JoharSetu geospatial water map, automated SMS alert dispatch to block development officers, and handover of maintenance protocols to Gram Panchayat water committees.'
      }
    ]
  },
  {
    label: '🌱 Agro-Tech & Drone Telemetry',
    stages: [
      {
        stage: 1,
        title: 'Airframe Fabrication & Multispectral Payload Assembly',
        targetDays: 'Days 1-25',
        deliverable: 'Custom carbon-fiber airframe assembly, gimbal mounting of NDVI multispectral imaging sensors, power distribution board bench testing, and ground control station telemetry synchronization.'
      },
      {
        stage: 2,
        title: 'Crop Canopy Flight Calibration & Mapping',
        targetDays: 'Days 26-60',
        deliverable: 'Autonomous waypoint flight validation over 50 hectares of paddy and pulse farmlands, sensor orthomosaic image stitching, real-time crop moisture deficit indexing, and telemetry signal integrity analysis.'
      },
      {
        stage: 3,
        title: 'DGCA Compliance & Field Endurance Testing',
        targetDays: 'Days 61-90',
        deliverable: 'Flight log documentation submission for DGCA compliance, battery fail-safe and return-to-home endurance stress testing under high wind conditions, and farmer advisory accuracy verification.'
      },
      {
        stage: 4,
        title: 'FPO Handover & Collectorate DPR Submission',
        targetDays: 'Days 91-140',
        deliverable: 'Operational training of Farmer Producer Organization (FPO) youth operators, cloud integration of farm-level advisory push notifications, and formal submission of Project Completion DPR to District Agriculture Officer.'
      }
    ]
  }
];

export default {
  PRESET_CATEGORIES,
  ROADMAP_PRESETS
};
