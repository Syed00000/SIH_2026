import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      index: true,
      validate: {
        validator: function (v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: props => `${props.value} is not a valid 10-digit Indian mobile number!`
      }
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false
    },
    role: {
      type: String,
      enum: {
        values: ['CITIZEN', 'UNIVERSITY', 'INDUSTRY', 'GOVERNMENT', 'ADMIN', 'NODAL', 'FACULTY'],
        message: '{VALUE} is not a valid role'
      },
      default: 'CITIZEN',
      required: true,
      index: true
    },
    profile: {
      // Embedded role-specific profile data
      preferredLanguage: { type: String, default: 'HINDI' },
      location: {
        districtId: { type: mongoose.Schema.Types.ObjectId, default: null },
        blockOrULBId: { type: mongoose.Schema.Types.ObjectId, default: null },
        panchayatOrWardId: { type: mongoose.Schema.Types.ObjectId, default: null }
      },
      institutionName: { type: String, default: null, trim: true },
      aisheCode: { type: String, default: null, trim: true },
      registrationNumber: { type: String, default: null, trim: true },
      institutionType: { type: String, default: null },
      nodalOfficerDesignation: { type: String, default: null, trim: true },
      district: { type: String, default: null, trim: true },
      academicFocusDomains: { type: [String], default: [] },
      organizationName: { type: String, default: null, trim: true },
      entityType: { type: String, default: null },
      cin: { type: String, default: null, trim: true },
      gstin: { type: String, default: null, trim: true },
      ngoDarpanId: { type: String, default: null, trim: true },
      primaryContactDesignation: { type: String, default: null, trim: true },
      supportSectors: { type: [String], default: [] }
    },
    emailVerification: {
      verified: { type: Boolean, default: false },
      verifiedAt: { type: Date, default: null }
    },
    emailVerificationCode: {
      type: String,
      default: null
    },
    emailVerificationExpires: {
      type: Date,
      default: null
    },
    passwordResetOTP: {
      type: String,
      default: null
    },
    passwordResetExpires: {
      type: Date,
      default: null
    },
    accountStatus: {
      type: String,
      enum: {
        values: ['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'BLOCKED'],
        message: '{VALUE} is not a valid account status'
      },
      default: 'PENDING_VERIFICATION',
      index: true
    },
    lastLoginAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  }
});

export const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);
export default MongooseUser;
