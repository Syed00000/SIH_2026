export const INDUSTRY_TESTING_PARTNERS = [
  'Ariba Research Labs (NABL Accredited Testing Partner)',
  'Tata Steel R&D Hub (Jamshedpur)',
  'BCCL Heavy Equipment & Mine Automation Lab (Dhanbad)',
  'MECON Heavy Engineering Testing Facility (Ranchi)',
  'SAIL Bokaro Industrial Automation Division',
  'Jharkhand State Industrial Testing Council (JSITC)'
];

export const STANDARDIZED_TESTING_STAGES = [
  {
    stageNumber: 1,
    title: 'Sample Intake & Equipment Calibration',
    description: 'Physical validation, sensor zero-point profiling, and baseline spectrometer calibration.',
    expectedDays: '5 Days',
    color: 'blue',
    tests: [
      { id: 's1_intake', label: 'Component Intake & Dimensional Tolerance Verification' },
      { id: 's1_calib', label: 'Spectrometer & Analog Sensor Zero-Drift Calibration' },
      { id: 's1_voltage', label: 'Input Power Benchmarking & Voltage Surge Tolerance' }
    ]
  },
  {
    stageNumber: 2,
    title: 'Physical & Material Stress Testing',
    description: 'Simulated Jharkhand field conditions: thermal variance, humidity, vibration, and mechanical drop tests.',
    expectedDays: '10 Days',
    color: 'purple',
    tests: [
      { id: 's2_thermal', label: 'Environmental Stress & Thermal Range (-10°C to 55°C, 90% RH)' },
      { id: 's2_vibe', label: 'Heavy Mechanical Vibration, Cyclic Shock & Drop Compliance' },
      { id: 's2_reliability', label: '72-Hour Uninterrupted Continuous Field Reliability Trial' }
    ]
  },
  {
    stageNumber: 3,
    title: 'Certified Compliance & Lab Final Report',
    description: 'Industrial safety compliance, EMC/EMI benchmark audit, and formal signed lab testing report generation.',
    expectedDays: '7 Days',
    color: 'emerald',
    tests: [
      { id: 's3_emc', label: 'Industrial Safety & Electromagnetic Compatibility (EMC/EMI)' },
      { id: 's3_nabl', label: 'NABL ISO/IEC 17025 Standardized Quality Calibration Clearance' },
      { id: 's3_dossier', label: 'Certified Lab Testing Dossier & Official Signed Report (PDF)' }
    ]
  }
];
