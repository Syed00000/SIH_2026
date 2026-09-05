import mongoose from 'mongoose';
import { CitizenChallenge } from '../../../infrastructure/model.js';
import { NotFoundError, BadRequestError } from '../../../../../shared/errors/AppError.js';
import { extractCloudinaryAssetInfo } from './challenge-cascade-cleaner.helper.js';

export const handleDeleteMedia = async (storageProvider, mediaId) => {
  if (!mediaId) throw new BadRequestError('Media identifier is required');

  const challenge = await CitizenChallenge.findOne(
    { 'media.mediaId': mediaId },
    { 'media.$': 1, challengeId: 1 }
  ).lean();

  if (!challenge || !challenge.media?.[0]) {
    throw new NotFoundError(`Media item ${mediaId} not found`);
  }

  const item = challenge.media[0];
  const info = extractCloudinaryAssetInfo(item);
  if (info?.publicId) {
    try {
      await storageProvider.delete({
        providerPublicId: info.publicId,
        resourceType: info.resourceType,
        isPrivate: false
      });
    } catch (_) {}
  }

  await CitizenChallenge.updateOne(
    { _id: challenge._id },
    {
      $pull: {
        media: { mediaId },
        mediaUrls: item.url
      }
    }
  );

  return { success: true, message: `Media ${mediaId} deleted successfully` };
};

export const handleCascadeDeleteChallengeMedia = async (storageProvider, challengeId) => {
  if (!challengeId) return;
  const { purgeChallengeAndAllMedia } = await import('./challenge-cascade-cleaner.helper.js');
  return purgeChallengeAndAllMedia(storageProvider, challengeId);
};

export const handleCascadeDeleteCitizenMedia = async (storageProvider, citizenId) => {
  if (!citizenId) return;
  const isObjId = mongoose.isValidObjectId(citizenId);
  const challenges = await CitizenChallenge.find(
    isObjId ? { citizenId } : { 'submitter.mobileNumber': citizenId }
  ).lean();

  for (const c of challenges) {
    await handleCascadeDeleteChallengeMedia(storageProvider, c.challengeId || c._id);
  }
};

export default {
  handleDeleteMedia,
  handleCascadeDeleteChallengeMedia,
  handleCascadeDeleteCitizenMedia
};
