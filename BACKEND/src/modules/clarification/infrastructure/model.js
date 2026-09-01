import mongoose from 'mongoose';

const clarificationMessageSchema = new mongoose.Schema(
  {
    challengeId: {
      type: String,
      required: true,
      index: true
    },
    senderId: {
      type: String,
      default: ''
    },
    senderName: {
      type: String,
      required: true
    },
    senderRole: {
      type: String,
      enum: ['UNIVERSITY', 'NODAL', 'ADMIN', 'SYSTEM'],
      required: true
    },
    senderDesignation: {
      type: String,
      default: ''
    },
    universityCode: {
      type: String,
      default: ''
    },
    universityName: {
      type: String,
      default: ''
    },
    nodalName: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    messageType: {
      type: String,
      enum: ['TEXT', 'SYSTEM', 'QUERY', 'RESOLUTION', 'ACTION_ACCEPT', 'ACTION_DECLINE'],
      default: 'TEXT'
    },
    attachments: [
      {
        name: String,
        url: String,
        fileType: String,
        size: Number
      }
    ],
    isReadByNodal: {
      type: Boolean,
      default: false
    },
    isReadByUniversity: {
      type: Boolean,
      default: false
    },
    seenAt: {
      type: Date,
      default: null
    },
    deletedByRoles: {
      type: [String],
      default: []
    },
    replyTo: {
      messageId: { type: String, default: null },
      senderName: { type: String, default: '' },
      senderRole: { type: String, default: '' },
      message: { type: String, default: '' }
    },
    isDeletedForEveryone: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast lookup per challenge and unread queries
clarificationMessageSchema.index({ challengeId: 1, createdAt: 1 });
clarificationMessageSchema.index({ universityCode: 1, isReadByUniversity: 1 });
clarificationMessageSchema.index({ isReadByNodal: 1 });

export const ClarificationMessage = mongoose.model(
  'ClarificationMessage',
  clarificationMessageSchema,
  'clarification_messages'
);

export default ClarificationMessage;
