import { getStorageProvider } from '../../../../infrastructure/storage/index.js';
import { handleMediaUpload } from './media/media-upload.subservice.js';
import { handleGetMediaById, handleGetMediaByChallenge } from './media/media-query.subservice.js';
import {
  handleDeleteMedia,
  handleCascadeDeleteChallengeMedia,
  handleCascadeDeleteCitizenMedia
} from './media/media-delete.subservice.js';

export class CitizenMediaService {
  constructor(storageProvider = getStorageProvider()) {
    this.storageProvider = storageProvider;
  }

  async uploadEvidence(params) {
    return handleMediaUpload(this.storageProvider, params);
  }

  async getMediaById(mediaId, user = null) {
    return handleGetMediaById(this.storageProvider, mediaId, user);
  }

  async getMediaByChallenge(challengeId, user = null) {
    return handleGetMediaByChallenge(this.storageProvider, challengeId, user);
  }

  async deleteMedia(mediaId, user = null) {
    return handleDeleteMedia(this.storageProvider, mediaId, user);
  }

  async cascadeDeleteChallengeMedia(challengeId) {
    return handleCascadeDeleteChallengeMedia(this.storageProvider, challengeId);
  }

  async cascadeDeleteCitizenMedia(citizenId) {
    return handleCascadeDeleteCitizenMedia(this.storageProvider, citizenId);
  }
}

export const citizenMediaService = new CitizenMediaService();
export default citizenMediaService;
