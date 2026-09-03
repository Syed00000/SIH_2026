export const CSR_PHASES = [
  { id: 'phase_1_2', phaseNumber: 'PHASE 1 & 2', title: 'Sources & Approvals' },
  { id: 'phase_3_4', phaseNumber: 'PHASE 3 & 4', title: 'Allocation & Transfer' },
  { id: 'phase_5_6', phaseNumber: 'PHASE 5 & 6', title: 'Utilization & Compliance' }
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
  COMPLIANCE_CHECKLIST_ITEMS,
  CLOSURE_REPORTING_STEPS
};
