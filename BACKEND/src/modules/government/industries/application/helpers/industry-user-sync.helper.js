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

export async function syncIndustryUserUpdate(userId, updateData) {
  if (!userId || (!updateData.spocName && !updateData.legalName)) return;
  const userUpdate = {};
  if (updateData.spocName) userUpdate.fullName = updateData.spocName;
  if (updateData.legalName) userUpdate['profile.organizationName'] = updateData.legalName;
  await MongooseUser.findByIdAndUpdate(userId, { $set: userUpdate });
}
