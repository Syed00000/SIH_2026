/**
 * Comprehensive CSR & Government Grants Fund Lifecycle Mock Data
 * Based on Section 135 of Companies Act, Schedule VII guidelines,
 * GFR 12-A Compliance, and Jharkhand State Higher & Technical Education Framework.
 */

export const MOCK_CSR_FUNDING_SOURCES = [
  {
    id: 'corporate_csr',
    code: 'A',
    title: 'A. Corporate CSR Funds',
    description: 'PSUs & Private entities bound by Sec 135. Fully audited under MCA guidelines.',
    activeDonors: '14',
    activeCount: '14 Donors',
    poolAmount: '₹68.5 Cr',
    committedAmount: '₹54.2 Cr',
    disbursedAmount: '₹22.8 Cr',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
    poolColor: 'text-blue-700 bg-blue-50/50',
    topDonors: [
      { name: 'Tata Steel CSR Foundation', committed: '₹18.5 Cr', sector: 'Robotics & Advanced Metallurgy', status: 'Active' },
      { name: 'ONGC CSR Directorate', committed: '₹14.0 Cr', sector: 'Geothermal & Energy Innovation', status: 'Active' },
      { name: 'BCCL / Coal India CSR', committed: '₹12.0 Cr', sector: 'Mine Safety & Clean Energy', status: 'Active' },
      { name: 'NTPC CSR Trust', committed: '₹8.0 Cr', sector: 'Solar Microgrids & Rural Power', status: 'Active' },
      { name: 'Adani Foundation', committed: '₹6.0 Cr', sector: 'Agritech & Water Harvesting', status: 'Active' }
    ]
  },
  {
    id: 'govt_grants',
    code: 'B',
    title: 'B. Government Grants',
    description: 'State budget allocations dedicated to higher education & infrastructure upgradation.',
    activeDonors: '08 Active Schemes',
    activeCount: '08 Schemes',
    poolAmount: '₹110.0 Cr',
    committedAmount: '₹89.0 Cr',
    disbursedAmount: '₹41.5 Cr',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    poolColor: 'text-emerald-700 bg-emerald-50/50',
    topDonors: [
      { name: 'Jharkhand State Higher Ed Corpus (RUSA)', committed: '₹45.0 Cr', sector: 'Center of Excellence Labs', status: 'Active' },
      { name: 'Mukhyamantri Takniki Protsahan Yojna', committed: '₹30.0 Cr', sector: 'Tribal Student Incubation', status: 'Active' },
      { name: 'Dept of Higher & Technical Education Grant', committed: '₹20.0 Cr', sector: 'Smart Campus & Supercomputing', status: 'Active' },
      { name: 'State Innovation & Startup Fund (JFS)', committed: '₹15.0 Cr', sector: 'Grassroots Patent Filing', status: 'Active' }
    ]
  },
  {
    id: 'joint_funding',
    code: 'C',
    title: 'C. Joint Co-Funding',
    description: 'Public-Private partnership models matching corporate grants with state subsidies.',
    activeDonors: '05 Active Projects',
    activeCount: '05 Projects',
    poolAmount: '₹35.0 Cr',
    committedAmount: '₹28.5 Cr',
    disbursedAmount: '₹14.2 Cr',
    iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
    poolColor: 'text-purple-700 bg-purple-50/50',
    topDonors: [
      { name: 'CCL + Jharkhand State Joint R&D Hub', committed: '₹15.0 Cr', sector: 'Affordable Clean Water Filtration', status: 'Active' },
      { name: 'Tata Steel + DHTE Advanced AI Hub', committed: '₹12.0 Cr', sector: 'Smart Logistics & Heavy Machinery AI', status: 'Active' },
      { name: 'Jindal Power + State Tribal Tech Scheme', committed: '₹8.0 Cr', sector: 'Renewable Biomass Gassifiers', status: 'Active' }
    ]
  }
];

export const MOCK_STATUTORY_PARAMETERS = [
  {
    id: 'verified',
    label: 'TOTAL VERIFIED PROPOSALS',
    value: '38',
    supportingText: 'Applications Cleared',
    valueColor: 'text-slate-900',
    icon: 'CheckCircle2',
    iconColor: 'text-emerald-600 bg-emerald-50/80 border-emerald-100'
  },
  {
    id: 'pending',
    label: 'PENDING COMPLIANCE AUDIT',
    value: '04',
    supportingText: 'Under Active Review',
    valueColor: 'text-amber-600',
    icon: 'Clock',
    iconColor: 'text-amber-600 bg-amber-50/80 border-amber-100'
  },
  {
    id: 'rejected',
    label: 'REJECTED SUBMISSIONS',
    value: '02',
    supportingText: 'Invalid CSR-1 Filings',
    valueColor: 'text-red-600',
    icon: 'AlertTriangle',
    iconColor: 'text-red-600 bg-red-50/80 border-red-100'
  },
  {
    id: 'avg_time',
    label: 'AVERAGE APPROVAL TIME',
    value: '4.2',
    supportingText: 'Business Days',
    valueColor: 'text-blue-600',
    icon: 'Timer',
    iconColor: 'text-blue-600 bg-blue-50/80 border-blue-100'
  }
];

export const MOCK_PROPOSAL_PIPELINE = [
  {
    id: 'PROP-011',
    institutionName: 'BIT Mesra (Innovation Hub)',
    projectTitle: 'IoT & Remote Sensing for Arsenic Water Remediation in Santhal Pargana',
    district: 'Ranchi',
    sourceScheme: 'Corporate CSR (Tata)',
    donor: 'Tata Steel CSR Foundation',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Approved (A-Grade)',
    mouExecution: 'Signed & Active',
    allocatedAmount: '₹4.50 Cr',
    disbursedToDate: '₹1.50 Cr',
    csr1Number: 'CSR00018921',
    pan80G: '80G-AAAT0129K',
    mouSignedDate: '12 Jan 2026',
    leadSpoc: 'Dr. Amitabh Verma (Head of Innovation)',
    feasibilityScore: '94/100',
    totalTranches: 4,
    currentTranche: 2,
    remarks: 'Approved by State Apex CSR committee. First tranche released into dedicated SBI Escrow Vault.'
  },
  {
    id: 'PROP-014',
    institutionName: 'NIT Jamshedpur (Robotics Wing)',
    projectTitle: 'Autonomous Mine Rescue Rover & Hazardous Gas Telemetry Sensor Suite',
    district: 'East Singhbhum',
    sourceScheme: 'Govt Grant (State)',
    donor: 'Mukhyamantri Takniki Protsahan Yojna',
    dueDiligence: 'Under Technical Review',
    dueDiligenceStatus: 'review',
    boardApproval: 'Pending Meeting',
    mouExecution: 'Drafting Stage',
    allocatedAmount: '₹3.20 Cr',
    disbursedToDate: '₹0.00 Cr',
    csr1Number: 'GOV-GR-2026-90',
    pan80G: '12A-EXEMPT-NIT',
    mouSignedDate: 'Pending Signatures',
    leadSpoc: 'Prof. Ramesh Soren (Robotics Chair)',
    feasibilityScore: '86/100',
    totalTranches: 3,
    currentTranche: 1,
    remarks: 'Technical committee review scheduled for Friday. DPR vetted with positive remarks.'
  },
  {
    id: 'PROP-019',
    institutionName: 'Ranchi University Tech Park',
    projectTitle: 'High-Performance Solar Drying & Cold Chain Infrastructure for Lac Farmers',
    district: 'Ranchi',
    sourceScheme: 'Joint (CCL + State)',
    donor: 'CCL CSR + State Matching Grant',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Sanctioned Board',
    mouExecution: 'Executed',
    allocatedAmount: '₹8.00 Cr',
    disbursedToDate: '₹3.25 Cr',
    csr1Number: 'CSR00029341',
    pan80G: '80G-RU-7718A',
    mouSignedDate: '04 Feb 2026',
    leadSpoc: 'Dr. Sunita Murmu (Director R&D)',
    feasibilityScore: '91/100',
    totalTranches: 4,
    currentTranche: 2,
    remarks: 'Tripartite MoU signed between CCL, Ranchi University, and Dept of Higher Ed.'
  },
  {
    id: 'PROP-023',
    institutionName: 'ISM Dhanbad Incubation Centre',
    projectTitle: 'AI-Powered Underground Seismic Micro-Tremor Detection & Disaster Warning',
    district: 'Dhanbad',
    sourceScheme: 'Corporate CSR (ONGC)',
    donor: 'ONGC CSR Directorate',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Approved (A-Grade)',
    mouExecution: 'Signed & Active',
    allocatedAmount: '₹5.75 Cr',
    disbursedToDate: '₹2.10 Cr',
    csr1Number: 'CSR00041829',
    pan80G: '80G-IITISM-101',
    mouSignedDate: '18 Jan 2026',
    leadSpoc: 'Prof. K. K. Mahato (Geophysics Dept)',
    feasibilityScore: '96/100',
    totalTranches: 3,
    currentTranche: 2,
    remarks: 'Field trials initiated in Jharia coalfields. Telemetry data stream live on State Portal.'
  },
  {
    id: 'PROP-027',
    institutionName: 'Kolhan University Chaibasa',
    projectTitle: 'Mobile Telemedicine & Diagnostic Vans for Remote Iron-Ore Belt Villages',
    district: 'West Singhbhum',
    sourceScheme: 'Corporate CSR (Tata)',
    donor: 'Tata Steel CSR Foundation',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Approved (A-Grade)',
    mouExecution: 'Signed & Active',
    allocatedAmount: '₹2.80 Cr',
    disbursedToDate: '₹1.10 Cr',
    csr1Number: 'CSR00055210',
    pan80G: '80G-KU-9921D',
    mouSignedDate: '22 Feb 2026',
    leadSpoc: 'Dr. Binod Kumar (Health Tech Incharge)',
    feasibilityScore: '89/100',
    totalTranches: 2,
    currentTranche: 1,
    remarks: 'Procurement of diagnostic sensors and battery telemetry systems in progress.'
  },
  {
    id: 'PROP-031',
    institutionName: 'Sido Kanhu Murmu University Dumka',
    projectTitle: 'Sanitation Tech & Solar Powered Water Purifiers for Tribal Hostels',
    district: 'Dumka',
    sourceScheme: 'Govt Grant (State)',
    donor: 'Jharkhand Tribal Welfare Development Fund',
    dueDiligence: 'Under Technical Review',
    dueDiligenceStatus: 'review',
    boardApproval: 'Pending Meeting',
    mouExecution: 'Drafting Stage',
    allocatedAmount: '₹1.90 Cr',
    disbursedToDate: '₹0.00 Cr',
    csr1Number: 'GOV-GR-2026-114',
    pan80G: '12A-EXEMPT-SKMU',
    mouSignedDate: 'Under Legal Vetting',
    leadSpoc: 'Prof. Anjali Hansda',
    feasibilityScore: '82/100',
    totalTranches: 2,
    currentTranche: 1,
    remarks: 'Awaiting site inspection certificate from Dumka District Collectorate.'
  }
];

export const MOCK_CSR_PHASES = [
  { id: 'phase_1_2', phaseNumber: 'PHASE 1 & 2', title: 'Sources & Approvals' },
  { id: 'phase_3_4', phaseNumber: 'PHASE 3 & 4', title: 'Allocation & Transfer' },
  { id: 'phase_5_6', phaseNumber: 'PHASE 5 & 6', title: 'Utilization & Compliance' },
  { id: 'phase_7_8', phaseNumber: 'PHASE 7 & 8', title: 'Closure & Payment Modes' }
];

export const MOCK_ESCROW_COMPLIANCE_MATRIX = [
  {
    id: 'escrow_vaults',
    label: 'ACTIVE ESCROW ACCOUNTS',
    value: '12',
    supportingText: 'Dedicated SBI/BOI Vaults',
    color: 'text-slate-900',
    details: '12 Dedicated Escrow Accounts with Zero-Balance Sweeping & Dual Key Sign-off'
  },
  {
    id: 'tds_withholding',
    label: 'TDS WITHHOLDING',
    value: 'ACTIVE',
    supportingText: '194C @ 2% · 194J @ 10%',
    color: 'text-emerald-600',
    details: 'Automatic Tax Deduction at Source on all Vendor and Sub-grant transfers'
  },
  {
    id: 'maker_checker',
    label: 'MAKER-CHECKER',
    value: 'ENFORCED',
    supportingText: 'Dual-Key Authentication',
    color: 'text-blue-600',
    details: 'Tranche release requires simultaneous Level-1 Financial Officer and Level-2 Secretary Signatures'
  }
];

export const MOCK_ESCROW_ACCOUNTS = [
  {
    vaultId: 'VAULT-SBI-01',
    bankName: 'State Bank of India',
    branch: 'Ranchi Main Branch (Court Road)',
    accountNumber: '409182390192',
    ifsc: 'SBIN0000167',
    corpusAllocated: '₹45.00 Cr',
    currentBalance: '₹26.40 Cr',
    lockedTranches: '₹18.60 Cr',
    status: 'Active & Audited',
    schemeMapped: 'Corporate CSR (Tata) & Govt Grants'
  },
  {
    vaultId: 'VAULT-BOI-02',
    bankName: 'Bank of India',
    branch: 'Doranda Secretariat Branch, Ranchi',
    accountNumber: '582910293812',
    ifsc: 'BKID0004921',
    corpusAllocated: '₹35.00 Cr',
    currentBalance: '₹19.25 Cr',
    lockedTranches: '₹15.75 Cr',
    status: 'Active & Audited',
    schemeMapped: 'Govt Grants (RUSA) & State Welfare'
  },
  {
    vaultId: 'VAULT-PNB-03',
    bankName: 'Punjab National Bank',
    branch: 'Hinoo Commercial Hub, Ranchi',
    accountNumber: '192830192841',
    ifsc: 'PUNB0192800',
    corpusAllocated: '₹30.00 Cr',
    currentBalance: '₹14.80 Cr',
    lockedTranches: '₹15.20 Cr',
    status: 'Active & Audited',
    schemeMapped: 'Joint Co-Funding (CCL + ONGC + State)'
  }
];

export const MOCK_PAYMENT_LEDGER = [
  {
    id: 'PAY-99210',
    payer: 'Govt Escrow',
    payee: 'BIT Mesra',
    disbursedAmount: '₹1,50,000',
    mode: 'NEFT',
    utrNumber: 'UTR4920192831',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '2026-08-26 11:34 AM',
    scheme: 'Govt Grant (State)',
    projectRef: 'PROP-011',
    tdsAmount: '₹3,000 (194C)',
    netDisbursed: '₹1,47,000',
    purpose: 'Tranche 2: Milestone Work Execution & Sensor Lab Rig'
  },
  {
    id: 'PAY-99215',
    payer: 'Tata Steel CSR',
    payee: 'NIT Jamshedpur',
    disbursedAmount: '₹5,00,000',
    mode: 'RTGS',
    utrNumber: 'UTR8839201924',
    makerCheckerSign: 'Pending Final Sign-off',
    makerCheckerStatus: 'pending',
    bankAckStatus: 'In Transit',
    bankStatus: 'transit',
    timestamp: '2026-08-27 05:45 AM',
    scheme: 'Corporate CSR (Tata)',
    projectRef: 'PROP-014',
    tdsAmount: '₹10,000 (194C)',
    netDisbursed: '₹4,90,000',
    purpose: 'Tranche 1: Autonomous Rover Chassis and Telemetry Equipment'
  },
  {
    id: 'PAY-99222',
    payer: 'CCL CSR',
    payee: 'Ranchi University',
    disbursedAmount: '₹12,50,000',
    mode: 'RTGS',
    utrNumber: 'UTR1192834756',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '2026-08-25 03:20 PM',
    scheme: 'Joint (CCL + State)',
    projectRef: 'PROP-019',
    tdsAmount: '₹25,000 (194C)',
    netDisbursed: '₹12,25,000',
    purpose: 'Tranche 2: Cold Chain Solar Infrastructure Installation'
  },
  {
    id: 'PAY-99245',
    payer: 'ONGC CSR',
    payee: 'ISM Dhanbad',
    disbursedAmount: '₹8,75,000',
    mode: 'NEFT',
    utrNumber: 'UTR3349281102',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '2026-08-24 02:15 PM',
    scheme: 'Corporate CSR (ONGC)',
    projectRef: 'PROP-023',
    tdsAmount: '₹17,500 (194C)',
    netDisbursed: '₹8,57,500',
    purpose: 'Tranche 2: Seismic Sensor Grid Calibration in Jharia'
  },
  {
    id: 'PAY-99258',
    payer: 'Govt Escrow',
    payee: 'Kolhan University',
    disbursedAmount: '₹3,50,000',
    mode: 'Direct PFMS',
    utrNumber: 'PFMS7781029318',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack',
    timestamp: '2026-08-23 04:10 PM',
    scheme: 'Govt Grant (State)',
    projectRef: 'PROP-027',
    tdsAmount: '₹7,000 (194C)',
    netDisbursed: '₹3,43,000',
    purpose: 'Tranche 1: Mobile Diagnostic Van Medical Sensor Kit'
  }
];

export const MOCK_UTILIZATION_TRANSACTIONS = [
  {
    id: 'PAY-99210',
    tracking: 'Govt Escrow — BIT Mesra',
    amount: '₹1,50,000',
    mode: 'NEFT',
    utr: 'UTR4920192831',
    makerChecker: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAck: 'Received & Ack.',
    bankStatus: 'ack',
    projectRef: 'PROP-011',
    milestones: {
      workExecution: 60,
      expenseIncurred: 80,
      completionReport: 70,
      nextTrancheRequest: 40
    }
  },
  {
    id: 'PAY-99213',
    tracking: 'Govt Escrow — BIT Mesra',
    amount: '₹1,50,000',
    mode: 'NEFT',
    utr: 'UTR833931324',
    makerChecker: 'Pending Final Sign-Off',
    makerCheckerStatus: 'pending',
    bankAck: 'In Transit',
    bankStatus: 'transit',
    projectRef: 'PROP-011',
    milestones: {
      workExecution: 45,
      expenseIncurred: 50,
      completionReport: 30,
      nextTrancheRequest: 20
    }
  },
  {
    id: 'PAY-99215',
    tracking: 'Tata Steel CSR — NIT Jamshedpur',
    amount: '₹5,00,000',
    mode: 'RTGS',
    utr: 'UTR8839201924',
    makerChecker: 'Pending Final Sign-Off',
    makerCheckerStatus: 'pending',
    bankAck: 'In Transit',
    bankStatus: 'transit',
    projectRef: 'PROP-014',
    milestones: {
      workExecution: 75,
      expenseIncurred: 90,
      completionReport: 80,
      nextTrancheRequest: 65
    }
  },
  {
    id: 'PAY-99222',
    tracking: 'CCL CSR — Ranchi University',
    amount: '₹12,50,000',
    mode: 'RTGS',
    utr: 'UTR1192834756',
    makerChecker: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAck: 'Received & Ack.',
    bankStatus: 'ack',
    projectRef: 'PROP-019',
    milestones: {
      workExecution: 85,
      expenseIncurred: 95,
      completionReport: 90,
      nextTrancheRequest: 80
    }
  }
];

export const MOCK_MILESTONES_PROGRESS = [
  { id: 'item_1', title: 'Item 1. Milestone Work Execution', percent: 60, color: 'bg-emerald-600', icon: 'Share2' },
  { id: 'item_2', title: 'Item 2. Expense Incurred', percent: 80, color: 'bg-blue-600', icon: 'CreditCard' },
  { id: 'item_4', title: 'Item 4. Milestone Completion Report', percent: 70, color: 'bg-amber-500', icon: 'FileText' },
  { id: 'item_5', title: 'Item 5. Request for Next Tranche', percent: 40, color: 'bg-indigo-600', icon: 'Coins' }
];

export const MOCK_COMPLIANCE_CHECKLIST = [
  {
    id: 'c1',
    title: 'Document Verification',
    subtitle: '',
    status: 'Checked',
    statusType: 'checked',
    verifiedDate: '24 Aug 2026',
    officer: 'Finance Directorate (Jharkhand Gov)',
    notes: '80G, 12A, CSR-1 and Approved Budget DPR vetted with seal.'
  },
  {
    id: 'c2',
    title: 'Physical Verification',
    subtitle: '(Site visit / Geo-tagging)',
    status: 'Pending',
    statusType: 'pending',
    verifiedDate: 'Scheduled 29 Aug 2026',
    officer: 'District Technical Field Inspector',
    notes: 'Geo-tagged camera inspection pending for laboratory equipment installation site.'
  },
  {
    id: 'c3',
    title: 'Financial Verification',
    subtitle: '(Bank statements, UC check)',
    status: 'In-progress',
    statusType: 'progress',
    verifiedDate: 'Under Audit',
    officer: 'Chartered Accountant Panel (Govt Empanelled)',
    notes: 'Cross-verifying Escrow ledger debits with GST vendor invoices.'
  },
  {
    id: 'c4',
    title: 'Compliance Check',
    subtitle: '(CSR Rules, State Policy)',
    status: 'In-progress',
    statusType: 'progress',
    verifiedDate: 'Under Review',
    officer: 'Department of Higher & Technical Education',
    notes: 'Schedule VII Item (ii) Higher Education & Innovation compliance check.'
  },
  {
    id: 'c5',
    title: 'Approved / Verified Status',
    subtitle: '',
    status: 'Checked',
    statusType: 'checked',
    verifiedDate: '26 Aug 2026',
    officer: 'Super Approver / Principal Secretary',
    notes: 'All Level-1 and Level-2 clearances authorized for tranche release.'
  }
];

export const MOCK_CLOSURE_STEPS = [
  {
    step: '1',
    title: 'GFR 12-A UC Submission',
    desc: 'Utilization Certificate successfully generated and submitted to state portal with digital signatures.',
    status: 'Completed',
    ucNumber: 'GFR12A-JH-2026-081',
    signedBy: 'Registrar & Finance Officer, BIT Mesra',
    date: '22 Aug 2026',
    grantSanctioned: '₹4,50,00,000',
    grantUtilized: '₹4,38,20,000',
    unspentCorpus: '₹11,80,000'
  },
  {
    step: '2',
    title: 'CA Audit Validation',
    desc: 'Chartered Accountant cross-verified expense vouchers against actual escrow bank logs.',
    status: 'Audit Cleared',
    caFirm: 'M/s S. K. Agrawal & Co., Chartered Accountants (FRN: 306033E)',
    caCertificateNo: 'CA/JH/2026/AUD-449',
    opinion: 'Unqualified / Clean Opinion - No Financial Leakage Detected',
    date: '24 Aug 2026'
  },
  {
    step: '3',
    title: 'Unspent Fund Sweep',
    desc: 'Unutilized project capital automatically swept back to the main corpus within statutory 30-day window.',
    status: 'Auto-Swept',
    sweepRef: 'SWP-SBI-2026-9921',
    sweptAmount: '₹11,80,000',
    destinationVault: 'State Higher Ed Innovation Main Corpus (SBI)',
    date: '25 Aug 2026'
  }
];

export const MOCK_DISBURSAL_MODES = [
  {
    channel: 'RTGS API',
    channelStyle: 'bg-blue-50 text-blue-700 border-blue-200',
    useCase: 'High-value institutional tranche payouts & capital grants',
    rules: 'Min ₹2 Lakh threshold (Real-time settlement)',
    audit: 'High (Auto UTR Generation)',
    gatewayName: 'RBI Direct Member RTGS Gateway / SBI Host-to-Host',
    latency: '24 ms',
    uptime: '99.98%',
    activeLimit: '₹50.00 Cr / day',
    autoRecon: 'Real-time Webhook Push'
  },
  {
    channel: 'NEFT Batch',
    channelStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    useCase: 'Standard operational fund transfers to colleges',
    rules: 'No upper limit (Hourly scheduled clearing batches)',
    audit: 'High (Bank Acknowledgement)',
    gatewayName: 'RBI NEFT Batch Clearing Protocol (N02/N03)',
    latency: '45 mins',
    uptime: '99.95%',
    activeLimit: '₹25.00 Cr / batch',
    autoRecon: 'Hourly UTR Reconciliation'
  },
  {
    channel: 'Direct PFMS',
    channelStyle: 'bg-amber-50 text-amber-700 border-amber-200',
    useCase: 'Direct-to-Beneficiary / Vendor disbursements',
    rules: 'Mapped with central Public Financial Management System',
    audit: 'Full Direct Tracking',
    gatewayName: 'Central PFMS Gateway (Govt of India / MoF)',
    latency: '15 ms',
    uptime: '99.99%',
    activeLimit: '₹100.00 Cr / day',
    autoRecon: 'Central Treasury Direct Sync'
  }
];
