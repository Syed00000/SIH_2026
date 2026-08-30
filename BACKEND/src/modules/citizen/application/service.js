import { citizenRepository } from '../infrastructure/repository.js';
import logger from '../../../shared/logger/index.js';

export class CitizenService {
  generateChallengeId() {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `CHL-JH-${year}-${randomSuffix}`;
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

    const challengeId = this.generateChallengeId();

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

    const saved = await citizenRepository.create(newChallenge);
    return saved.toObject();
  }

  async getChallenges({ domain, status, district, search, page = 1, limit = 20, isPublic = true }) {
    const filter = {};
    if (isPublic) filter.isPublic = true;
    if (domain && domain !== 'All') filter.domain = domain;
    if (status && status !== 'All') filter.status = status;
    if (district && district !== 'All') filter['location.district'] = district;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { description: regex },
        { 'location.district': regex },
        { 'location.block': regex },
        { domain: regex },
        { challengeId: regex }
      ];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    return await citizenRepository.findWithFilter({ filter, skip, limit: Number(limit) });
  }

  async getMyChallenges(user, { status, search, page = 1, limit = 20 }) {
    const filter = {};
    if (user?.id) {
      filter.$or = [
        { citizenId: user.id },
        { 'submitter.email': user.email },
        { 'submitter.mobileNumber': user.mobileNumber }
      ];
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$and = [
        {
          $or: [
            { title: regex },
            { description: regex },
            { domain: regex },
            { challengeId: regex },
            { 'location.district': regex }
          ]
        }
      ];
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    return await citizenRepository.findWithFilter({ filter, skip, limit: Number(limit) });
  }

  async getChallengeById(challengeId) {
    const challenge = await citizenRepository.findById(challengeId);
    if (!challenge) {
      throw new Error(`Challenge with ID ${challengeId} not found`);
    }
    return challenge;
  }

  async getStats(user = null) {
    let filter = {};
    if (user?.id) {
      filter = {
        $or: [
          { citizenId: user.id },
          { 'submitter.email': user.email },
          { 'submitter.mobileNumber': user.mobileNumber }
        ]
      };
    }

    const activityStats = await citizenRepository.getActivitiesStats(filter);
    const totalAll = await citizenRepository.countAll();

    return {
      activities: {
        submitted: activityStats.submitted || 0,
        underReview: activityStats.underReview || 0,
        clarificationRequested: activityStats.clarificationRequested || 0,
        clarified: activityStats.clarified || 0,
        inProgress: activityStats.inProgress || 0,
        resolved: activityStats.resolved || 0,
        total: activityStats.total || 0
      },
      overallImpact: {
        challengesSubmitted: totalAll,
        universitiesEngaged: 86,
        industryPartners: 124,
        solutionsDeployed: activityStats.resolved || 0
      }
    };
  }

  async getUpdates() {
    return [
      {
        id: 'UPD-1',
        title: 'New Innovation Funding Window Opened',
        category: 'Grant Announcement',
        description: 'Department of Higher & Technical Education released funding window for grassroots problem statements submitted by citizens.',
        timestamp: 'Today, 11:30 AM',
        date: new Date(),
        isUnread: true,
        type: 'announcement'
      }
    ];
  }

  async getPopularAreas() {
    const defaultAreas = [
      { id: 'education', name: 'Education', icon: 'GraduationCap', color: 'blue', count: 0 },
      { id: 'healthcare', name: 'Healthcare', icon: 'HeartPulse', color: 'red', count: 0 },
      { id: 'agriculture', name: 'Agriculture', icon: 'Sprout', color: 'green', count: 0 },
      { id: 'water', name: 'Water Resources', icon: 'Droplet', color: 'cyan', count: 0 },
      { id: 'environment', name: 'Environment', icon: 'Recycle', color: 'emerald', count: 0 },
      { id: 'energy', name: 'Energy', icon: 'Zap', color: 'amber', count: 0 },
      { id: 'urban', name: 'Urban Development', icon: 'Building2', color: 'indigo', count: 0 },
      { id: 'accessibility', name: 'Accessibility', icon: 'Accessibility', color: 'blue', count: 0 },
      { id: 'admin', name: 'Public Administration', icon: 'Landmark', color: 'slate', count: 0 },
      { id: 'rural', name: 'Rural Livelihoods', icon: 'Handshake', color: 'navy', count: 0 }
    ];

    try {
      const dbCounts = await citizenRepository.getCategoryCounts();
      const countMap = {};
      dbCounts.forEach((c) => {
        countMap[c._id] = c.count;
      });

      return defaultAreas.map((area) => ({
        ...area,
        count: countMap[area.name] || 0
      }));
    } catch {
      return defaultAreas;
    }
  }

  async triageChallenge(challengeId, triageData, user = null) {
    if (!challengeId) throw new Error('Challenge ID is required');
    const updated = await citizenRepository.triageChallenge(challengeId, triageData, user);
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
    const deleted = await citizenRepository.deleteById(challengeId);
    if (!deleted) throw new Error(`Challenge ${challengeId} not found`);
    return { success: true, message: `Challenge ${challengeId} deleted successfully` };
  }
}

export const citizenService = new CitizenService();
export default citizenService;
