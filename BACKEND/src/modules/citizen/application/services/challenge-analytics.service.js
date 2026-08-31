export class ChallengeAnalyticsService {
  constructor(repository) {
    this.repository = repository;
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

    const activityStats = await this.repository.getActivitiesStats(filter);
    const totalAll = await this.repository.countAll();

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
        description:
          'Department of Higher & Technical Education released funding window for grassroots problem statements submitted by citizens.',
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
