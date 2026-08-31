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
      { stage: 1, title: 'Lab CAD & Circuit Rig', targetDays: 'Days 1-30', deliverable: 'Component procurement, PCB milling, sensor bench test' },
      { stage: 2, title: 'Field Ground Testing', targetDays: 'Days 31-75', deliverable: 'Telemetry calibration in rural pilot site' },
      { stage: 3, title: 'NABL Lab Certification', targetDays: 'Days 76-120', deliverable: 'Safety and quality standard test report' },
      { stage: 4, title: 'Public Rollout & Scale', targetDays: 'Days 121-180', deliverable: 'Deployment and handover to district administration' }
    ]
  },
  {
    label: '💧 Aqua & Water Quality',
    stages: [
      { stage: 1, title: 'Spectrometric Bench Rig', targetDays: 'Days 1-30', deliverable: 'Optical probe sensor integration & lab bench setup' },
      { stage: 2, title: 'Panchayat Well Pilot', targetDays: 'Days 31-60', deliverable: 'Ground testing in 5 high-fluoride village borewells' },
      { stage: 3, title: 'Water Board Lab Audit', targetDays: 'Days 61-100', deliverable: 'Accreditation from State Water & Sanitation Board' },
      { stage: 4, title: 'District Grid Rollout', targetDays: 'Days 101-150', deliverable: 'Real-time telemetry feeds active on State JoharSetu map' }
    ]
  },
  {
    label: '🌱 Agro-Tech & Drone Telemetry',
    stages: [
      { stage: 1, title: 'Airframe & Payload Assembly', targetDays: 'Days 1-25', deliverable: 'Multispectral camera payload & telemetry rig' },
      { stage: 2, title: 'Crop Canopy Ground Flight', targetDays: 'Days 26-60', deliverable: 'Validation flights over agricultural blocks' },
      { stage: 3, title: 'DGCA & Safety Audit', targetDays: 'Days 61-90', deliverable: 'Aviation and battery endurance certification' },
      { stage: 4, title: 'FPO & Collectorate Handover', targetDays: 'Days 91-140', deliverable: 'Handover to Farmer Producer Organizations' }
    ]
  }
];

export default {
  PRESET_CATEGORIES,
  ROADMAP_PRESETS
};
