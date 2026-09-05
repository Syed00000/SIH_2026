import mongoose from 'mongoose';
import { CitizenChallenge } from '../../../infrastructure/model.js';
import { BadRequestError } from '../../../../../shared/errors/AppError.js';
import logger from '../../../../../shared/logger/index.js';

export const handleMediaUpload = async (storageProvider, { file, citizenId = null, challengeId = null, caption = '', user = null }) => {
  if (!file || !file.buffer) {
    throw new BadRequestError('No file buffer provided for upload');
  }

  const effectiveCitizenId = citizenId || user?.id || null;
  const folderPrefix = effectiveCitizenId ? `citizens/${effectiveCitizenId}/evidence` : 'citizens/public/evidence';
  const uniqueId = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const uploadResult = await storageProvider.upload({
    buffer: file.buffer,
    originalFileName: file.originalname,
    mimeType: file.mimetype,
    folder: folderPrefix,
    uniqueId,
    isPrivate: true
  });

  const mediaId = `MED-${uniqueId.toUpperCase()}`;

  const mediaItem = {
    mediaId,
    url: uploadResult.accessUrl,
    caption: caption || uploadResult.originalFileName,
    fileName: uploadResult.originalFileName,
    fileType: uploadResult.fileType,
    fileSize: uploadResult.fileSize,
    mimeType: uploadResult.mimeType,
    providerPublicId: uploadResult.providerPublicId,
    uploadedAt: new Date()
  };

  try {
    if (challengeId) {
      await CitizenChallenge.findOneAndUpdate(
        { $or: [{ challengeId }, { _id: mongoose.isValidObjectId(challengeId) ? challengeId : null }] },
        {
          $push: {
            media: mediaItem,
            mediaUrls: uploadResult.accessUrl
          }
        }
      );
    }

    return {
      mediaId,
      citizenId: effectiveCitizenId,
      challengeId,
      fileName: mediaItem.fileName,
      mimeType: mediaItem.mimeType,
      fileType: mediaItem.fileType,
      fileSize: mediaItem.fileSize,
      caption: mediaItem.caption,
      accessUrl: uploadResult.accessUrl,
      providerPublicId: uploadResult.providerPublicId,
      createdAt: mediaItem.uploadedAt
    };
  } catch (dbError) {
    logger.error({
      msg: 'Failed to link media to challenge, rolling back Cloudinary upload',
      providerPublicId: uploadResult.providerPublicId
    });
    try {
      await storageProvider.delete({
        providerPublicId: uploadResult.providerPublicId,
        resourceType: uploadResult.resourceType,
        isPrivate: true
      });
    } catch (_) {}
    throw dbError;
  }
};

export default handleMediaUpload;
