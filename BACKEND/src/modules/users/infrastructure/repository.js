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

      // 4. University entity lookup & auto-reconciliation
      try {
        const MongooseUniversity = (await import('../../government/heis/infrastructure/model.js')).default;
        const uni = await MongooseUniversity.findOne({
          $or: [
            { code: { $regex: new RegExp(`^${clean}$`, 'i') } },
            { aisheCode: { $regex: new RegExp(`^${clean}$`, 'i') } },
            { universityEmail: lower },
            { 'nodalOfficer.email': lower },
            { 'credentials.loginEmail': lower }
          ]
        });
        if (uni) {
          const targetEmail = (uni.credentials?.loginEmail || uni.nodalOfficer?.email || uni.universityEmail)?.toLowerCase().trim();
          if (targetEmail) {
            let targetHash = uni.credentials?.passwordHash;
            if (!targetHash && uni.credentials?.generatedPassword) {
              targetHash = await bcrypt.hash(uni.credentials.generatedPassword, 10);
              await MongooseUniversity.findByIdAndUpdate(uni._id, { 'credentials.passwordHash': targetHash });
            }

            if (uni.userId) {
              doc = await MongooseUser.findById(uni.userId).select('+passwordHash');
            }
            if (!doc) {
              doc = await MongooseUser.findOne({ email: targetEmail }).select('+passwordHash');
            }

            if (!doc) {
              let mobile = (uni.nodalOfficer?.phone || uni.universityPhone || '').replace(/\D/g, '').slice(-10);
              if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
                mobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
              }
              const existingMobile = await MongooseUser.findOne({ mobileNumber: mobile });
              if (existingMobile) {
                mobile = `96${Date.now().toString().slice(-8)}`;
              }

              doc = await MongooseUser.create({
                fullName: uni.nodalOfficer?.name || uni.name,
                email: targetEmail,
                mobileNumber: mobile,
                passwordHash: targetHash || (await bcrypt.hash('HEI@Jharkhand2026!', 10)),
                role: 'UNIVERSITY',
                accountStatus: 'ACTIVE',
                emailVerification: { verified: true, verifiedAt: new Date() },
                profile: {
                  institutionName: uni.name,
                  aisheCode: uni.code,
                  institutionType: uni.universityType || 'State University'
                }
              });
              await MongooseUniversity.findByIdAndUpdate(uni._id, { userId: doc._id });
            } else {
              let changed = false;
              if (doc.email !== targetEmail) { doc.email = targetEmail; changed = true; }
              if (targetHash && doc.passwordHash !== targetHash) { doc.passwordHash = targetHash; changed = true; }
              if (doc.role !== 'UNIVERSITY') { doc.role = 'UNIVERSITY'; changed = true; }
              if (doc.accountStatus !== 'ACTIVE') { doc.accountStatus = 'ACTIVE'; changed = true; }
              if (!doc.emailVerification?.verified) { doc.emailVerification = { verified: true, verifiedAt: new Date() }; changed = true; }
              if (changed) await doc.save();
            }
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

      // 6. Government Admin & Nodal Officer lookup & auto-reconciliation
      try {
        const MongooseAdmin = (await import('../../government/admins/infrastructure/model.js')).default;
        const adminDoc = await MongooseAdmin.findOne({
          $or: [
            { username: lower },
            { email: lower },
            { mobileNumber: clean }
          ]
        }).select('+passwordHash');

        if (adminDoc) {
          const authRole = (adminDoc.role || '').toLowerCase().includes('nodal') ? 'NODAL' : 'GOVERNMENT';
          let adminUser = await MongooseUser.findOne({ email: adminDoc.email.toLowerCase().trim() }).select('+passwordHash');

          let targetHash = adminDoc.passwordHash;
          if (!targetHash && adminDoc.password) {
            targetHash = await bcrypt.hash(adminDoc.password, 10);
            adminDoc.passwordHash = targetHash;
            await adminDoc.save().catch(() => {});
          }

          if (!adminUser) {
            let cleanMobile = (adminDoc.mobileNumber || '').replace(/[^0-9]/g, '').slice(-10);
            if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
              cleanMobile = '98' + Math.floor(10000000 + Math.random() * 90000000);
            }
            const existingMob = await MongooseUser.findOne({ mobileNumber: cleanMobile });
            if (existingMob) {
              cleanMobile = '99' + Math.floor(10000000 + Math.random() * 90000000);
            }

            adminUser = await MongooseUser.create({
              fullName: adminDoc.fullName,
              email: adminDoc.email.toLowerCase().trim(),
              mobileNumber: cleanMobile,
              passwordHash: targetHash || (process.env.DEFAULT_NODAL_PASSWORD ? await bcrypt.hash(process.env.DEFAULT_NODAL_PASSWORD, 10) : ''),
              role: authRole,
              accountStatus: adminDoc.status === 'Active' ? 'ACTIVE' : 'SUSPENDED',
              emailVerification: { verified: true, verifiedAt: new Date() },
              profile: {
                institutionName: adminDoc.assignedDepartment || 'Higher & Technical Education',
                nodalOfficerDesignation: adminDoc.role,
                district: adminDoc.district || '',
                preferredLanguage: 'HINDI'
              }
            });
          } else if (targetHash && adminUser.passwordHash !== targetHash) {
            adminUser.passwordHash = targetHash;
            adminUser.role = authRole;
            adminUser.accountStatus = 'ACTIVE';
            adminUser.emailVerification = { verified: true, verifiedAt: new Date() };
            await adminUser.save();
          }

          if (adminUser) return this._toEntity(adminUser);
        }
      } catch (adminErr) {
        // Continue fallback
      }

      // 7. Industry Organization lookup & auto-reconciliation
      try {
        const Industry = (await import('../../government/industries/infrastructure/model.js')).default;
        const ind = await Industry.findOne({
          $or: [
            { industryId: { $regex: new RegExp(`^${clean}$`, 'i') } },
            { officialEmail: lower },
            { 'credentials.loginEmail': lower },
            { mobileNumber: clean }
          ]
        });
        if (ind) {
          const targetEmail = (ind.credentials?.loginEmail || ind.officialEmail)?.toLowerCase().trim();
          if (targetEmail) {
            let targetHash = ind.credentials?.passwordHash;
            if (!targetHash && ind.credentials?.generatedPassword) {
              targetHash = await bcrypt.hash(ind.credentials.generatedPassword, 10);
              await Industry.findByIdAndUpdate(ind._id, { 'credentials.passwordHash': targetHash });
            }

            let indUser = null;
            if (ind.userId) {
              indUser = await MongooseUser.findById(ind.userId).select('+passwordHash');
            }
            if (!indUser) {
              indUser = await MongooseUser.findOne({ email: targetEmail }).select('+passwordHash');
            }

            if (!indUser) {
              let cleanMob = (ind.mobileNumber || '').replace(/\D/g, '').slice(-10);
              if (!cleanMob || !/^[6-9]\d{9}$/.test(cleanMob)) {
                cleanMob = `98${Math.floor(10000000 + Math.random() * 90000000)}`;
              }
              const existingMobile = await MongooseUser.findOne({ mobileNumber: cleanMob });
              if (existingMobile) {
                cleanMob = `97${Date.now().toString().slice(-8)}`;
              }

              indUser = await MongooseUser.create({
                fullName: ind.spocName || ind.legalName,
                email: targetEmail,
                mobileNumber: cleanMob,
                passwordHash: targetHash || (await bcrypt.hash('Industry@123456', 10)),
                role: 'INDUSTRY',
                accountStatus: ind.status === 'Active' ? 'ACTIVE' : 'SUSPENDED',
                emailVerification: { verified: true, verifiedAt: new Date() },
                profile: {
                  organizationName: ind.legalName,
                  entityType: ind.category
                }
              });
              await Industry.findByIdAndUpdate(ind._id, { userId: indUser._id });
            } else {
              let changed = false;
              if (indUser.email !== targetEmail) { indUser.email = targetEmail; changed = true; }
              if (targetHash && indUser.passwordHash !== targetHash) { indUser.passwordHash = targetHash; changed = true; }
              if (indUser.role !== 'INDUSTRY') { indUser.role = 'INDUSTRY'; changed = true; }
              if (indUser.accountStatus !== 'ACTIVE') { indUser.accountStatus = 'ACTIVE'; changed = true; }
              if (!indUser.emailVerification?.verified) { indUser.emailVerification = { verified: true, verifiedAt: new Date() }; changed = true; }
              if (changed) await indUser.save();
            }

            if (indUser) return this._toEntity(indUser);
          }
        }
      } catch (indErr) {
        // Continue fallback
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
