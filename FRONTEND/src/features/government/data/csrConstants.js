export const CSR_PHASES = [
  { id: 'phase_1_2', phaseNumber: 'PHASE 1 & 2', title: 'Sources & Approvals' },
  { id: 'phase_3_4', phaseNumber: 'PHASE 3 & 4', title: 'Allocation & Transfer' },
  { id: 'phase_5_6', phaseNumber: 'PHASE 5 & 6', title: 'Utilization & Compliance' },
  { id: 'phase_7_8', phaseNumber: 'PHASE 7 & 8', title: 'Closure & Payment Modes' }
];

export const DISBURSAL_GATEWAY_MODES = [
  {
    id: 'PFMS-DIRECT',
    channel: 'PFMS-DIRECT',
    name: 'Public Financial Management System (PFMS E-Payment)',
    protocol: 'NIC-PFMS REST API Gateway v4.2',
    status: 'Online & Verified',
    avgSettlement: '< 15 minutes',
    dailyLimit: '₹ 50.00 Cr',
    primaryUse: 'State Government Grants & HEI Research Fellowship Disbursals'
  },
  {
    id: 'RBI-RTGS',
    channel: 'RBI-RTGS',
    name: 'RBI Real Time Gross Settlement (Bulk SFMS)',
    protocol: 'SFMS ISO 20022 Direct Connect',
    status: 'Online & Verified',
    avgSettlement: 'Instant (Real-Time)',
    dailyLimit: 'Unlimited',
    primaryUse: 'Large Tranche CSR Escrow-to-HEI Bank Account Transfers'
  },
  {
    id: 'TREASURY-ESCROW',
    channel: 'TREASURY-ESCROW',
    name: 'Scheduled Commercial Bank Escrow APIs (SBI / BOI)',
    protocol: 'Corporate Banking Webhook v2',
    status: 'Online & Verified',
    avgSettlement: '5 minutes',
    dailyLimit: '₹ 100.00 Cr',
    primaryUse: 'PPP Joint Co-Funding & Corporate CSR Direct Allocations'
  }
];

export const COMPLIANCE_CHECKLIST_ITEMS = [
  {
    id: 'gfr_12a',
    title: 'Rule 238(1) GFR 2017: Form GFR 12-A Utilization Certificate Submitted',
    authority: 'Dept of Higher & Technical Education',
    status: 'Verified',
    statusType: 'verified'
  },
  {
    id: 'mou_signoff',
    title: 'Tripartite MoU Executed between Govt, HEI, and Corporate Escrow Trustee',
    authority: 'State Legal Directorate',
    status: 'Verified',
    statusType: 'verified'
  },
  {
    id: 'milestone_signoff',
    title: 'TRL Stage Deliverable Validated by Domain Expert Review Committee',
    authority: 'State Innovation Council (SIC)',
    status: 'Verified',
    statusType: 'verified'
  },
  {
    id: 'tax_deduction',
    title: 'TDS (Sec 194J / 194C) Withholding Certificates Generated on TRACES',
    authority: 'Income Tax Department',
    status: 'Pending',
    statusType: 'pending'
  }
];

export const CLOSURE_REPORTING_STEPS = [
  {
    id: 'step_1_gfr',
    title: 'Statutory Form GFR 12-A Utilization Submission',
    desc: 'Mandatory GFR 2017 compliance certificate issued by Nodal University Finance Officer.',
    status: 'Completed',
    statusType: 'completed'
  },
  {
    id: 'step_2_audit',
    title: 'Independent Chartered Accountant (CA) Audit Verification',
    desc: 'External statutory financial audit verifying that all line-item disbursements align with the approved research budget.',
    status: 'Verified',
    statusType: 'verified'
  },
  {
    id: 'step_3_sweep',
    title: 'Unspent Grant Corpus Reverse-Sweep into State Treasury',
    desc: 'Rule 230(8) automated refund sweep of unutilized interest and capital balances back to the Consolidated State Escrow Pool.',
    status: 'Automated Rule Active',
    statusType: 'active'
  }
];

export default {
  CSR_PHASES,
  DISBURSAL_GATEWAY_MODES,
  COMPLIANCE_CHECKLIST_ITEMS,
  CLOSURE_REPORTING_STEPS
};
