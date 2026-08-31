import mongoose from 'mongoose';

export const quickSummarySchema = new mongoose.Schema(
  {
    departments: { type: Number, default: 12 },
    totalFaculty: { type: Number, default: 60 },
    availableFaculty: { type: Number, default: 35 },
    labsAndFacilities: { type: Number, default: 15 },
    activeProjects: { type: Number, default: 8 },
    capacityStatus: {
      type: String,
      enum: ['Available', 'Limited', 'Full'],
      default: 'Available'
    }
  },
  { _id: false }
);

export const accreditationSchema = new mongoose.Schema(
  {
    naacGrade: {
      type: String,
      enum: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'NA', 'Non-Accredited'],
      default: 'A'
    },
    validity: { type: String, default: '2028-12-31' },
    nirfRanking: { type: Number, default: null }
  },
  { _id: false }
);

export const nodalOfficerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Nodal Officer Name is required'], trim: true },
    designation: { type: String, default: 'Registrar', trim: true },
    email: { type: String, required: [true, 'Nodal Officer Email is required'], lowercase: true, trim: true },
    phone: { type: String, required: [true, 'Nodal Officer Phone is required'], trim: true }
  },
  { _id: false }
);

export const credentialsSchema = new mongoose.Schema(
  {
    loginEmail: { type: String, required: true, lowercase: true, trim: true },
    generatedPassword: { type: String, required: true },
    passwordHash: { type: String, default: null }
  },
  { _id: false }
);

export const addressSchema = new mongoose.Schema(
  {
    campus: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: 'Jharkhand' },
    pincode: { type: String, default: '' }
  },
  { _id: false }
);

export const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    facultyCount: { type: Number, default: 0 }
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
