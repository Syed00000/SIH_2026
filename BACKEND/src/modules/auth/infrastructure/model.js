import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    revoked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const MongooseRefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default MongooseRefreshToken;
