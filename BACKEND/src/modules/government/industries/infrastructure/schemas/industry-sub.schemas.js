import mongoose from 'mongoose';

export const addressSchema = new mongoose.Schema(
  {
    addressLine1: { type: String, default: '' },
    addressLine2: { type: String, default: '' },
    state: { type: String, default: 'Jharkhand' },
    district: { type: String, default: 'Ranchi', index: true },
    city: { type: String, default: 'Ranchi' },
    pincode: { type: String, default: '834001' }
  },
  { _id: false }
);

export const financialsSchema = new mongoose.Schema(
  {
    csrCommittedCr: { type: Number, default: 0 },
    supportedProjectsCount: { type: Number, default: 0 },
    labsCount: { type: Number, default: 0 }
  },
  { _id: false }
);

export const credentialsSchema = new mongoose.Schema(
  {
    loginEmail: { type: String, lowercase: true, trim: true, default: '' },
    generatedPassword: { type: String, default: '' },
    passwordHash: { type: String, default: null }
  },
  { _id: false }
);

export const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    performedBy: { type: String, default: 'Government Admin' },
    timestamp: { type: Date, default: Date.now },
    details: { type: String, default: '' }
  },
  { _id: false }
);
