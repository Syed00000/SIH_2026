import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: false
    },
    thumbnailUrl: {
      type: String,
      required: false
    },
    mediaType: {
      type: String,
      enum: ['IMAGE', 'VIDEO', 'SOCIAL_POST', 'EVENT', 'ARTICLE', 'ANNOUNCEMENT'],
      default: 'IMAGE'
    },
    category: {
      type: String,
      required: true,
      default: 'General'
    },
    platform: {
      type: String,
      enum: ['DTE', 'Government', 'LinkedIn', 'Instagram', 'Twitter', 'Facebook', 'YouTube', 'Website'],
      required: true,
      default: 'Website'
    },
    source: {
      type: String,
      required: true
    },
    sourceUrl: {
      type: String,
      required: true
    },
    externalId: {
      type: String,
      unique: true,
      sparse: true, // Only auto-synced ones might have externalId, manual ones might not
      index: true
    },
    publishedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isAutoFetched: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for isNew based on publishedDate
updateSchema.virtual('isNew').get(function () {
  const thresholdDays = 3;
  const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000;
  return Date.now() - new Date(this.publishedDate).getTime() < thresholdMs;
});

export const Update = mongoose.model('Update', updateSchema);
