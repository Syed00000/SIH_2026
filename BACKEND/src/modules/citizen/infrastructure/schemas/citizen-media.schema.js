import mongoose from 'mongoose';

export const citizenMediaSchema = new mongoose.Schema(
  {
    mediaId: {
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
    challengeId: {
      type: String,
      default: null,
      index: true
    },
    storageProvider: {
      type: String,
      default: 'cloudinary',
      index: true
    },
    storageKey: {
      type: String,
      required: true
    },
    providerPublicId: {
      type: String,
      required: true,
      index: true
    },
    resourceType: {
      type: String,
      enum: ['image', 'video', 'raw'],
      default: 'image'
    },
    originalFileName: {
      type: String,
      required: true,
      trim: true
    },
    mimeType: {
      type: String,
      required: true,
      trim: true
    },
    fileType: {
      type: String,
      enum: ['image', 'video', 'pdf', 'document', 'other'],
      required: true,
      index: true
    },
    fileSize: {
      type: Number,
      required: true
    },
    caption: {
      type: String,
      default: '',
      trim: true
    },
    isPrivate: {
      type: Boolean,
      default: true
    },
    uploadedBy: {
      id: { type: String, default: '' },
      name: { type: String, default: '' },
      role: { type: String, default: 'Citizen' }
    }
  },
  {
    timestamps: true,
    collection: 'citizen_media'
  }
);

citizenMediaSchema.index({ challengeId: 1, createdAt: -1 });
citizenMediaSchema.index({ citizenId: 1, createdAt: -1 });

export default citizenMediaSchema;
