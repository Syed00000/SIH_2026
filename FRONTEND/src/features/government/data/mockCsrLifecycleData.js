export const MOCK_CSR_FUNDING_SOURCES = [
  {
    id: 'corporate_csr',
    code: 'A',
    title: 'A. Corporate CSR Funds',
    description: 'PSUs & Private entities bound by Sec 135. Fully audited under MCA guidelines.',
    activeDonors: '14',
    poolAmount: '₹68.5 Cr',
    iconColor: 'text-blue-600 bg-blue-50 border-blue-100',
    poolColor: 'text-blue-700 bg-blue-50/50'
  },
  {
    id: 'govt_grants',
    code: 'B',
    title: 'B. Government Grants',
    description: 'State budget allocations dedicated to higher education & infrastructure upgradation.',
    activeDonors: '08 Active Schemes',
    activeCount: '08',
    poolAmount: '₹110.0 Cr',
    iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    poolColor: 'text-emerald-700 bg-emerald-50/50'
  },
  {
    id: 'joint_funding',
    code: 'C',
    title: 'C. Joint Co-Funding',
    description: 'Public-Private partnership models matching corporate grants with state subsidies.',
    activeDonors: '05 Active Projects',
    activeCount: '05',
    poolAmount: '₹35.0 Cr',
    iconColor: 'text-purple-600 bg-purple-50 border-purple-100',
    poolColor: 'text-purple-700 bg-purple-50/50'
  }
];

export const MOCK_STATUTORY_PARAMETERS = [
  { id: 'verified', label: 'Total Verified Proposals', value: '38 Applications Cleared', statusColor: 'text-slate-800' },
  { id: 'pending', label: 'Pending Compliance Audit', value: '04 Under Review', statusColor: 'text-amber-700' },
  { id: 'rejected', label: 'Rejected Submissions', value: '02 (Invalid CSR-1)', statusColor: 'text-red-600' },
  { id: 'avg_time', label: 'Average Approval Time', value: '4.2 Business Days', statusColor: 'text-blue-600' }
];

export const MOCK_PROPOSAL_PIPELINE = [
  { id: 'PROP-011', institutionName: 'BIT Mesra (Innovation Hub)', sourceScheme: 'Corporate CSR (Tata)', dueDiligence: 'Passed (All Checks)', dueDiligenceStatus: 'passed', boardApproval: 'Approved (A-Grade)', mouExecution: 'Signed & Active', allocatedAmount: '₹4.50 Cr' },
  { id: 'PROP-014', institutionName: 'NIT Jamshedpur (Robotics Wing)', sourceScheme: 'Govt Grant (State)', dueDiligence: 'Under Technical Review', dueDiligenceStatus: 'review', boardApproval: 'Pending Meeting', mouExecution: 'Drafting Stage', allocatedAmount: '₹3.20 Cr' },
  { id: 'PROP-019', institutionName: 'Ranchi University Tech Park', sourceScheme: 'Joint (CCL + State)', dueDiligence: 'Passed (All Checks)', dueDiligenceStatus: 'passed', boardApproval: 'Sanctioned Board', mouExecution: 'Executed', allocatedAmount: '₹8.00 Cr' },
  { id: 'PROP-023', institutionName: 'ISM Dhanbad Incubation Centre', sourceScheme: 'Corporate CSR (ONGC)', dueDiligence: 'Passed (All Checks)', dueDiligenceStatus: 'passed', boardApproval: 'Approved (A-Grade)', mouExecution: 'Signed & Active', allocatedAmount: '₹5.75 Cr' },
  { id: 'PROP-027', institutionName: 'BBMKU Dhanbad IoT Center', sourceScheme: 'Corporate CSR (BCCL)', dueDiligence: 'Passed (All Checks)', dueDiligenceStatus: 'passed', boardApproval: 'Approved (A-Grade)', mouExecution: 'Signed & Active', allocatedAmount: '₹2.80 Cr' },
  { id: 'PROP-031', institutionName: 'VBU Hazaribagh Agri-Tech Lab', sourceScheme: 'Govt Grant (State)', dueDiligence: 'Under Technical Review', dueDiligenceStatus: 'review', boardApproval: 'Pending Meeting', mouExecution: 'Drafting Stage', allocatedAmount: '₹1.90 Cr' },
  { id: 'PROP-035', institutionName: 'Kolhan University Clean Tech', sourceScheme: 'Joint (Tata Steel + State)', dueDiligence: 'Passed (All Checks)', dueDiligenceStatus: 'passed', boardApproval: 'Sanctioned Board', mouExecution: 'Executed', allocatedAmount: '₹6.10 Cr' }
];

export const MOCK_CSR_PHASES = [
  { id: 'phase_1_2', phaseNumber: 'PHASE 1 & 2', title: 'Sources & Approvals' },
  { id: 'phase_3_4', phaseNumber: 'PHASE 3 & 4', title: 'Allocation & Transfer' },
  { id: 'phase_5_6', phaseNumber: 'PHASE 5 & 6', title: 'Utilization & Compliance' },
  { id: 'phase_7_8', phaseNumber: 'PHASE 7 & 8', title: 'Closure & Payment Modes' }
];

// Phase 3 & 4: Escrow Account Lock-In & Tax Compliance Matrix
export const MOCK_ESCROW_COMPLIANCE_MATRIX = [
  { id: 'escrow_vaults', label: 'Active Escrow Pool Accounts', value: '12 Dedicated SBI/BOI Vaults', color: 'text-slate-800' },
  { id: 'tds_withholding', label: 'Automated TDS Withholding', value: 'Active (194C @2% & 194J @10%)', color: 'text-emerald-700' },
  { id: 'maker_checker', label: 'Maker-Checker Gate Status', value: 'Dual-Key Authentication Enforced', color: 'text-blue-700' }
];

// Phase 3 & 4: Payment Transfer Ledger (UTR Tracking & Maker-Checker)
export const MOCK_PAYMENT_LEDGER = [
  {
    id: 'PAY-99210',
    payerPayee: 'Govt Escrow ➔ BIT Mesra',
    payer: 'Govt Escrow',
    payee: 'BIT Mesra',
    disbursedAmount: '₹1,50,000',
    mode: 'NEFT',
    utrNumber: 'UTR4920192831',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack'
  },
  {
    id: 'PAY-99215',
    payerPayee: 'Tata Steel CSR ➔ NIT Jamshedpur',
    payer: 'Tata Steel CSR',
    payee: 'NIT Jamshedpur',
    disbursedAmount: '₹5,00,000',
    mode: 'RTGS',
    utrNumber: 'UTR8839201924',
    makerCheckerSign: 'Pending Final Sign-off',
    makerCheckerStatus: 'pending',
    bankAckStatus: 'In Transit',
    bankStatus: 'transit'
  },
  {
    id: 'PAY-99222',
    payerPayee: 'CCL CSR ➔ Ranchi University',
    payer: 'CCL CSR',
    payee: 'Ranchi University',
    disbursedAmount: '₹12,50,000',
    mode: 'RTGS',
    utrNumber: 'UTR1192834756',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack'
  },
  {
    id: 'PAY-99245',
    payerPayee: 'ONGC CSR ➔ ISM Dhanbad',
    payer: 'ONGC CSR',
    payee: 'ISM Dhanbad',
    disbursedAmount: '₹8,75,000',
    mode: 'NEFT',
    utrNumber: 'UTR3349201102',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack'
  },
  {
    id: 'PAY-99260',
    payerPayee: 'BCCL CSR ➔ BBMKU Dhanbad',
    payer: 'BCCL CSR',
    payee: 'BBMKU Dhanbad',
    disbursedAmount: '₹3,20,000',
    mode: 'NEFT',
    utrNumber: 'UTR5510293847',
    makerCheckerSign: 'Verified & Approved',
    makerCheckerStatus: 'approved',
    bankAckStatus: 'Acknowledged',
    bankStatus: 'ack'
  }
];
