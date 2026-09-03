import mongoose from 'mongoose';
import { CitizenMedia, CitizenChallenge } from '../../../infrastructure/model.js';
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

  try {
    const mediaDoc = new CitizenMedia({
      mediaId,
      citizenId: effectiveCitizenId && mongoose.isValidObjectId(effectiveCitizenId) ? effectiveCitizenId : null,
      challengeId: challengeId || null,
      storageProvider: uploadResult.storageProvider || 'cloudinary',
      storageKey: uploadResult.storageKey,
      providerPublicId: uploadResult.providerPublicId,
      resourceType: uploadResult.resourceType,
      originalFileName: uploadResult.originalFileName,
      mimeType: uploadResult.mimeType,
      fileType: uploadResult.fileType,
      fileSize: uploadResult.fileSize,
      caption: caption || '',
      isPrivate: true,
      uploadedBy: {
        id: user?.id ? String(user.id) : (effectiveCitizenId ? String(effectiveCitizenId) : ''),
        name: user?.fullName || 'Citizen Contributor',
        role: user?.role || 'CITIZEN'
      }
    });

    const savedMediaRecord = await mediaDoc.save();

    if (challengeId) {
      await CitizenChallenge.findOneAndUpdate(
        { $or: [{ challengeId }, { _id: mongoose.isValidObjectId(challengeId) ? challengeId : null }] },
        {
          $push: {
            media: {
              mediaId,
              url: uploadResult.accessUrl,
              caption: caption || uploadResult.originalFileName,
              fileName: uploadResult.originalFileName,
              fileType: uploadResult.fileType,
              fileSize: uploadResult.fileSize,
              mimeType: uploadResult.mimeType,
              providerPublicId: uploadResult.providerPublicId,
              uploadedAt: new Date()
            },
            mediaUrls: uploadResult.accessUrl
          }
        }
      );
    }

    return {
      id: savedMediaRecord._id,
      mediaId: savedMediaRecord.mediaId,
      citizenId: savedMediaRecord.citizenId,
      challengeId: savedMediaRecord.challengeId,
      fileName: savedMediaRecord.originalFileName,
      mimeType: savedMediaRecord.mimeType,
      fileType: savedMediaRecord.fileType,
      fileSize: savedMediaRecord.fileSize,
      caption: savedMediaRecord.caption,
      accessUrl: uploadResult.accessUrl,
      createdAt: savedMediaRecord.createdAt
    };
  } catch (dbError) {
    logger.error({
      msg: 'DB failed after storage upload, running rollback cleanup',
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
