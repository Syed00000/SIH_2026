import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    step: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'CURRENT', 'COMPLETED', 'REJECTED'],
      default: 'PENDING'
    },
    updatedBy: { type: String, default: 'Department Admin' },
    remarks: { type: String, default: '' },
    completedAt: { type: Date, default: null }
  },
  { _id: false }
);

const citizenChallengeSchema = new mongoose.Schema(
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
      default: 'Urban Development',
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
      enum: ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Under Review',
      index: true
    },
    location: {
      district: { type: String, required: true, default: 'Ranchi', index: true },
      block: { type: String, default: '' },
      panchayatOrWard: { type: String, default: '' },
      landmark: { type: String, default: '' },
      pincode: { type: String, default: '' },
      fullAddress: { type: String, default: '' },
      coordinates: { type: String, default: '' }
    },
    submitter: {
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
    mediaUrls: [
      {
        url: { type: String },
        caption: { type: String, default: '' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    milestones: {
      type: [milestoneSchema],
      default: () => [
        {
          step: 1,
          title: 'Problem Submitted',
          description: 'Problem statement filed with location & citizen verification.',
          status: 'COMPLETED',
          updatedBy: 'Citizen Submission Portal',
          remarks: 'Citizen submission acknowledged.',
          completedAt: new Date()
        },
        {
          step: 2,
          title: 'Under Review',
          description: 'Government nodal team evaluating problem scope and severity.',
          status: 'CURRENT',
          updatedBy: 'Jharkhand State Innovation Cell',
          remarks: 'Initial screening underway.',
          completedAt: null
        },
        {
          step: 3,
          title: 'University / HEI Assigned',
          description: 'Assigned to relevant university research lab & mentor.',
          status: 'PENDING',
          updatedBy: 'Department of Higher & Technical Education',
          remarks: '',
          completedAt: null
        },
        {
          step: 4,
          title: 'Solution in Progress',
          description: 'Faculty mentor and student innovation team implementing pilot.',
          status: 'PENDING',
          updatedBy: 'University Faculty Lead',
          remarks: '',
          completedAt: null
        },
        {
          step: 5,
          title: 'Resolved & Deployed',
          description: 'Action completed and verified on ground with citizen feedback.',
          status: 'PENDING',
          updatedBy: 'District Administration',
          remarks: '',
          completedAt: null
        }
      ]
    },
    assignedUniversity: {
      id: { type: String, default: '' },
      name: { type: String, default: '' },
      department: { type: String, default: '' },
      mentorName: { type: String, default: '' },
      assignedAt: { type: Date, default: null }
    },
    impactMetrics: {
      affectedPopulation: { type: String, default: '~ 5,000 People' },
      estimatedBudget: { type: String, default: 'Under Assessment' }
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

export const CitizenChallenge =
  mongoose.models.CitizenChallenge || mongoose.model('CitizenChallenge', citizenChallengeSchema);
export default CitizenChallenge;
