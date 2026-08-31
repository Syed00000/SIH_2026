import logger from '../../../../shared/logger/index.js';

export class ChallengeTriageService {
  constructor(repository) {
    this.repository = repository;
  }

  async triageChallenge(challengeId, triageData, user = null) {
    if (!challengeId) throw new Error('Challenge ID is required');
    const updated = await this.repository.triageChallenge(challengeId, triageData, user);
    if (!updated) throw new Error(`Challenge with ID ${challengeId} not found`);

    // Sync to university challenge collection if assigned to an HEI
    if (triageData.assignedUniversity?.id) {
      try {
        const { UniversityChallenge } = await import('../../university/infrastructure/model.js');
        const uniCode = (triageData.assignedUniversity.id || '').toUpperCase();
        await UniversityChallenge.findOneAndUpdate(
          { challengeId },
          {
            $set: {
              challengeId,
              universityCode: uniCode,
              title: updated.title,
              domain: updated.domain,
              district: updated.location?.district || 'Ranchi',
              priority: updated.priority || 'Medium',
              status: 'Review',
              problemStatement: updated.description,
              affectedPopulation: updated.impactMetrics?.affectedPopulation || '~ 5,000 People',
              aiCategory: updated.domain,
              requiredSkills: triageData.requiredSkills || ['Field Engineering', 'Data Analytics'],
              governmentRemarks: triageData.remarks || 'Priority challenge assigned via State Nodal Officer Triage.',
              locationDetails: {
                block: updated.location?.block || '',
                panchayatOrWard: updated.location?.panchayatOrWard || '',
                landmark: updated.location?.landmark || '',
                coordinates: updated.location?.coordinates || ''
              },
              assignedOn: new Date(),
              deadline: '30 Days Review Phase'
            }
          },
          { upsert: true, new: true }
        );
      } catch (err) {
        logger.warn({ msg: 'Failed to mirror to UniversityChallenge', error: err.message });
      }
    }

    return updated;
  }

  async deleteChallenge(challengeId) {
    if (!challengeId) throw new Error('Challenge ID is required');
    const deleted = await this.repository.deleteById(challengeId);
    if (!deleted) throw new Error(`Challenge ${challengeId} not found`);
    return { success: true, message: `Challenge ${challengeId} deleted successfully` };
  }
}

export default ChallengeTriageService;
