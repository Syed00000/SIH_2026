import mongoose from 'mongoose';
import TokenRepository from '../domain/repository.js';
import RefreshToken from '../domain/token.js';
import MongooseRefreshToken from './model.js';

const { ObjectId } = mongoose.Types;
const inMemoryTokens = new Map();

export class MongoTokenRepository extends TokenRepository {
  _toEntity(doc) {
    if (!doc) return null;
    return new RefreshToken({
      id: doc._id ? doc._id.toString() : doc.id,
      token: doc.token,
      userId: doc.userId ? doc.userId.toString() : doc.userId,
      expiresAt: doc.expiresAt,
      revoked: doc.revoked,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date()
    });
  }

  async findByToken(token) {
    if (!token) return null;
    if (mongoose.connection.readyState === 1) {
      const doc = await MongooseRefreshToken.findOne({ token });
      return this._toEntity(doc);
    }
    const memDoc = inMemoryTokens.get(token);
    return this._toEntity(memDoc);
  }

  async save(refreshToken) {
    if (mongoose.connection.readyState === 1) {
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

    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      id,
      token: refreshToken.token,
      userId: refreshToken.userId,
      expiresAt: refreshToken.expiresAt,
      revoked: refreshToken.revoked || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryTokens.set(refreshToken.token, doc);
    return this._toEntity(doc);
  }

  async update(refreshToken) {
    if (mongoose.connection.readyState === 1) {
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

    const doc = inMemoryTokens.get(refreshToken.token);
    if (doc) {
      doc.revoked = refreshToken.revoked;
      doc.expiresAt = refreshToken.expiresAt;
      doc.updatedAt = new Date();
      inMemoryTokens.set(refreshToken.token, doc);
    }
    return this._toEntity(doc);
  }

  async deleteByToken(token) {
    if (!token) return;
    if (mongoose.connection.readyState === 1) {
      await MongooseRefreshToken.deleteOne({ token });
    }
    inMemoryTokens.delete(token);
  }

  async revokeAllForUser(userId) {
    if (mongoose.connection.readyState === 1) {
      if (!ObjectId.isValid(userId)) return;
      await MongooseRefreshToken.updateMany(
        { userId: new ObjectId(userId), revoked: false },
        { $set: { revoked: true } }
      );
    }
    for (const t of inMemoryTokens.values()) {
      if (t.userId === userId) {
        t.revoked = true;
      }
    }
  }

  async deleteAllForUser(userId) {
    if (!userId) return;
    if (mongoose.connection.readyState === 1) {
      const q = ObjectId.isValid(userId) ? { userId: new ObjectId(userId) } : { userId };
      await MongooseRefreshToken.deleteMany(q);
    }
    for (const [key, t] of inMemoryTokens.entries()) {
      if (String(t.userId) === String(userId)) {
        inMemoryTokens.delete(key);
      }
    }
  }

  async revokeTokensByUserId(userId) {
    return this.revokeAllForUser(userId);
  }

  async deleteTokensByUserId(userId) {
    return this.deleteAllForUser(userId);
  }

  async deleteTokensByUserIds(userIds) {
    if (!Array.isArray(userIds) || userIds.length === 0) return;
    if (mongoose.connection.readyState === 1) {
      const validIds = userIds.map((id) => (ObjectId.isValid(id) ? new ObjectId(id) : id));
      await MongooseRefreshToken.deleteMany({ userId: { $in: validIds } });
    }
    const idSet = new Set(userIds.map(String));
    for (const [key, t] of inMemoryTokens.entries()) {
      if (idSet.has(String(t.userId))) {
        inMemoryTokens.delete(key);
      }
    }
  }

  async purgeExpiredAndRevoked() {
    if (mongoose.connection.readyState === 1) {
      await MongooseRefreshToken.deleteMany({
        $or: [{ expiresAt: { $lt: new Date() } }, { revoked: true }]
      });
    }
  }
}

export default MongoTokenRepository;
