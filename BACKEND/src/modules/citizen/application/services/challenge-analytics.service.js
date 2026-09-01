import MongooseUniversity from '../../../government/heis/infrastructure/model.js';
import MongooseIndustry from '../../../government/industries/infrastructure/model.js';
import GovernmentGrantFund from '../../../government/grants/model.js';

export class ChallengeAnalyticsService {
  constructor(repository) {
    this.repository = repository;
  }

  async getStats(user = null, district = null) {
    let filter = {};
    const effectiveDistrict = district || (user?.role === 'NODAL' ? (user?.district || user?.profile?.district) : null);

    if (effectiveDistrict && effectiveDistrict !== 'All' && effectiveDistrict !== 'All Districts') {
      const distRegex = new RegExp(`^${effectiveDistrict.trim()}$`, 'i');
      filter.$or = [
        { 'location.district': distRegex },
        { district: distRegex },
        { 'assignedNodalOfficer.district': distRegex }
      ];
    } else if (user?.role === 'CITIZEN' && user?.id) {
      filter = {
        $or: [
          { citizenId: user.id },
          { 'submitter.email': user.email },
          { 'submitter.mobileNumber': user.mobileNumber }
        ]
      };
    }

    const [activityStats, totalAll, universitiesCount, industryCount] = await Promise.all([
      this.repository.getActivitiesStats(filter),
      this.repository.countAll(),
      MongooseUniversity.countDocuments({ status: { $ne: 'Rejected' } }).catch(() => 0),
      MongooseIndustry.countDocuments({ status: { $ne: 'Rejected' } }).catch(() => 0)
    ]);

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
        universitiesEngaged: universitiesCount,
        industryPartners: industryCount,
        solutionsDeployed: activityStats.resolved || 0
      }
    };
  }

  async getUpdates() {
    try {
      const grants = await GovernmentGrantFund.find({ status: 'Active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      if (grants && grants.length > 0) {
        return grants.map((g) => ({
          id: g.fundId || String(g._id),
          title: g.title,
          category: g.scheme || 'Grant Announcement',
          description: g.description || `Funding allocation for financial year ${g.financialYear || ''}.`,
          timestamp: new Date(g.allocationDate || g.createdAt).toLocaleDateString(),
          date: g.allocationDate || g.createdAt,
          isUnread: true,
          type: 'announcement'
        }));
      }
      return [];
    } catch {
      return [];
    }
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
      const dbCounts = await this.repository.getCategoryCounts();
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
}

export default ChallengeAnalyticsService;
