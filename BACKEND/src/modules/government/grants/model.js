import mongoose from 'mongoose';

const governmentGrantFundSchema = new mongoose.Schema(
  {
    fundId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    scheme: { type: String, default: 'Jharkhand State Innovation Council R&D Allocation' },
    department: { type: String, default: 'Department of Higher & Technical Education' },
    departmentId: { type: String, default: '', index: true },
    departmentCategory: { type: String, default: '' },
    targetDeptCode: { type: String, default: '' },
    fundType: {
      type: String,
      enum: ['CORPUS_INFLOW', 'DEPARTMENT_ALLOCATION'],
      default: 'DEPARTMENT_ALLOCATION',
      index: true
    },
    amount: { type: Number, required: true },
    sanctionOrderNo: { type: String, default: '' },
    financialYear: { type: String, default: '2026-2027' },
    allocationDate: { type: Date, default: Date.now },
    allocatedBy: { type: String, default: 'Principal Secretary, Govt of Jharkhand' },
    description: { type: String, default: '' },
    status: { type: String, default: 'Active', index: true }
  },
  { timestamps: true, collection: 'government_grant_funds' }
);

export const GovernmentGrantFund =
  mongoose.models.GovernmentGrantFund ||
  mongoose.model('GovernmentGrantFund', governmentGrantFundSchema);

const governmentGrantPaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    payer: { type: String, default: 'Govt State Treasury (PFMS Escrow)' },
    payee: { type: String, required: true },
    amount: { type: String, required: true },
    rawAmount: { type: Number, required: true },
    disbursedAmount: { type: String, required: true },
    mode: { type: String, default: 'Direct PFMS' },
    utrNumber: { type: String, required: true, index: true },
    makerCheckerSign: { type: String, default: 'Authorized by State Nodal Officer' },
    makerCheckerStatus: { type: String, default: 'Approved' },
    bankAckStatus: { type: String, default: 'Credited to Beneficiary Account' },
    bankStatus: { type: String, default: 'success' },
    scheme: { type: String, default: 'Jharkhand State Innovation Grant' },
    projectRef: { type: String, required: true, index: true },
    projectTitle: { type: String, required: true },
    challengeId: { type: String, default: '', index: true },
    tdsAmount: { type: String, default: '₹ 0' },
    netDisbursed: { type: String, default: '' },
    purpose: { type: String, default: 'Tranche Disbursal' },
    timestamp: { type: Date, default: Date.now },
    utilizationStatus: { type: String, default: 'Under Execution' },
    complianceStatus: { type: String, default: 'Compliant' }
  },
  { timestamps: true, collection: 'government_grant_payments' }
);

export const GovernmentGrantPayment =
  mongoose.models.GovernmentGrantPayment ||
  mongoose.model('GovernmentGrantPayment', governmentGrantPaymentSchema);

const governmentPaymentGatewaySchema = new mongoose.Schema(
  {
    gatewayId: { type: String, required: true, unique: true, index: true },
    channel: { type: String, required: true },
    name: { type: String, required: true },
    protocol: { type: String, required: true },
    status: { type: String, default: 'Online & Verified' },
    avgSettlement: { type: String, default: '< 15 minutes' },
    dailyLimit: { type: String, default: '₹ 50.00 Cr' },
    primaryUse: { type: String, required: true },
    isOperational: { type: Boolean, default: true }
  },
  { timestamps: true, collection: 'government_payment_gateways' }
);

export const GovernmentPaymentGateway =
  mongoose.models.GovernmentPaymentGateway ||
  mongoose.model('GovernmentPaymentGateway', governmentPaymentGatewaySchema);

export default { GovernmentGrantFund, GovernmentGrantPayment, GovernmentPaymentGateway };

