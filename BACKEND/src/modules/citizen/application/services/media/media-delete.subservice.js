import mongoose from 'mongoose';
import { CitizenMedia, CitizenChallenge } from '../../../infrastructure/model.js';
import { NotFoundError, AuthorizationError, BadRequestError } from '../../../../../shared/errors/AppError.js';
import logger from '../../../../../shared/logger/index.js';

export const handleDeleteMedia = async (storageProvider, mediaId, user = null) => {
  if (!mediaId) throw new BadRequestError('Media identifier is required');

  const isObjId = mongoose.isValidObjectId(mediaId);
  const media = await CitizenMedia.findOne(
    isObjId ? { $or: [{ mediaId }, { _id: mediaId }] } : { mediaId }
  );

  if (!media) throw new NotFoundError(`Media record ${mediaId} not found`);

  if (user) {
    const isOwner = media.citizenId && String(media.citizenId) === String(user.id);
    const isStaff = ['ADMIN', 'GOVERNMENT', 'NODAL'].includes(user.role);
    if (!isOwner && !isStaff) {
      throw new AuthorizationError('You do not have permission to delete this media item');
    }
  }

  await storageProvider.delete({
    providerPublicId: media.providerPublicId,
    resourceType: media.resourceType,
    isPrivate: media.isPrivate
  });

  if (media.challengeId) {
    await CitizenChallenge.updateMany(
      { challengeId: media.challengeId },
      {
        $pull: {
          media: { mediaId: media.mediaId },
          mediaUrls: { $regex: media.providerPublicId }
        }
      }
    );
  }

  await CitizenMedia.deleteOne({ _id: media._id });
  return { success: true, message: `Media ${media.mediaId} deleted successfully` };
};

export const handleCascadeDeleteChallengeMedia = async (storageProvider, challengeId) => {
  if (!challengeId) return;
  try {
    const isObjId = mongoose.isValidObjectId(challengeId);
    const challenge = await CitizenChallenge.findOne(
      isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId }
    ).lean();

    const targetIds = [challengeId, challenge?.challengeId, challenge?._id].filter(Boolean);

    const mediaItems = await CitizenMedia.find({ challengeId: { $in: targetIds } }).lean();
    const inlineMedia = Array.isArray(challenge?.media) ? challenge.media : [];

    const allPublicIds = new Map();

    mediaItems.forEach((m) => {
      if (m.providerPublicId) {
        allPublicIds.set(m.providerPublicId, { resourceType: m.resourceType || 'image', isPrivate: m.isPrivate !== false });
      }
    });

    inlineMedia.forEach((m) => {
      if (m.providerPublicId && !allPublicIds.has(m.providerPublicId)) {
        allPublicIds.set(m.providerPublicId, { resourceType: m.fileType === 'video' ? 'video' : m.fileType === 'pdf' ? 'raw' : 'image', isPrivate: true });
      }
    });

    for (const [publicId, meta] of allPublicIds.entries()) {
      try {
        await storageProvider.delete({
          providerPublicId: publicId,
          resourceType: meta.resourceType,
          isPrivate: meta.isPrivate
        });
        logger.info({ msg: 'Successfully deleted Cloudinary asset during cascade', publicId });
      } catch (err) {
        logger.warn({ msg: 'Cloudinary asset deletion skipped or failed', publicId, error: err.message });
      }
    }

    await CitizenMedia.deleteMany({ challengeId: { $in: targetIds } });
  } catch (error) {
    logger.error({ msg: 'Error during challenge media cascade deletion', challengeId, error: error.message });
  }
};

export const handleCascadeDeleteCitizenMedia = async (storageProvider, citizenId) => {
  if (!citizenId) return;
  try {
    const mediaItems = await CitizenMedia.find({ citizenId }).lean();
    if (!mediaItems?.length) return;

    for (const item of mediaItems) {
      try {
        await storageProvider.delete({
          providerPublicId: item.providerPublicId,
          resourceType: item.resourceType,
          isPrivate: item.isPrivate
        });
      } catch (err) {
        logger.warn({ msg: 'Cloudinary deletion failed during citizen cascade', error: err.message });
      }
    }

    await CitizenMedia.deleteMany({ citizenId });
  } catch (error) {
    logger.error({ msg: 'Error during citizen media cascade deletion', citizenId, error: error.message });
  }
};

export default {
  handleDeleteMedia,
  handleCascadeDeleteChallengeMedia,
  handleCascadeDeleteCitizenMedia
};
