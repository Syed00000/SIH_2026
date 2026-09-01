import mongoose from 'mongoose';
import {
  quickSummarySchema,
  accreditationSchema,
  nodalOfficerSchema,
  credentialsSchema,
  addressSchema,
  departmentSchema,
  auditLogSchema
} from './university-sub.schemas.js';

export const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University/Institution name is required'],
      trim: true,
      unique: true,
      index: true
    },
    shortName: { type: String, trim: true, default: '' },
    code: {
      type: String,
      required: [true, 'University Code is required'],
      trim: true,
      unique: true,
      uppercase: true,
      index: true
    },
    universityType: {
      type: String,
      enum: ['Central University', 'State University', 'Private University', 'Deemed', 'Autonomous', 'Institute of National Importance', 'Other'],
      default: 'State University'
    },
    institutionCategory: {
      type: String,
      enum: ['University', 'Institute of National Importance', 'Engineering College', 'Medical College', 'Other'],
      default: 'University'
    },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Active', 'Inactive', 'Rejected'],
      default: 'Approved',
      index: true
    },
    accessStatus: {
      type: String,
      enum: ['Enabled', 'Disabled'],
      default: 'Enabled',
      index: true
    },
    establishmentYear: { type: Number, default: null },
    website: { type: String, trim: true, default: '' },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true
    },
    quickSummary: {
      type: quickSummarySchema,
      default: () => ({})
    },
    focusAreas: {
      type: [String],
      default: []
    },
    accreditation: {
      type: accreditationSchema,
      default: () => ({})
    },
    nodalOfficer: {
      type: nodalOfficerSchema,
      required: true
    },
    universityEmail: {
      type: String,
      required: [true, 'University Email is required'],
      lowercase: true,
      trim: true
    },
    universityPhone: { type: String, trim: true, default: '' },
    credentials: {
      type: credentialsSchema,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    aisheCode: { type: String, trim: true, default: '' },
    tagline: { type: String, trim: true, default: '' },
    about: { type: String, trim: true, default: '' },
    address: {
      type: addressSchema,
      default: () => ({})
    },
    departments: {
      type: [departmentSchema],
      default: []
    },
    researchAreas: {
      type: [String],
      default: []
    },
    facilities: {
      type: [String],
      default: []
    },
    lastUpdatedBy: {
      name: { type: String, default: '' },
      updatedAt: { type: Date, default: Date.now }
    },
    auditLogs: {
      type: [auditLogSchema],
      default: []
    }
  },
  {
    timestamps: true,
    collection: 'universities'
  }
);

export default universitySchema;
