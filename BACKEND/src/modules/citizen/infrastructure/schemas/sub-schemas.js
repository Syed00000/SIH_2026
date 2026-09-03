import mongoose from 'mongoose';

export const locationSchema = new mongoose.Schema(
  {
    district: { type: String, required: true, default: '', index: true },
    block: { type: String, default: '' },
    panchayatOrWard: { type: String, default: '' },
    landmark: { type: String, default: '' },
    pincode: { type: String, default: '' },
    fullAddress: { type: String, default: '' },
    coordinates: { type: String, default: '' }
  },
  { _id: false }
);

export const submitterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    role: {
      type: String,
      enum: ['Citizen', 'Student / Youth', 'Farmer', 'Social Worker', 'NGO Representative', 'Local Resident', 'Other'],
      default: 'Citizen'
    },
    designation: { type: String, default: '' },
    organization: { type: String, default: '' }
  },
  { _id: false }
);

export const mediaSchema = new mongoose.Schema(
  {
    mediaId: { type: String, default: '' },
    url: { type: String, default: '' },
    caption: { type: String, default: '' },
    fileName: { type: String, default: '' },
    fileType: { type: String, default: 'image' },
    fileSize: { type: Number, default: 0 },
    mimeType: { type: String, default: '' },
    providerPublicId: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

export const assignedUniversitySchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    department: { type: String, default: '' },
    mentorName: { type: String, default: '' },
    assignedAt: { type: Date, default: null },
    acceptanceStatus: {
      type: String,
      enum: ['Pending Review', 'Accepted', 'Declined', 'Not Assigned', 'Clarification Requested', 'Clarified'],
      default: 'Pending Review'
    },
    declineReason: { type: String, default: '' }
  },
  { _id: false }
);

export const allocatedBySchema = new mongoose.Schema(
  {
    id: { type: String, default: '' },
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    designation: { type: String, default: '' },
    department: { type: String, default: '' },
    allocatedAt: { type: Date, default: null }
  },
  { _id: false }
);

export const impactMetricsSchema = new mongoose.Schema(
  {
    affectedPopulation: { type: String, default: '' },
    estimatedBudget: { type: String, default: '' }
  },
  { _id: false }
);
