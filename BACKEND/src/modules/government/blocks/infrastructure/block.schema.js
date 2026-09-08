import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema(
  {
    blockId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    bdoName: {
      type: String,
      default: '',
      trim: true
    },
    bdoEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true
    },
    bdoPhone: {
      type: String,
      default: '',
      trim: true
    },
    headquarters: {
      type: String,
      default: '',
      trim: true
    },
    panchayats: {
      type: [String],
      default: []
    },
    departments: {
      type: [String],
      default: [
        'Drinking Water & Sanitation',
        'Roads & Rural Works',
        'Electricity & Power',
        'Sanitation & Solid Waste',
        'Public Health & Anganwadi'
      ]
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
        default: 'Block@2026'
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
    collection: 'district_blocks'
  }
);

blockSchema.set('toJSON', {
  transform: (_, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  }
});

export const Block = mongoose.models.Block || mongoose.model('Block', blockSchema);
export default Block;
