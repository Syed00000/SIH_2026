import mongoose from 'mongoose';
import { CitizenChallenge } from '../../../infrastructure/model.js';
import { NotFoundError, BadRequestError } from '../../../../../shared/errors/AppError.js';

export const handleGetMediaById = async (storageProvider, mediaId) => {
  if (!mediaId) throw new BadRequestError('Media identifier is required');

  const challenge = await CitizenChallenge.findOne(
    { 'media.mediaId': mediaId },
    { 'media.$': 1, challengeId: 1, citizenId: 1 }
  ).lean();

  if (!challenge || !challenge.media?.[0]) {
    throw new NotFoundError(`Media item ${mediaId} not found in challenges`);
  }

  const item = challenge.media[0];
  const accessUrl = item.url || (item.providerPublicId ? await storageProvider.getAccessUrl({
    providerPublicId: item.providerPublicId,
    resourceType: item.fileType === 'video' ? 'video' : item.fileType === 'pdf' ? 'raw' : 'image',
    isPrivate: false
  }) : '');

  return {
    mediaId: item.mediaId,
    citizenId: challenge.citizenId,
    challengeId: challenge.challengeId,
    fileName: item.fileName,
    mimeType: item.mimeType,
    fileType: item.fileType,
    fileSize: item.fileSize,
    caption: item.caption,
    accessUrl,
    createdAt: item.uploadedAt
  };
};

export const handleGetMediaByChallenge = async (storageProvider, challengeId) => {
  if (!challengeId) return [];

  const isObjId = mongoose.isValidObjectId(challengeId);
  const challenge = await CitizenChallenge.findOne(
    isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId },
    { media: 1, challengeId: 1 }
  ).lean();

  if (!challenge || !Array.isArray(challenge.media)) return [];

  return challenge.media.map((item) => ({
    mediaId: item.mediaId,
    challengeId: challenge.challengeId,
    fileName: item.fileName,
    mimeType: item.mimeType,
    fileType: item.fileType,
    fileSize: item.fileSize,
    caption: item.caption,
    accessUrl: item.url,
    createdAt: item.uploadedAt
  }));
};

export default {
  handleGetMediaById,
  handleGetMediaByChallenge
};
