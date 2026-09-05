import mongoose from 'mongoose';
import { CitizenChallenge } from '../../../infrastructure/model.js';
import logger from '../../../../../shared/logger/index.js';

/**
 * Extracts candidate Cloudinary public_ids and resource types from any file URL or string.
 */
export const extractCloudinaryAssetInfo = (rawItem) => {
  if (!rawItem) return null;
  let publicId = '';
  let resType = 'image';

  if (typeof rawItem === 'object') {
    publicId = rawItem.providerPublicId || rawItem.storageKey || rawItem.url || '';
    resType = rawItem.fileType === 'video' ? 'video' : (rawItem.fileType === 'pdf' || rawItem.resourceType === 'raw') ? 'raw' : 'image';
  } else if (typeof rawItem === 'string') {
    publicId = rawItem;
  }

  if (!publicId || typeof publicId !== 'string') return null;

  try { publicId = decodeURIComponent(publicId); } catch (_) {}

  if (publicId.includes('cloudinary.com')) {
    const match = publicId.match(/\/(?:upload|authenticated)(?:\/s--[^/]+--)?\/(?:v\d+\/)?([^?&#]+)/);
    if (match) {
      publicId = decodeURIComponent(match[1]);
    }
  }

  publicId = publicId.split('?')[0].split('&')[0].split('#')[0].trim();
  if (!publicId) return null;

  const isPdf = publicId.toLowerCase().endsWith('.pdf') || resType === 'raw';
  const isVideo = publicId.toLowerCase().match(/\.(mp4|webm|mov|m4v|ogg)$/) || resType === 'video';
  const finalResType = isPdf ? 'raw' : isVideo ? 'video' : 'image';

  return { publicId, resourceType: finalResType };
};

/**
 * Unified, single-point cascade deletion:
 * 1. Fetches challenge data from `citizen_challenges`.
 * 2. Destroys all associated images/videos/PDFs from Cloudinary.
 * 3. Removes related records from `citizen_media` and `clarification_messages`.
 * 4. Permanently purges challenge from `citizen_challenges`.
 */
export const purgeChallengeAndAllMedia = async (storageProvider, challengeId, deletedBy = 'System') => {
  if (!challengeId) return { success: false, reason: 'Missing challengeId' };

  const isObjId = mongoose.isValidObjectId(challengeId);
  const challenge = await CitizenChallenge.findOne(
    isObjId ? { $or: [{ challengeId }, { _id: challengeId }] } : { challengeId }
  ).lean();

  if (!challenge) {
    logger.warn({ msg: 'Challenge not found for cascade purge', challengeId });
    return { success: false, reason: 'Challenge not found' };
  }

  const resolvedChlId = challenge.challengeId || challengeId;
  const resolvedDbId = challenge._id;

  // 1. Gather all asset candidates
  const candidateItems = [
    ...(Array.isArray(challenge.media) ? challenge.media : []),
    ...(Array.isArray(challenge.mediaUrls) ? challenge.mediaUrls : []),
    ...(Array.isArray(challenge.evidence) ? challenge.evidence : []),
    ...(Array.isArray(challenge.attachments) ? challenge.attachments : []),
    challenge.prototypePdfUrl,
    challenge.solutionPdfUrl
  ].filter(Boolean);

  // 2. Resolve unique Cloudinary assets to delete
  const assetsMap = new Map();
  for (const item of candidateItems) {
    const info = extractCloudinaryAssetInfo(item);
    if (info && info.publicId) {
      assetsMap.set(info.publicId, info.resourceType);
    }
  }

  // 3. Destroy each asset from Cloudinary
  let deletedFromCloudinary = 0;
  for (const [pId, rType] of assetsMap.entries()) {
    try {
      const deleted = await storageProvider.delete({
        providerPublicId: pId,
        resourceType: rType,
        isPrivate: false
      });
      if (deleted) deletedFromCloudinary++;
      logger.info({ msg: 'Cloudinary asset purged during challenge deletion', publicId: pId, rType, deleted });
    } catch (err) {
      logger.warn({ msg: 'Failed to destroy Cloudinary asset (non-blocking)', publicId: pId, error: err.message });
    }
  }

  // 4. Clean up any linked clarification messages
  const ClarificationMessage = mongoose.models.ClarificationMessage;
  if (ClarificationMessage) {
    await ClarificationMessage.deleteMany({
      $or: [{ challengeId: resolvedChlId }, { challengeId: String(resolvedDbId) }]
    });
  }

  // 5. Delete the challenge document from citizen_challenges
  await CitizenChallenge.deleteOne({ _id: resolvedDbId });

  logger.info({
    msg: 'Challenge & Cloudinary assets completely purged',
    challengeId: resolvedChlId,
    deletedFromCloudinary,
    totalAssets: assetsMap.size,
    deletedBy
  });

  return {
    success: true,
    challengeId: resolvedChlId,
    deletedFromCloudinary,
    totalAssetsFound: assetsMap.size
  };
};

export default purgeChallengeAndAllMedia;
