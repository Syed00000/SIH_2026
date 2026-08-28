import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'University/Institution name is required'],
      trim: true,
      unique: true,
      index: true
    },
    shortName: {
      type: String,
      trim: true,
      default: ''
    },
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
    establishmentYear: {
      type: Number,
      default: 2000
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
      index: true
    },
    quickSummary: {
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
    focusAreas: {
      type: [String],
      default: ['Water Management', 'Infrastructure', 'Education', 'Public Health']
    },
    accreditation: {
      naacGrade: {
        type: String,
        enum: ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'NA', 'Non-Accredited'],
        default: 'A'
      },
      validity: {
        type: String,
        default: '2028-12-31'
      },
      nirfRanking: {
        type: Number,
        default: null
      }
    },
    nodalOfficer: {
      name: {
        type: String,
        required: [true, 'Nodal Officer Name is required'],
        trim: true
      },
      designation: {
        type: String,
        default: 'Registrar',
        trim: true
      },
      email: {
        type: String,
        required: [true, 'Nodal Officer Email is required'],
        lowercase: true,
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Nodal Officer Phone is required'],
        trim: true
      }
    },
    universityEmail: {
      type: String,
      required: [true, 'University Email is required'],
      lowercase: true,
      trim: true
    },
    universityPhone: {
      type: String,
      trim: true,
      default: ''
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
    aisheCode: {
      type: String,
      trim: true,
      default: ''
    },
    tagline: {
      type: String,
      trim: true,
      default: ''
    },
    about: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      campus: { type: String, default: '' },
      district: { type: String, default: '' },
      state: { type: String, default: 'Jharkhand' },
      pincode: { type: String, default: '' }
    },
    departments: [
      {
        name: { type: String, required: true },
        facultyCount: { type: Number, default: 0 }
      }
    ],
    researchAreas: {
      type: [String],
      default: []
    },
    facilities: {
      type: [String],
      default: []
    },
    lastUpdatedBy: {
      name: { type: String, default: 'Dr. Ankit Verma' },
      updatedAt: { type: Date, default: Date.now }
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
    collection: 'universities'
  }
);

export const MongooseUniversity =
  mongoose.models.University || mongoose.model('University', universitySchema, 'universities');

export default MongooseUniversity;
