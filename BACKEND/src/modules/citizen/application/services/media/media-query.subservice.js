import mongoose from 'mongoose';
import { CitizenMedia } from '../../../infrastructure/model.js';
import { NotFoundError, AuthorizationError, BadRequestError } from '../../../../../shared/errors/AppError.js';

export const handleGetMediaById = async (storageProvider, mediaId, user = null) => {
  if (!mediaId) throw new BadRequestError('Media identifier is required');

  const isObjId = mongoose.isValidObjectId(mediaId);
  const media = await CitizenMedia.findOne(
    isObjId ? { $or: [{ mediaId }, { _id: mediaId }] } : { mediaId }
  ).lean();

  if (!media) throw new NotFoundError(`Citizen media record ${mediaId} not found`);

  if (media.isPrivate && user) {
    const isOwner = media.citizenId && String(media.citizenId) === String(user.id);
    const isAuthorized = ['ADMIN', 'GOVERNMENT', 'NODAL', 'UNIVERSITY', 'FACULTY'].includes(user.role);
    if (!isOwner && !isAuthorized) {
      throw new AuthorizationError('You are not authorized to access this private media record');
    }
  }

  const accessUrl = await storageProvider.getAccessUrl({
    providerPublicId: media.providerPublicId,
    resourceType: media.resourceType,
    isPrivate: media.isPrivate
  });

  return {
    id: media._id,
    mediaId: media.mediaId,
    citizenId: media.citizenId,
    challengeId: media.challengeId,
    fileName: media.originalFileName,
    mimeType: media.mimeType,
    fileType: media.fileType,
    fileSize: media.fileSize,
    caption: media.caption,
    accessUrl,
    createdAt: media.createdAt,
    uploadedBy: media.uploadedBy
  };
};

export const handleGetMediaByChallenge = async (storageProvider, challengeId) => {
  if (!challengeId) return [];

  const mediaList = await CitizenMedia.find({ challengeId }).sort({ createdAt: 1 }).lean();

  return Promise.all(
    mediaList.map(async (item) => {
      try {
        const accessUrl = await storageProvider.getAccessUrl({
          providerPublicId: item.providerPublicId,
          resourceType: item.resourceType,
          isPrivate: item.isPrivate
        });
        return {
          id: item._id,
          mediaId: item.mediaId,
          fileName: item.originalFileName,
          mimeType: item.mimeType,
          fileType: item.fileType,
          fileSize: item.fileSize,
          caption: item.caption,
          accessUrl,
          createdAt: item.createdAt
        };
      } catch (_) {
        return {
          id: item._id,
          mediaId: item.mediaId,
          fileName: item.originalFileName,
          fileType: item.fileType,
          fileSize: item.fileSize,
          caption: item.caption,
          accessUrl: '',
          createdAt: item.createdAt
        };
      }
    })
  );
};

export default {
  handleGetMediaById,
  handleGetMediaByChallenge
};
