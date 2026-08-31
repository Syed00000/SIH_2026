import mongoose from 'mongoose';
import { addressSchema, financialsSchema, credentialsSchema, auditLogSchema } from './industry-sub.schemas.js';

export const industrySchema = new mongoose.Schema(
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
    shortName: { type: String, trim: true, default: '' },
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
    registrationNumber: { type: String, trim: true, default: '' },
    thematicDomain: {
      type: String,
      required: [true, 'Thematic/Societal domain is required'],
      trim: true,
      index: true
    },
    thematicDomains: { type: [String], default: [] },
    supportModes: {
      type: [String],
      required: [true, 'At least one mode of support is required'],
      default: ['Funding']
    },
    website: { type: String, trim: true, default: '' },
    spocName: { type: String, required: [true, 'Nodal SPOC name is required'], trim: true },
    designation: { type: String, required: [true, 'SPOC designation is required'], trim: true },
    officialEmail: {
      type: String,
      required: [true, 'Official email address is required'],
      lowercase: true,
      trim: true,
      index: true
    },
    mobileNumber: { type: String, required: [true, 'Mobile number is required'], trim: true },
    alternateContact: { type: String, trim: true, default: '' },
    address: { type: addressSchema, default: () => ({}) },
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
    financials: { type: financialsSchema, default: () => ({}) },
    credentials: { type: credentialsSchema, default: () => ({}) },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    auditLogs: { type: [auditLogSchema], default: [] }
  },
  {
    timestamps: true,
    collection: 'industries'
  }
);

export default industrySchema;
