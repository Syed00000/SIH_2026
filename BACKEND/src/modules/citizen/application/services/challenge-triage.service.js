import logger from '../../../../shared/logger/index.js';

export class ChallengeTriageService {
  constructor(repository) {
    this.repository = repository;
  }

  async triageChallenge(challengeId, triageData, user = null) {
    if (!challengeId) throw new Error('Challenge ID is required');

    const existing = await this.repository.findById(challengeId);
    if (!existing) throw new Error(`Challenge with ID ${challengeId} not found`);
    if (existing.status === 'Withdrawn') {
      throw new Error('This problem has been withdrawn by the citizen and cannot be allocated or assigned to universities.');
    }

    const updated = await this.repository.triageChallenge(challengeId, triageData, user);
    if (!updated) throw new Error(`Challenge with ID ${challengeId} not found`);

    return updated;
  }

  async withdrawChallenge(challengeId, reason = '', user = null) {
    if (!challengeId) throw new Error('Challenge ID is required');

    const existing = await this.repository.findById(challengeId);
    if (!existing) throw new Error(`Challenge with ID ${challengeId} not found`);

    const isAlreadyAssigned =
      Boolean(existing.assignedUniversity?.id || existing.assignedUniversity?.name) ||
      existing.acceptanceStatus === 'Accepted' ||
      existing.status === 'In Progress';

    if (isAlreadyAssigned) {
      throw new Error('This problem has already been assigned to an institution and cannot be withdrawn.');
    }

    const updated = await this.repository.updateStatus(
      challengeId,
      'Withdrawn',
      reason || 'Withdrawn by citizen submitter',
      user?.fullName || 'Citizen'
    );
    if (!updated) throw new Error(`Challenge with ID ${challengeId} not found`);
    return updated;
  }

  async deleteChallenge(challengeId, deletedBy = 'Citizen') {
    if (!challengeId) throw new Error('Challenge ID is required');

    // 1. Permanently destroy all Cloudinary assets and clean up citizen_media
    try {
      const { getStorageProvider } = await import('../../../../infrastructure/storage/index.js');
      const { purgeChallengeAndAllMedia } = await import('./media/challenge-cascade-cleaner.helper.js');
      await purgeChallengeAndAllMedia(getStorageProvider(), challengeId, deletedBy);
    } catch (mediaErr) {
      logger.warn({
        msg: 'Warning: Failed to clean up media during challenge deletion',
        challengeId,
        error: mediaErr.message
      });
    }

    // 2. Cascade delete linked University projects, faculty assignments, approvals, and teams
    try {
      const { cascadeDeleteProblemOrProject } = await import('../../../university/infrastructure/helpers/cascade-delete.helper.js');
      await cascadeDeleteProblemOrProject('RUNI-JH', challengeId, deletedBy);
    } catch (uniErr) {
      logger.warn({
        msg: 'Warning: Failed to cascade delete university project during challenge deletion',
        challengeId,
        error: uniErr.message
      });
    }

    // 3. Ensure removed from repository if soft-deleted or lingering
    await this.repository.deleteById(challengeId, deletedBy).catch(() => null);
    return { success: true, message: `Challenge ${challengeId} deleted successfully` };
  }
}

export default ChallengeTriageService;
