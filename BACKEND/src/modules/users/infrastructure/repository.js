import mongoose from 'mongoose';
import UserRepository from '../domain/repository.js';
import User from '../domain/user.js';
import MongooseUser from './model.js';

const { ObjectId } = mongoose.Types;

export class MongoUserRepository extends UserRepository {
  _toEntity(doc) {
    if (!doc) return null;
    return new User({
      id: doc._id.toString(),
      email: doc.email,
      passwordHash: doc.passwordHash,
      firstName: doc.firstName,
      lastName: doc.lastName,
      role: doc.role,
      isEmailVerified: doc.isEmailVerified,
      passwordResetToken: doc.passwordResetToken,
      passwordResetExpires: doc.passwordResetExpires,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }

  async findById(id) {
    if (!ObjectId.isValid(id)) return null;
    const doc = await MongooseUser.findById(id);
    return this._toEntity(doc);
  }

  async findByEmail(email) {
    if (!email) return null;
    const doc = await MongooseUser.findOne({ email: email.toLowerCase() });
    return this._toEntity(doc);
  }

  async save(user) {
    const doc = new MongooseUser({
      email: user.email.toLowerCase(),
      passwordHash: user.passwordHash,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      passwordResetToken: user.passwordResetToken,
      passwordResetExpires: user.passwordResetExpires
    });

    await doc.save();
    user.id = doc._id.toString();
    user.createdAt = doc.createdAt;
    user.updatedAt = doc.updatedAt;
    return user;
  }

  async update(id, data) {
    if (!ObjectId.isValid(id)) {
      throw new Error('Invalid database ID for update');
    }

    const doc = await MongooseUser.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    return this._toEntity(doc);
  }
}

export default MongoUserRepository;
