import mongoose from 'mongoose';
import TokenRepository from '../domain/repository.js';
import RefreshToken from '../domain/token.js';
import MongooseRefreshToken from './model.js';

const { ObjectId } = mongoose.Types;

export class MongoTokenRepository extends TokenRepository {
  _toEntity(doc) {
    if (!doc) return null;
    return new RefreshToken({
      id: doc._id.toString(),
      token: doc.token,
      userId: doc.userId.toString(),
      expiresAt: doc.expiresAt,
      revoked: doc.revoked,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  async findByToken(token) {
    if (!token) return null;
    const doc = await MongooseRefreshToken.findOne({ token });
    return this._toEntity(doc);
  }

  async save(refreshToken) {
    const doc = new MongooseRefreshToken({
      token: refreshToken.token,
      userId: new ObjectId(refreshToken.userId),
      expiresAt: refreshToken.expiresAt,
      revoked: refreshToken.revoked
    });

    await doc.save();
    refreshToken.id = doc._id.toString();
    refreshToken.createdAt = doc.createdAt;
    refreshToken.updatedAt = doc.updatedAt;
    return refreshToken;
  }

  async update(refreshToken) {
    if (!refreshToken.id || !ObjectId.isValid(refreshToken.id)) {
      throw new Error('Invalid token ID for update');
    }

    const doc = await MongooseRefreshToken.findByIdAndUpdate(
      refreshToken.id,
      {
        $set: {
          revoked: refreshToken.revoked,
          expiresAt: refreshToken.expiresAt
        }
      },
      { new: true }
    );

    return this._toEntity(doc);
  }

  async deleteByToken(token) {
    if (!token) return;
    await MongooseRefreshToken.deleteOne({ token });
  }

  async revokeAllForUser(userId) {
    if (!ObjectId.isValid(userId)) return;
    await MongooseRefreshToken.updateMany(
      { userId: new ObjectId(userId), revoked: false },
      { $set: { revoked: true } }
    );
  }
}

export default MongoTokenRepository;
