import logger from '../../../../shared/logger/index.js';

/**
 * Validates whether a challenge has already been allocated or assigned to an authority/executing team.
 * A problem is considered assigned if:
 * 1. An executing department is assigned
 * 2. A field technician is assigned
 * 3. A university or research institution is assigned
 * 4. A faculty member is assigned
 * 5. Acceptance status is 'Accepted'
 * 6. Status is 'In Progress', 'Resolved', 'Deployed', or 'Under Field Work'
 */
export function isChallengeAssigned(challenge) {
  if (!challenge) return false;

  const hasUni = Boolean(
    challenge.assignedUniversity?.id ||
    challenge.assignedUniversity?.name ||
    challenge.assignedUniversity?.code ||
    challenge.assignedUniversity?.universityName
  );

  const hasDept = Boolean(
    challenge.assignedDepartment?.id ||
    challenge.assignedDepartment?.name ||
    challenge.assignedDepartment?.code ||
    (typeof challenge.assignedDepartment === 'string' && challenge.assignedDepartment.trim() !== '')
  );

  const hasTech = Boolean(
    challenge.assignedTechnician?.id ||
    challenge.assignedTechnician?.name ||
    challenge.assignedTechnician?.fullName ||
    (typeof challenge.assignedTechnician === 'string' && challenge.assignedTechnician.trim() !== '')
  );

  const hasFaculty = Boolean(
    challenge.assignedFaculty?.id ||
    challenge.assignedFaculty?.name ||
    (typeof challenge.assignedFaculty === 'string' && challenge.assignedFaculty.trim() !== '')
  );

  const isAccepted =
    challenge.acceptanceStatus === 'Accepted' ||
    challenge.assignmentStatus === 'ACCEPTED' ||
    challenge.assignmentStatus === 'Accepted';

  const isAdvancedStatus = ['In Progress', 'Accepted', 'Resolved', 'Deployed', 'Under Field Work'].includes(
    challenge.status
  );

  return Boolean(hasUni || hasDept || hasTech || hasFaculty || isAccepted || isAdvancedStatus);
}

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

    if (isChallengeAssigned(existing)) {
      throw new Error('This problem has already been assigned to an authority/department/technician and cannot be withdrawn.');
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

    const existing = await this.repository.findById(challengeId);
    if (!existing) throw new Error(`Challenge with ID ${challengeId} not found`);

    if (isChallengeAssigned(existing)) {
      throw new Error('This problem has already been assigned to an authority/department/technician and cannot be deleted.');
    }

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

    // 3. Remove vector embedding point from Qdrant vector index
    try {
      const { qdrantService } = await import('../../../../infrastructure/ai/qdrant.service.js');
      await qdrantService.deleteChallenge(challengeId);
    } catch (qdErr) {
      logger.warn({
        msg: 'Warning: Failed to clean up Qdrant vector during challenge deletion',
        challengeId,
        error: qdErr.message
      });
    }

    // 4. Ensure removed from repository if soft-deleted or lingering
    await this.repository.deleteById(challengeId, deletedBy).catch(() => null);
    return { success: true, message: `Challenge ${challengeId} deleted successfully` };
  }
}

export default ChallengeTriageService;

