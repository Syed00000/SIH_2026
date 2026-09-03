import mongoose from 'mongoose';
import { milestoneSchema } from './milestone.schema.js';
import { getDefaultMilestones } from './default-milestones.js';
import {
  locationSchema,
  submitterSchema,
  mediaSchema,
  assignedUniversitySchema,
  allocatedBySchema,
  impactMetricsSchema
} from './sub-schemas.js';

export const citizenChallengeSchema = new mongoose.Schema(
  {
    challengeId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Challenge title / heading is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Detailed problem statement is required'],
      trim: true
    },
    domain: {
      type: String,
      required: [true, 'Category / challenge area is required'],
      enum: [
        'Education',
        'Healthcare',
        'Agriculture',
        'Water Resources',
        'Environment',
        'Energy',
        'Urban Development',
        'Accessibility',
        'Public Administration',
        'Rural Livelihoods',
        'Other'
      ],
      index: true
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
      index: true
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'In Progress',
        'Resolved',
        'Rejected',
        'Clarification Requested',
        'Clarified',
        'Accepted',
        'Declined',
        'Withdrawn'
      ],
      default: 'Under Review',
      index: true
    },
    district: {
      type: String,
      trim: true,
      index: true
    },
    location: {
      type: locationSchema,
      default: () => ({})
    },
    assignedNodalOfficer: {
      id: { type: String, default: '' },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      district: { type: String, default: '' },
      department: { type: String, default: '' }
    },
    submitter: {
      type: submitterSchema,
      required: true
    },
    media: {
      type: [mediaSchema],
      default: () => []
    },
    mediaUrls: {
      type: [String],
      default: () => []
    },

    milestones: {
      type: [milestoneSchema],
      default: getDefaultMilestones
    },
    assignedUniversity: {
      type: assignedUniversitySchema,
      default: () => ({})
    },
    allocatedBy: {
      type: allocatedBySchema,
      default: null
    },
    acceptanceStatus: {
      type: String,
      enum: ['Pending Review', 'Accepted', 'Declined', 'Not Assigned', 'Clarification Requested', 'Clarified'],
      default: 'Not Assigned',
      index: true
    },
    clarificationQuery: { type: String, default: '' },
    clarificationResponse: { type: String, default: '' },
    clarificationDate: { type: Date, default: null },
    clarificationStatus: {
      type: String,
      enum: ['NONE', 'PENDING', 'RESOLVED'],
      default: 'NONE'
    },
    impactMetrics: {
      type: impactMetricsSchema,
      default: () => ({})
    },
    submittedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    collection: 'citizen_challenges'
  }
);

citizenChallengeSchema.index({ 'assignedUniversity.id': 1, status: 1 });
citizenChallengeSchema.index({ 'assignedUniversity.id': 1, acceptanceStatus: 1 });

export default citizenChallengeSchema;
