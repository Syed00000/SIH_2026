import mongoose from 'mongoose';

const industrySchema = new mongoose.Schema(
  {
    industryId: {
      type: String,
      required: [true, 'Industry ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },
    legalName: {
      type: String,
      required: [true, 'Organization legal name is required'],
      trim: true,
      index: true
    },
    shortName: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Organization category is required'],
      enum: [
        'Private Industry',
        'MSME',
        'Govt Dept',
        'Government Department',
        'Research Lab',
        'Startup',
        'CSR',
        'PSU',
        'Industry Association',
        'Other'
      ],
      default: 'Private Industry',
      index: true
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: ''
    },
    thematicDomain: {
      type: String,
      required: [true, 'Thematic/Societal domain is required'],
      trim: true,
      index: true
    },
    thematicDomains: {
      type: [String],
      default: []
    },
    supportModes: {
      type: [String],
      required: [true, 'At least one mode of support is required'],
      default: ['Funding']
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    spocName: {
      type: String,
      required: [true, 'Nodal SPOC name is required'],
      trim: true
    },
    designation: {
      type: String,
      required: [true, 'SPOC designation is required'],
      trim: true
    },
    officialEmail: {
      type: String,
      required: [true, 'Official email address is required'],
      lowercase: true,
      trim: true,
      index: true
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true
    },
    alternateContact: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      addressLine1: { type: String, default: '' },
      addressLine2: { type: String, default: '' },
      state: { type: String, default: 'Jharkhand' },
      district: { type: String, default: 'Ranchi', index: true },
      city: { type: String, default: 'Ranchi' },
      pincode: { type: String, default: '834001' }
    },
    status: {
      type: String,
      enum: ['Active', 'Disabled', 'Pending', 'Inactive'],
      default: 'Active',
      index: true
    },
    accessStatus: {
      type: String,
      enum: ['Enabled', 'Disabled'],
      default: 'Enabled',
      index: true
    },
    verificationStatus: {
      type: String,
      enum: ['Verified', 'Pending', 'Rejected'],
      default: 'Verified',
      index: true
    },
    financials: {
      csrCommittedCr: { type: Number, default: 0 },
      supportedProjectsCount: { type: Number, default: 0 },
      labsCount: { type: Number, default: 0 }
    },
    credentials: {
      loginEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
      },
      generatedPassword: {
        type: String,
        required: true
      },
      passwordHash: {
        type: String,
        default: null
      }
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    auditLogs: [
      {
        action: { type: String, required: true },
        performedBy: { type: String, default: 'Government Admin' },
        timestamp: { type: Date, default: Date.now },
        details: { type: String, default: '' }
      }
    ]
  },
  {
    timestamps: true,
    collection: 'industries'
  }
);

export const MongooseIndustry =
  mongoose.models.Industry || mongoose.model('Industry', industrySchema, 'industries');

export default MongooseIndustry;
