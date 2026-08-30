import { CitizenChallenge } from './model.js';

export class CitizenRepository {
  async create(challengeData) {
    const challenge = new CitizenChallenge(challengeData);
    return await challenge.save();
  }

  async findById(challengeId) {
    return await CitizenChallenge.findOne({ challengeId }).lean();
  }

  async findWithFilter({ filter = {}, sort = { submittedAt: -1 }, skip = 0, limit = 20 }) {
    const [challenges, total] = await Promise.all([
      CitizenChallenge.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      CitizenChallenge.countDocuments(filter)
    ]);

    return {
      challenges,
      total,
      page: Math.floor(skip / limit) + 1,
      limit,
      totalPages: Math.ceil(total / limit) || 1
    };
  }

  async getRecentChallenges(limit = 5) {
    return await CitizenChallenge.find({ isPublic: true })
      .sort({ submittedAt: -1 })
      .limit(limit)
      .lean();
  }

  async getActivitiesStats(filter = {}) {
    const stats = await CitizenChallenge.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statMap = {
      submitted: 0,
      underReview: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0,
      total: 0
    };

    stats.forEach(item => {
      statMap.total += item.count;
      if (item._id === 'Submitted') statMap.submitted += item.count;
      else if (item._id === 'Under Review') statMap.underReview += item.count;
      else if (item._id === 'In Progress') statMap.inProgress += item.count;
      else if (item._id === 'Resolved') statMap.resolved += item.count;
      else if (item._id === 'Rejected') statMap.rejected += item.count;
    });

    return statMap;
  }

  async getCategoryCounts() {
    return await CitizenChallenge.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
  }

  async updateStatus(challengeId, newStatus, remarks = '', updatedBy = 'Admin') {
    const challenge = await CitizenChallenge.findOne({ challengeId });
    if (!challenge) return null;

    challenge.status = newStatus;
    if (newStatus === 'Resolved') {
      challenge.resolvedAt = new Date();
    }

    // Update milestones accordingly
    if (challenge.milestones && challenge.milestones.length > 0) {
      if (newStatus === 'Under Review') {
        challenge.milestones[0].status = 'COMPLETED';
        challenge.milestones[1].status = 'CURRENT';
        challenge.milestones[1].remarks = remarks || 'Under review by innovation cell';
      } else if (newStatus === 'In Progress') {
        challenge.milestones[0].status = 'COMPLETED';
        challenge.milestones[1].status = 'COMPLETED';
        challenge.milestones[2].status = 'COMPLETED';
        challenge.milestones[3].status = 'CURRENT';
        challenge.milestones[3].remarks = remarks || 'Assigned and solution in progress';
      } else if (newStatus === 'Resolved') {
        challenge.milestones.forEach((m, idx) => {
          m.status = 'COMPLETED';
          if (!m.completedAt) m.completedAt = new Date();
        });
        challenge.milestones[4].remarks = remarks || 'Successfully resolved and verified';
      }
    }

    await challenge.save();
    return challenge.toObject();
  }

  async triageChallenge(challengeId, triageData, user = null) {
    const challenge = await CitizenChallenge.findOne({ challengeId });
    if (!challenge) return null;

    if (triageData.title) challenge.title = triageData.title.trim();
    if (triageData.description) challenge.description = triageData.description.trim();
    if (triageData.domain) challenge.domain = triageData.domain;
    if (triageData.priority) challenge.priority = triageData.priority;
    if (triageData.district && challenge.location) challenge.location.district = triageData.district;

    const isReassignment =
      challenge.assignedUniversity?.id &&
      triageData.assignedUniversity?.id &&
      challenge.assignedUniversity.id.toUpperCase() !== triageData.assignedUniversity.id.toUpperCase();

    const newStatus = triageData.status || (triageData.assignedUniversity?.id ? 'In Progress' : 'Under Review');
    challenge.status = newStatus;

    if (triageData.assignedUniversity && triageData.assignedUniversity.id) {
      challenge.assignedUniversity = {
        id: triageData.assignedUniversity.id,
        name: triageData.assignedUniversity.name || 'Assigned University',
        department: triageData.assignedUniversity.department || 'Innovation Lab',
        mentorName: triageData.assignedUniversity.mentorName || '',
        assignedAt: new Date(),
        acceptanceStatus: triageData.acceptanceStatus || 'Pending Review',
        declineReason: ''
      };
      challenge.acceptanceStatus = triageData.acceptanceStatus || 'Pending Review';
    }

    // Milestones update
    if (challenge.milestones && challenge.milestones.length >= 4) {
      if (newStatus === 'Rejected') {
        challenge.milestones[1].status = 'REJECTED';
        challenge.milestones[1].completedAt = new Date();
        challenge.milestones[1].remarks = triageData.remarks || 'Rejected during State Nodal screening.';
        challenge.milestones[1].updatedBy = user?.fullName || 'State Nodal Officer';
      } else {
        // Step 2: Under Review / Verified
        challenge.milestones[1].status = 'COMPLETED';
        challenge.milestones[1].completedAt = new Date();
        challenge.milestones[1].remarks = triageData.remarks || 'Ground problem verified by State Nodal Cell.';
        challenge.milestones[1].updatedBy = user?.fullName || 'State Nodal Officer';

        // Step 3: University Assigned
        if (triageData.assignedUniversity?.id || challenge.assignedUniversity?.id) {
          const uniName = triageData.assignedUniversity?.name || challenge.assignedUniversity?.name || 'Assigned University';
          const isExplicitlyAccepted = triageData.acceptanceStatus === 'Accepted';

          if (isExplicitlyAccepted) {
            challenge.milestones[2].status = 'COMPLETED';
            challenge.milestones[2].completedAt = new Date();
            challenge.milestones[2].remarks = isReassignment
              ? `Reassigned and accepted by ${uniName} for priority R&D and solution prototyping.`
              : `Accepted by ${uniName} for R&D and solution prototyping.`;
            challenge.milestones[2].updatedBy = user?.fullName || 'State Nodal Officer';

            // Step 4: Solution in Progress
            challenge.milestones[3].status = 'CURRENT';
            challenge.milestones[3].remarks = `University team allocated in ${triageData.assignedUniversity?.department || 'R&D Lab'}. Active solution prototyping underway.`;
          } else {
            challenge.milestones[2].status = 'CURRENT';
            challenge.milestones[2].completedAt = null;
            challenge.milestones[2].remarks = isReassignment
              ? `Reallocated to ${uniName}. Waiting for University Department Acceptance & Mentor Onboarding.`
              : `Allocated to ${uniName}. Waiting for University Department Acceptance & Mentor Onboarding.`;
            challenge.milestones[2].updatedBy = user?.fullName || 'State Nodal Officer';

            // Step 4: Solution in Progress
            challenge.milestones[3].status = 'PENDING';
            challenge.milestones[3].remarks = 'Awaiting HEI department acceptance to commence field R&D.';
          }
        }
      }
    }

    await challenge.save();
    return challenge.toObject();
  }

  async deleteById(challengeId) {
    const deleted = await CitizenChallenge.findOneAndDelete({ challengeId });
    try {
      const { UniversityChallenge } = await import('../../university/infrastructure/model.js');
      await UniversityChallenge.findOneAndDelete({ challengeId });
    } catch {
      // ignore
    }
    return deleted;
  }

  async countAll() {
    return await CitizenChallenge.countDocuments();
  }
}

export const citizenRepository = new CitizenRepository();
export default citizenRepository;
