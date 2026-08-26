export const MOCK_CSR_FUNDING_SOURCES = [
  { id: 'corporate_csr', code: 'A', title: 'A. Corporate CSR Funds', description: 'PSUs & Private entities bound by Sec 135. Fully audited under MCA guidelines.', activeDonors: '14', poolAmount: '₹68.5 Cr', iconColor: 'text-blue-600 bg-blue-50 border-blue-100', poolColor: 'text-blue-700 bg-blue-50/50' },
  { id: 'govt_grants', code: 'B', title: 'B. Government Grants', description: 'State budget allocations dedicated to higher education & infrastructure upgradation.', activeDonors: '08 Active Schemes', activeCount: '08', poolAmount: '₹110.0 Cr', iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100', poolColor: 'text-emerald-700 bg-emerald-50/50' },
  { id: 'joint_funding', code: 'C', title: 'C. Joint Co-Funding', description: 'Public-Private partnership models matching corporate grants with state subsidies.', activeDonors: '05 Active Projects', activeCount: '05', poolAmount: '₹35.0 Cr', iconColor: 'text-purple-600 bg-purple-50 border-purple-100', poolColor: 'text-purple-700 bg-purple-50/50' }
];

export const MOCK_STATUTORY_PARAMETERS = [
  { id: 'verified', label: 'TOTAL VERIFIED PROPOSALS', value: '38', supportingText: 'Applications Cleared', valueColor: 'text-slate-900', icon: 'CheckCircle2', iconColor: 'text-emerald-600 bg-emerald-50/80 border-emerald-100' },
  { id: 'pending', label: 'PENDING COMPLIANCE AUDIT', value: '04', supportingText: 'Under Active Review', valueColor: 'text-amber-600', icon: 'Clock', iconColor: 'text-amber-600 bg-amber-50/80 border-amber-100' },
  { id: 'rejected', label: 'REJECTED SUBMISSIONS', value: '02', supportingText: 'Invalid CSR-1 Filings', valueColor: 'text-red-600', icon: 'AlertTriangle', iconColor: 'text-red-600 bg-red-50/80 border-red-100' },
  { id: 'avg_time', label: 'AVERAGE APPROVAL TIME', value: '4.2', supportingText: 'Business Days', valueColor: 'text-blue-600', icon: 'Timer', iconColor: 'text-blue-600 bg-blue-50/80 border-blue-100' }
];

// Fully linked Proposals mapped to Projects & Solutions
export const MOCK_PROPOSAL_PIPELINE = [
  {
    id: 'PROP-011',
    solutionId: 'PROP-201',
    projectId: 'PRJ-101',
    projectTitle: 'Smart Dam Water Quality & Flood Telemetry IoT Node',
    institutionName: 'BIT Mesra (Innovation Hub)',
    hei: 'BIT Mesra',
    district: 'Ranchi',
    sector: 'Water & Sanitation',
    sourceScheme: 'Corporate CSR (Tata)',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Approved (A-Grade)',
    mouExecution: 'Signed & Active',
    allocatedAmount: '₹4.50 Cr',
    dprBudget: '₹18.50 Lakhs (Phase 1)',
    abstract: 'Automated flood alert edge-IoT node with water quality multi-probe array deployed across Subarnarekha river basin.'
  },
  {
    id: 'PROP-014',
    solutionId: 'PROP-202',
    projectId: 'PRJ-102',
    projectTitle: 'AI-Guided Underground Mine Toxic Gas Early Warning System',
    institutionName: 'NIT Jamshedpur (Robotics Wing)',
    hei: 'NIT Jamshedpur',
    district: 'East Singhbhum',
    sector: 'Mining & Energy',
    sourceScheme: 'Govt Grant (State)',
    dueDiligence: 'Under Technical Review',
    dueDiligenceStatus: 'review',
    boardApproval: 'Pending Meeting',
    mouExecution: 'Drafting Stage',
    allocatedAmount: '₹3.20 Cr',
    dprBudget: '₹24.00 Lakhs (Phase 1)',
    abstract: 'Intrinsically safe wireless sensor mesh monitoring methane and carbon monoxide in underground coal galleries.'
  },
  {
    id: 'PROP-019',
    solutionId: 'PROP-204',
    projectId: 'PRJ-104',
    projectTitle: 'Solar-Powered PCM Micro Cold Storage for Tribal Vegetables',
    institutionName: 'Ranchi University Tech Park',
    hei: 'Ranchi University',
    district: 'Ranchi',
    sector: 'Agriculture & Food',
    sourceScheme: 'Joint (CCL + State)',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Sanctioned Board',
    mouExecution: 'Executed',
    allocatedAmount: '₹8.00 Cr',
    dprBudget: '₹32.00 Lakhs (Phase 1)',
    abstract: 'Decentralized 5MT cold storage utilizing phase change materials ensuring 48-hour thermal retention without grid power.'
  },
  {
    id: 'PROP-023',
    solutionId: 'PROP-210',
    projectId: 'PRJ-116',
    projectTitle: 'Deep Borewell Arsenic & Fluoride Continuous Nano-Filter',
    institutionName: 'ISM Dhanbad Incubation Centre',
    hei: 'IIT (ISM) Dhanbad',
    district: 'Dhanbad',
    sector: 'Water & Sanitation',
    sourceScheme: 'Corporate CSR (ONGC)',
    dueDiligence: 'Passed (All Checks)',
    dueDiligenceStatus: 'passed',
    boardApproval: 'Approved (A-Grade)',
    mouExecution: 'Signed & Active',
    allocatedAmount: '₹5.75 Cr',
    dprBudget: '₹22.50 Lakhs (Phase 1)',
    abstract: 'Graphene-oxide hybrid filtration columns delivering 1000 L/hr potable drinking water in fluorosis-affected panchayats.'
  }
];

export const MOCK_CSR_PHASES = [
  { id: 'phase_1_2', phaseNumber: 'PHASE 1 & 2', title: 'Sources & Approvals' },
  { id: 'phase_3_4', phaseNumber: 'PHASE 3 & 4', title: 'Allocation & Transfer' },
  { id: 'phase_5_6', phaseNumber: 'PHASE 5 & 6', title: 'Utilization & Compliance' },
  { id: 'phase_7_8', phaseNumber: 'PHASE 7 & 8', title: 'Closure & Payment Modes' }
];

export const MOCK_ESCROW_COMPLIANCE_MATRIX = [
  { id: 'escrow_vaults', label: 'ACTIVE ESCROW ACCOUNTS', value: '12', supportingText: 'Dedicated SBI/BOI Vaults', color: 'text-slate-900' },
  { id: 'tds_withholding', label: 'TDS WITHHOLDING', value: 'ACTIVE', supportingText: '194C @ 2% · 194J @ 10%', color: 'text-emerald-600' },
  { id: 'maker_checker', label: 'MAKER-CHECKER', value: 'ENFORCED', supportingText: 'Dual-Key Authentication', color: 'text-blue-600' }
];

// Payment Ledger linked to Projects
export const MOCK_PAYMENT_LEDGER = [
  { id: 'PAY-99210', projectId: 'PRJ-101', projectTitle: 'Smart Dam IoT Telemetry', payer: 'Govt Escrow', payee: 'BIT Mesra', disbursedAmount: '₹1,50,000', mode: 'NEFT', utrNumber: 'UTR4920192831', makerCheckerSign: 'Verified & Approved', makerCheckerStatus: 'approved', bankAckStatus: 'Acknowledged', bankStatus: 'ack' },
  { id: 'PAY-99215', projectId: 'PRJ-102', projectTitle: 'Mine Gas Early Warning', payer: 'Tata Steel CSR', payee: 'NIT Jamshedpur', disbursedAmount: '₹5,00,000', mode: 'RTGS', utrNumber: 'UTR8839201924', makerCheckerSign: 'Pending Final Sign-off', makerCheckerStatus: 'pending', bankAckStatus: 'In Transit', bankStatus: 'transit' },
  { id: 'PAY-99222', projectId: 'PRJ-104', projectTitle: 'Solar Cold Storage', payer: 'CCL CSR', payee: 'Ranchi University', disbursedAmount: '₹12,50,000', mode: 'RTGS', utrNumber: 'UTR1192834756', makerCheckerSign: 'Verified & Approved', makerCheckerStatus: 'approved', bankAckStatus: 'Acknowledged', bankStatus: 'ack' },
  { id: 'PAY-99245', projectId: 'PRJ-116', projectTitle: 'Arsenic Nano-Filter', payer: 'ONGC CSR', payee: 'ISM Dhanbad', disbursedAmount: '₹8,75,000', mode: 'NEFT', utrNumber: 'UTR3349201102', makerCheckerSign: 'Verified & Approved', makerCheckerStatus: 'approved', bankAckStatus: 'Acknowledged', bankStatus: 'ack' }
];

// Utilization Transactions with Project mapping
export const MOCK_UTILIZATION_TRANSACTIONS = [
  { id: 'PAY-99210', projectId: 'PRJ-101', projectTitle: 'Smart Dam IoT', tracking: 'Govt Escrow — BIT Mesra', amount: '₹1,50,000', mode: 'NEFT', utr: 'UTR420192831', makerChecker: 'Verified & Approved', makerCheckerStatus: 'approved', bankAck: 'Received & Ack.', bankStatus: 'ack' },
  { id: 'PAY-99213', projectId: 'PRJ-101', projectTitle: 'Smart Dam IoT', tracking: 'Govt Escrow — BIT Mesra', amount: '₹1,50,000', mode: 'NEFT', utr: 'UTR833931324', makerChecker: 'Pending Final Sign-Off', makerCheckerStatus: 'pending', bankAck: 'In Transit', bankStatus: 'transit' },
  { id: 'PAY-99215', projectId: 'PRJ-102', projectTitle: 'Mine Gas Safety', tracking: 'Tata Steel CSR — NIT Jamshedpur', amount: '₹5,00,000', mode: 'RTGS', utr: 'UTR833921924', makerChecker: 'Pending Final Sign-Off', makerCheckerStatus: 'pending', bankAck: 'In Transit', bankStatus: 'transit' }
];

// Project Milestone Progress records
export const MOCK_PROJECT_MILESTONES_MAP = {
  'PRJ-101': [
    { id: 'item_1', title: 'Item 1. Milestone Work Execution (Dam Sensors)', percent: 60, color: 'bg-emerald-600' },
    { id: 'item_2', title: 'Item 2. Expense Incurred (Telemetry Hardware)', percent: 80, color: 'bg-blue-600' },
    { id: 'item_4', title: 'Item 4. Milestone Completion Report (Stage Gate 2)', percent: 70, color: 'bg-amber-500' },
    { id: 'item_5', title: 'Item 5. Request for Next Tranche (Field Testing)', percent: 40, color: 'bg-indigo-600' }
  ],
  'PRJ-102': [
    { id: 'item_1', title: 'Item 1. Milestone Work Execution (Mine Mesh Nodes)', percent: 45, color: 'bg-emerald-600' },
    { id: 'item_2', title: 'Item 2. Expense Incurred (Gas Analyzer Kits)', percent: 65, color: 'bg-blue-600' },
    { id: 'item_4', title: 'Item 4. Milestone Completion Report (DGMS Audit)', percent: 50, color: 'bg-amber-500' },
    { id: 'item_5', title: 'Item 5. Request for Next Tranche (Pilot Gallery)', percent: 30, color: 'bg-indigo-600' }
  ],
  'PRJ-104': [
    { id: 'item_1', title: 'Item 1. Milestone Work Execution (PCM Enclosure)', percent: 85, color: 'bg-emerald-600' },
    { id: 'item_2', title: 'Item 2. Expense Incurred (Solar PV Hybrid Inverter)', percent: 90, color: 'bg-blue-600' },
    { id: 'item_4', title: 'Item 4. Milestone Completion Report (NABL Thermal Test)', percent: 85, color: 'bg-amber-500' },
    { id: 'item_5', title: 'Item 5. Request for Next Tranche (Final Deployment)', percent: 75, color: 'bg-indigo-600' }
  ]
};

export const MOCK_MILESTONES_PROGRESS = MOCK_PROJECT_MILESTONES_MAP['PRJ-101'];

export const MOCK_COMPLIANCE_CHECKLIST = [
  { id: 'c1', title: 'Document Verification', subtitle: 'Linked with DPR & UC submissions', status: 'Checked', statusType: 'checked' },
  { id: 'c2', title: 'Physical Verification', subtitle: '(Site visit / Geo-tagging on GIS Map)', status: 'Pending', statusType: 'pending' },
  { id: 'c3', title: 'Financial Verification', subtitle: '(Bank statements, Escrow UC check)', status: 'In-progress', statusType: 'progress' },
  { id: 'c4', title: 'Compliance Check', subtitle: '(CSR Schedule VII & State R&D Policy)', status: 'In-progress', statusType: 'progress' },
  { id: 'c5', title: 'Approved / Verified Status', subtitle: 'Directorate Technical Sanction', status: 'Checked', statusType: 'checked' }
];

export const MOCK_CLOSURE_STEPS = [
  { step: '1', title: 'GFR 12-A UC Submission', desc: 'Utilization Certificate successfully generated and submitted to state portal with digital signatures.' },
  { step: '2', title: 'CA Audit Validation', desc: 'Chartered Accountant cross-verified expense vouchers against actual escrow bank logs.' },
  { step: '3', title: 'Unspent Fund Sweep', desc: 'Unutilized project capital automatically swept back to the main corpus within statutory 30-day window.' }
];

export const MOCK_DISBURSAL_MODES = [
  { channel: 'RTGS API', channelStyle: 'bg-blue-50 text-blue-700 border-blue-200', useCase: 'High-value institutional tranche payouts & capital grants', rules: 'Min ₹2 Lakh threshold (Real-time settlement)', audit: 'High (Auto UTR Generation)' },
  { channel: 'NEFT Batch', channelStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200', useCase: 'Standard operational fund transfers to colleges', rules: 'No upper limit (Hourly scheduled clearing batches)', audit: 'High (Bank Acknowledgement)' },
  { channel: 'Direct PFMS', channelStyle: 'bg-amber-50 text-amber-700 border-amber-200', useCase: 'Direct-to-Beneficiary / Vendor disbursements', rules: 'Mapped with central Public Financial Management System', audit: 'Full Direct Tracking' }
];
