export const MOCK_CSR_PHASES = [
  { id: 'phase_1_2', phaseNumber: 'PHASE 1 & 2', title: 'Sources & Approvals' },
  { id: 'phase_3_4', phaseNumber: 'PHASE 3 & 4', title: 'Allocation & Transfer' },
  { id: 'phase_5_6', phaseNumber: 'PHASE 5 & 6', title: 'Utilization & Compliance' },
  { id: 'phase_7_8', phaseNumber: 'PHASE 7 & 8', title: 'Closure & Payment Modes' }
];

export const MOCK_ESCROW_ACCOUNTS = [
  {
    id: 'ESC-TATA-01',
    accountName: 'State-Tata Steel Joint Innovation Escrow',
    bank: 'State Bank of India (CAG Branch Ranchi)',
    accountNumber: '••••••••8912',
    ifsc: 'SBIN0000167',
    holdingAmount: '₹ 25.00 Cr',
    lockedDisbursals: '₹ 8.50 Cr',
    availableLiquidity: '₹ 16.50 Cr',
    tripartiteParties: ['Govt of Jharkhand (Dept of HTE)', 'Tata Steel CSR Foundation', 'SBI Trustee']
  },
  {
    id: 'ESC-CCL-02',
    accountName: 'CCL Clean Energy & Mining Tech Pool',
    bank: 'Punjab National Bank (Main Road Ranchi)',
    accountNumber: '••••••••4431',
    ifsc: 'PUNB0024000',
    holdingAmount: '₹ 18.50 Cr',
    lockedDisbursals: '₹ 4.20 Cr',
    availableLiquidity: '₹ 14.30 Cr',
    tripartiteParties: ['Govt of Jharkhand (Dept of HTE)', 'Central Coalfields Limited', 'PNB Custody']
  },
  {
    id: 'ESC-ONGC-03',
    accountName: 'ONGC-Jharkhand Subsurface & Mining Escrow',
    bank: 'Bank of India (Dhanbad Corporate Branch)',
    accountNumber: '••••••••7721',
    ifsc: 'BKID0004901',
    holdingAmount: '₹ 25.00 Cr',
    lockedDisbursals: '₹ 5.00 Cr',
    availableLiquidity: '₹ 20.00 Cr',
    tripartiteParties: ['Govt of Jharkhand (Dept of HTE)', 'ONGC CSR Directorate', 'BOI Custody']
  }
];

export const MOCK_ESCROW_COMPLIANCE_MATRIX = [
  {
    id: 'escrow_vaults',
    label: 'ACTIVE ESCROW ACCOUNTS',
    value: '12',
    valueColor: 'text-slate-900',
    supportingText: 'DISBURSED: 95.8% | READY: 100%',
    icon: 'Landmark',
    iconColor: 'bg-slate-50 text-slate-700 border-slate-200'
  },
  {
    id: 'tds_withholding',
    label: 'TDS WITHHOLDING',
    value: 'ACTIVE',
    valueColor: 'text-emerald-600',
    supportingText: '194C @ 2% | 194J @ 10%',
    icon: 'FileCheck',
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200'
  },
  {
    id: 'maker_checker',
    label: 'MAKER-CHECKER',
    value: 'ENFORCED',
    valueColor: 'text-blue-600',
    supportingText: 'Dual-Key Authorization',
    icon: 'KeyRound',
    iconColor: 'bg-blue-50 text-blue-600 border-blue-200'
  }
];

export const MOCK_FULL_PAYMENT_LEDGER = [
  {
    id: 'PAY-99210',
    payer: 'Govt State Innovation Fund',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81047180181',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '20 May 2026'
  },
  {
    id: 'PAY-99211',
    payer: 'Govt State Innovation Fund',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR78104812455',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '19 May 2026'
  },
  {
    id: 'PAY-99212',
    payer: 'Govt State Innovation Fund',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81093481234',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '18 May 2026'
  },
  {
    id: 'PAY-99213',
    payer: 'Govt State Innovation Fund',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81048194821',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '17 May 2026'
  },
  {
    id: 'PAY-99214',
    payer: 'Govt State Innovation Fund',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81048381832',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '16 May 2026'
  },
  {
    id: 'PAY-99215',
    payer: 'Govt State Innovation Fund',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81048381833',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '15 May 2026'
  },
  {
    id: 'PAY-99216',
    payer: 'Govt State Innovation Fund',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81048381834',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '14 May 2026'
  },
  {
    id: 'PAY-99217',
    payer: 'Govt State Innovation Fund',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81048381835',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '13 May 2026'
  },
  {
    id: 'PAY-99218',
    payer: 'Tata Steel CSR Foundation',
    payee: 'Sido Kanhu Murmu University',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81048381836',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '12 May 2026'
  },
  {
    id: 'PAY-99219',
    payer: 'Govt Sanction',
    payee: 'BIT Mesra',
    disbursedAmount: '₹ 1,50,000',
    rawAmount: 150000,
    mode: 'NEFT',
    utrNumber: 'UTR81048381837',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '11 May 2026'
  },
  {
    id: 'PAY-99220',
    payer: 'Tata Steel CSR',
    payee: 'NIT Jamshedpur',
    disbursedAmount: '₹ 1,00,000',
    rawAmount: 100000,
    mode: 'RTGS',
    utrNumber: 'UTR81048381838',
    makerCheckerSign: 'Pending Dual Sign-off',
    makerCheckerStatus: 'pending',
    bankAckStatus: 'In Transit',
    bankStatus: 'pending',
    timestamp: '10 May 2026'
  },
  {
    id: 'PAY-99221',
    payer: 'CCL CSR',
    payee: 'Ranchi University',
    disbursedAmount: '₹ 2,50,000',
    rawAmount: 250000,
    mode: 'RTGS',
    utrNumber: 'UTR81048381839',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '09 May 2026'
  },
  {
    id: 'PAY-99222',
    payer: 'ONGC CSR',
    payee: 'ISM Dhanbad',
    disbursedAmount: '₹ 6,71,000',
    rawAmount: 671000,
    mode: 'NEFT',
    utrNumber: 'UTR81048381840',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '08 May 2026'
  },
  {
    id: 'PAY-99223',
    payer: 'Govt Sanction',
    payee: 'Kolhan University',
    disbursedAmount: '₹ 50,000',
    rawAmount: 50000,
    mode: 'Direct PFMS',
    utrNumber: 'UTR81048381841',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '07 May 2026'
  }
];

export const MOCK_UTILIZATION_TRANSACTIONS = [
  {
    id: 'TXN-9021',
    heiName: 'BIT Mesra',
    project: 'Autonomous Agriculture Drone & Field Robotics',
    category: 'Hardware & Sensor Rig Components',
    vendor: 'AeroFab Sensor Labs Pvt Ltd',
    amount: '₹ 12,50,000',
    invoiceNumber: 'INV-2026-0891',
    ucStatus: 'Verified & Audited',
    date: '14 May 2026'
  },
  {
    id: 'TXN-9022',
    heiName: 'NIT Jamshedpur',
    project: 'Industrial Hazardous Waste Surveillance Rover',
    category: 'Chassis & Microcontroller Prototyping',
    vendor: 'RoboCore Embedded Systems',
    amount: '₹ 8,40,000',
    invoiceNumber: 'INV-2026-0412',
    ucStatus: 'Under Technical Scrutiny',
    date: '22 May 2026'
  },
  {
    id: 'TXN-9023',
    heiName: 'Ranchi University Tech Park',
    project: 'Water Quality Monitoring in Rural Areas',
    category: 'Telemetry Gateway & Spectrometer',
    vendor: 'AquaSense IoT Instruments',
    amount: '₹ 45,000',
    invoiceNumber: 'INV-2026-1082',
    ucStatus: 'Verified & Audited',
    date: '28 May 2026'
  }
];

export const MOCK_MILESTONES_PROGRESS = [
  {
    heiName: 'BIT Mesra',
    projectTitle: 'Autonomous Agriculture Drone & Field Robotics',
    milestones: [
      { name: 'TRL-4 Lab Prototype Rig', completed: true, date: '10 April 2026' },
      { name: 'TRL-6 Field Sensor Testing', completed: true, date: '15 May 2026' },
      { name: 'TRL-7 Real Field Deployment', completed: false, dueDate: '30 July 2026' }
    ]
  },
  {
    heiName: 'NIT Jamshedpur',
    projectTitle: 'Industrial Hazardous Waste Surveillance Rover',
    milestones: [
      { name: 'Component Sourcing & Schematic', completed: true, date: '01 May 2026' },
      { name: 'Hazardous Chamber Rig Test', completed: false, dueDate: '15 July 2026' }
    ]
  }
];

export const MOCK_COMPLIANCE_CHECKLIST = [
  {
    id: 'COMP-01',
    title: 'Schedule VII Eligibility Validation',
    status: 'Passed',
    notes: 'Covered under Item (ix) - Contribution to incubators funded by Central/State Govt.'
  },
  {
    id: 'COMP-02',
    title: 'MCA CSR-1 Registration Active',
    status: 'Passed',
    notes: 'Registrations verified against Ministry of Corporate Affairs API node.'
  },
  {
    id: 'COMP-03',
    title: 'Section 80G Tax Exemption Certificate',
    status: 'Passed',
    notes: 'Income Tax Form 10AC verified for all receiving University accounts.'
  },
  {
    id: 'COMP-04',
    title: 'CAG / Statutory CA Empanelment',
    status: 'Passed',
    notes: 'Audited by empanelled Chartered Accountants per statutory mandates.'
  }
];

export const MOCK_CLOSURE_STEPS = [
  {
    step: 1,
    title: 'Final Technical Evaluation & TRL Milestone Sign-off',
    status: 'Completed',
    authority: 'State Technical Review Panel'
  },
  {
    step: 2,
    title: 'Chartered Accountant Statutory Audit Certificate (Form GFR-12A)',
    status: 'Submitted & Cleared',
    authority: 'Empanelled CAG Audit Firm'
  },
  {
    step: 3,
    title: 'Unspent Grant Sweep to Jharkhand Innovation Corpus Fund',
    status: 'Automated Real-Time Sweep Ready',
    authority: 'RBI RTGS Treasury Gateway'
  },
  {
    step: 4,
    title: 'MCA CSR Final Form CSR-2 Filing & Digital Closure Dossier',
    status: 'Completed & Digitally Signed',
    authority: 'MCA Portal Sync Node'
  }
];

export const MOCK_DISBURSAL_MODES = [
  {
    id: 'PFMS-GATEWAY',
    name: 'PFMS Direct DBT / Treasury Node',
    protocol: 'PFMS API v3.2 (Ministry of Finance)',
    status: 'Online & Verified',
    avgSettlement: '20 minutes',
    dailyLimit: '₹ 50.00 Cr',
    primaryUse: 'State Government Grants & HEI Research Fellowship Disbursals'
  },
  {
    id: 'RBI-RTGS',
    name: 'RBI Real Time Gross Settlement (Bulk SFMS)',
    protocol: 'SFMS ISO 20022 Direct Connect',
    status: 'Online & Verified',
    avgSettlement: 'Instant (Real-Time)',
    dailyLimit: 'Unlimited',
    primaryUse: 'Large Tranche CSR Escrow-to-HEI Bank Account Transfers'
  },
  {
    id: 'TREASURY-ESCROW',
    name: 'Scheduled Commercial Bank Escrow APIs (SBI / BOI)',
    protocol: 'Corporate Banking Webhook v2',
    status: 'Online & Verified',
    avgSettlement: '5 minutes',
    dailyLimit: '₹ 100.00 Cr',
    primaryUse: 'PPP Joint Co-Funding & Corporate CSR Direct Allocations'
  }
];

export default {
  MOCK_CSR_PHASES,
  MOCK_ESCROW_ACCOUNTS,
  MOCK_ESCROW_COMPLIANCE_MATRIX,
  MOCK_FULL_PAYMENT_LEDGER,
  MOCK_UTILIZATION_TRANSACTIONS,
  MOCK_MILESTONES_PROGRESS,
  MOCK_COMPLIANCE_CHECKLIST,
  MOCK_CLOSURE_STEPS,
  MOCK_DISBURSAL_MODES
};
