import mongoose from 'mongoose';

const wardSchema = new mongoose.Schema(
  {
    wardId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    wardNumber: {
      type: Number,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    district: {
      type: String,
      required: true,
      default: 'Ranchi',
      trim: true,
      index: true
    },
    blockId: {
      type: String,
      default: '',
      trim: true,
      index: true
    },
    blockName: {
      type: String,
      default: '',
      trim: true
    },
    councillorName: {
      type: String,
      default: '',
      trim: true
    },
    councillorEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true
    },
    councillorPhone: {
      type: String,
      default: '',
      trim: true
    },
    officeAddress: {
      type: String,
      default: '',
      trim: true
    },
    population: {
      type: Number,
      default: 0
    },
    localities: {
      type: [String],
      default: []
    },
    assignedBlocks: {
      type: [String],
      default: []
    },
    credentials: {
      loginId: {
        type: String,
        trim: true,
        default: ''
      },
      loginEmail: {
        type: String,
        trim: true,
        lowercase: true,
        default: ''
      },
      password: {
        type: String,
        trim: true,
        default: 'Ward@2026'
      }
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Archived'],
      default: 'Active',
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'district_wards'
  }
);

wardSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const Ward = mongoose.models.Ward || mongoose.model('Ward', wardSchema);
export default Ward;
