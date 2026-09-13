import bcrypt from 'bcryptjs';
import MongooseUser from '../../../../users/infrastructure/model.js';
import MongooseRefreshToken from '../../../../auth/infrastructure/model.js';
import logger from '../../../../../shared/logger/index.js';

export async function revokeIndustrySessions(userId, organizationName) {
  if (!userId) return;
  await MongooseRefreshToken.updateMany(
    { userId },
    { $set: { revoked: true } }
  );
  logger.info(`🔒 Revoked active sessions for disabled industry: ${organizationName}`);
}

export async function syncIndustryUserUpdate(userId, updateData, existingIndustry = null, passwordHash = null) {
  const targetEmail = (
    updateData.loginEmail ||
    updateData.credentials?.loginEmail ||
    existingIndustry?.credentials?.loginEmail ||
    existingIndustry?.officialEmail
  )?.toLowerCase().trim();

  let user = userId ? await MongooseUser.findById(userId) : null;
  if (!user && targetEmail) {
    user = await MongooseUser.findOne({ email: targetEmail });
  }

  const userUpdate = {};
  if (updateData.spocName) userUpdate.fullName = updateData.spocName.trim();
  if (updateData.legalName) userUpdate['profile.organizationName'] = updateData.legalName.trim();
  if (updateData.category) userUpdate['profile.entityType'] = updateData.category;
  if (updateData.registrationNumber) userUpdate['profile.cin'] = updateData.registrationNumber.trim();
  if (updateData.designation) userUpdate['profile.primaryContactDesignation'] = updateData.designation.trim();

  if (passwordHash) {
    userUpdate.passwordHash = passwordHash;
    userUpdate.accountStatus = 'ACTIVE';
    userUpdate.emailVerification = { verified: true, verifiedAt: new Date() };
  }

  if (user) {
    if (Object.keys(userUpdate).length > 0) {
      await MongooseUser.findByIdAndUpdate(user._id, { $set: userUpdate });
    }
  } else if (targetEmail && passwordHash) {
    const mobile = (updateData.mobileNumber || existingIndustry?.mobileNumber || '').replace(/\D/g, '').slice(-10) || `98${Math.floor(10000000 + Math.random() * 90000000)}`;
    const createdUser = new MongooseUser({
      fullName: updateData.spocName?.trim() || existingIndustry?.spocName || 'Industry SPOC',
      email: targetEmail,
      mobileNumber: mobile,
      passwordHash,
      role: 'INDUSTRY',
      accountStatus: 'ACTIVE',
      emailVerification: { verified: true, verifiedAt: new Date() },
      profile: {
        organizationName: updateData.legalName?.trim() || existingIndustry?.legalName || 'Industry Partner',
        entityType: updateData.category || existingIndustry?.category || 'Corporate Entity'
      }
    });
    await createdUser.save();
    return createdUser._id;
  }
  return user?._id || userId;
}
