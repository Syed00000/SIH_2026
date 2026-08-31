import { generateChallengeId } from '../helpers/challenge-id.helper.js';

export class ChallengeSubmissionService {
  constructor(repository) {
    this.repository = repository;
  }

  async submitChallenge(data, user = null) {
    if (!data.title || data.title.trim().length < 5) {
      throw new Error('Title must be at least 5 characters long');
    }
    if (!data.description || data.description.trim().length < 10) {
      throw new Error('Please provide a detailed problem statement of at least 10 characters');
    }
    if (!data.district) {
      throw new Error('District is required');
    }

    const challengeId = generateChallengeId();

    const newChallenge = {
      challengeId,
      citizenId: user?.id || null,
      title: data.title.trim(),
      description: data.description.trim(),
      domain: data.domain || 'Urban Development',
      priority: data.priority || 'Medium',
      status: 'Under Review',
      location: {
        district: data.district || 'Ranchi',
        block: data.block || '',
        panchayatOrWard: data.panchayatOrWard || '',
        landmark: data.landmark || '',
        pincode: data.pincode || '',
        fullAddress:
          data.fullAddress ||
          `${data.landmark ? data.landmark + ', ' : ''}${
            data.block ? data.block + ', ' : ''
          }${data.district}, Jharkhand`,
        coordinates: data.coordinates || ''
      },
      submitter: {
        name: data.submitterName || user?.fullName || 'Citizen Contributor',
        mobileNumber: data.submitterPhone || user?.mobileNumber || '9876543210',
        email: data.submitterEmail || user?.email || '',
        role: data.submitterRole || 'Citizen',
        designation: data.designation || '',
        organization: data.organization || ''
      },
      mediaUrls: data.mediaUrls || [],
      impactMetrics: {
        affectedPopulation: data.affectedPopulation || '~ 2,500 People',
        estimatedBudget: data.estimatedBudget || 'Under Assessment'
      },
      submittedAt: new Date()
    };

    const saved = await this.repository.create(newChallenge);
    return saved.toObject();
  }
}

export default ChallengeSubmissionService;
