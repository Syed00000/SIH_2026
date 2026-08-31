import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import UserRepository from '../domain/repository.js';
import User from '../domain/user.js';
import MongooseUser from './model.js';

const { ObjectId } = mongoose.Types;
const inMemoryUsers = new Map();

export class MongoUserRepository extends UserRepository {
  _toEntity(doc) {
    if (!doc) return null;
    return new User({
      id: doc._id ? doc._id.toString() : doc.id,
      fullName: doc.fullName,
      mobileNumber: doc.mobileNumber,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      profile: doc.profile || {},
      accountStatus: doc.accountStatus || 'PENDING_VERIFICATION',
      emailVerification: doc.emailVerification || { verified: false, verifiedAt: null },
      emailVerificationCode: doc.emailVerificationCode || null,
      emailVerificationExpires: doc.emailVerificationExpires || null,
      passwordResetOTP: doc.passwordResetOTP || null,
      passwordResetExpires: doc.passwordResetExpires || null,
      lastLoginAt: doc.lastLoginAt || null,
      createdAt: doc.createdAt || new Date(),
      updatedAt: doc.updatedAt || new Date()
    });
  }

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      if (!ObjectId.isValid(id)) return null;
      const doc = await MongooseUser.findById(id).select('+passwordHash');
      return this._toEntity(doc);
    }
    const memDoc = inMemoryUsers.get(id);
    return this._toEntity(memDoc);
  }

  async findByEmail(email) {
    if (!email) return null;
    const lower = email.toLowerCase().trim();
    if (mongoose.connection.readyState === 1) {
      const doc = await MongooseUser.findOne({ email: lower }).select('+passwordHash');
      return this._toEntity(doc);
    }
    for (const u of inMemoryUsers.values()) {
      if (u.email && u.email.toLowerCase() === lower) {
        return this._toEntity(u);
      }
    }
    return null;
  }

  async findByMobile(mobileNumber) {
    if (!mobileNumber) return null;
    const mobile = mobileNumber.trim();
    if (mongoose.connection.readyState === 1) {
      const doc = await MongooseUser.findOne({ mobileNumber: mobile }).select('+passwordHash');
      return this._toEntity(doc);
    }
    for (const u of inMemoryUsers.values()) {
      if (u.mobileNumber && u.mobileNumber.trim() === mobile) {
        return this._toEntity(u);
      }
    }
    return null;
  }

  async findByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = identifier.trim();
    const lower = clean.toLowerCase();

    if (mongoose.connection.readyState === 1) {
      // 1. Direct email match
      let doc = await MongooseUser.findOne({ email: lower }).select('+passwordHash');
      if (doc) return this._toEntity(doc);

      // 2. Mobile match
      doc = await MongooseUser.findOne({ mobileNumber: clean }).select('+passwordHash');
      if (doc) return this._toEntity(doc);

      // 3. AISHE / Code match in profile
      doc = await MongooseUser.findOne({
        $or: [
          { 'profile.aisheCode': { $regex: new RegExp(`^${clean}$`, 'i') } },
          { 'profile.code': { $regex: new RegExp(`^${clean}$`, 'i') } }
        ]
      }).select('+passwordHash');
      if (doc) return this._toEntity(doc);

      // 4. University entity lookup
      try {
        const MongooseUniversity = (await import('../../government/heis/infrastructure/model.js')).default;
        const uni = await MongooseUniversity.findOne({
          $or: [
            { code: { $regex: new RegExp(`^${clean}$`, 'i') } },
            { aisheCode: { $regex: new RegExp(`^${clean}$`, 'i') } },
            { universityEmail: lower },
            { 'nodalOfficer.email': lower }
          ]
        });
        if (uni) {
          const targetEmail = (uni.nodalOfficer?.email || uni.universityEmail)?.toLowerCase();
          if (targetEmail) {
            doc = await MongooseUser.findOne({ email: targetEmail }).select('+passwordHash');
            if (doc) return this._toEntity(doc);
          }
        }
      } catch (uniErr) {
        // Continue fallback
      }

      // 5. University Faculty lookup & account reconciliation
      try {
        const { UniversityFaculty } = await import('../../university/infrastructure/model.js');
        const fac = await UniversityFaculty.findOne({
          $or: [
            { email: lower },
            { email: clean },
            { name: new RegExp(`^${clean}$`, 'i') },
            { phone: clean }
          ]
        });
        if (fac) {
          doc = await MongooseUser.findOne({ email: fac.email.toLowerCase() }).select('+passwordHash');
          if (!doc) {
            const newPasswordHash = fac.passwordHash || (await bcrypt.hash('Faculty@123456', 12));
            doc = await MongooseUser.create({
              fullName: fac.name,
              email: fac.email.toLowerCase(),
              mobileNumber: fac.phone?.replace(/[^0-9]/g, '').slice(-10) || `98${Math.floor(10000000 + Math.random() * 90000000)}`,
              passwordHash: newPasswordHash,
              role: 'FACULTY',
              accountStatus: 'ACTIVE',
              emailVerification: { verified: true, verifiedAt: new Date() },
              profile: {
                universityCode: fac.universityCode,
                department: fac.department,
                designation: fac.designation
              }
            });
            await UniversityFaculty.findByIdAndUpdate(fac._id, {
              $set: { userId: doc._id, passwordHash: newPasswordHash }
            });
          }
          if (doc) return this._toEntity(doc);
        }
      } catch (facErr) {
        // Continue
      }
    }

    return this.findByEmail(lower);
  }

  async save(user) {
    const normalizedEmail = user.email ? user.email.toLowerCase() : null;
    if (mongoose.connection.readyState === 1) {
      const doc = new MongooseUser({
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        email: normalizedEmail,
        passwordHash: user.passwordHash,
        role: user.role || 'CITIZEN',
        profile: user.profile || {},
        accountStatus: user.accountStatus || 'PENDING_VERIFICATION',
        emailVerification: user.emailVerification || { verified: false, verifiedAt: null },
        emailVerificationCode: user.emailVerificationCode || null,
        emailVerificationExpires: user.emailVerificationExpires || null,
        passwordResetOTP: user.passwordResetOTP || null,
        passwordResetExpires: user.passwordResetExpires || null,
        lastLoginAt: user.lastLoginAt || null
      });

      await doc.save();
      user.id = doc._id.toString();
      user.createdAt = doc.createdAt;
      user.updatedAt = doc.updatedAt;
      return user;
    }

    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      id,
      fullName: user.fullName,
      mobileNumber: user.mobileNumber,
      email: normalizedEmail,
      passwordHash: user.passwordHash,
      role: user.role || 'CITIZEN',
      profile: user.profile || {},
      accountStatus: user.accountStatus || 'PENDING_VERIFICATION',
      emailVerification: user.emailVerification || { verified: false, verifiedAt: null },
      emailVerificationCode: user.emailVerificationCode || null,
      emailVerificationExpires: user.emailVerificationExpires || null,
      passwordResetOTP: user.passwordResetOTP || null,
      passwordResetExpires: user.passwordResetExpires || null,
      lastLoginAt: user.lastLoginAt || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryUsers.set(id, doc);
    return this._toEntity(doc);
  }

  async update(id, data) {
    if (mongoose.connection.readyState === 1) {
      if (!ObjectId.isValid(id)) {
        throw new Error('Invalid database ID for update');
      }

      const doc = await MongooseUser.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      ).select('+passwordHash');

      return this._toEntity(doc);
    }

    const doc = inMemoryUsers.get(id);
    if (doc) {
      Object.assign(doc, data);
      doc.updatedAt = new Date();
      inMemoryUsers.set(id, doc);
    }
    return this._toEntity(doc);
  }
}

export default MongoUserRepository;
