import mongoose from 'mongoose';
import MongooseUniversity from '../../../government/heis/infrastructure/model.js';
import MongooseIndustry from '../../../government/industries/infrastructure/model.js';
import { GovernmentGrantFund } from '../../../government/grants/model.js';
import { CitizenChallenge } from '../../infrastructure/model.js';

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
    } else if ((user?.role || '').toUpperCase() === 'CITIZEN' && user?.id) {
      const emailRegex = user.email ? new RegExp(`^${user.email.trim()}$`, 'i') : null;
      const userMatch = [
        { citizenId: user.id },
        { citizenId: String(user.id) }
      ];
      if (emailRegex) userMatch.push({ 'submitter.email': emailRegex });
      if (user.mobileNumber) userMatch.push({ 'submitter.mobileNumber': user.mobileNumber });
      if (mongoose.isValidObjectId(user.id)) userMatch.push({ citizenId: new mongoose.Types.ObjectId(user.id) });

      const personalStats = await this.repository.getActivitiesStats({ $or: userMatch });
      if (personalStats && personalStats.total > 0) {
        filter = { $or: userMatch };
      } else {
        filter = {};
      }
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
      const updates = [];
      const resolved = await CitizenChallenge.find({ status: 'Resolved' })
        .sort({ updatedAt: -1 })
        .limit(8)
        .lean();

      if (resolved && resolved.length > 0) {
        resolved.forEach((c) => {
          updates.push({
            id: `RES-${c.challengeId || c._id}`,
            challengeId: c.challengeId,
            title: `🎉 Problem Solved & Deployed: ${c.title}`,
            category: 'Solution Deployed',
            description: c.resolutionDossier?.notificationText || `Your problem statement "${c.title}" has been successfully solved! The engineered prototype has completed NABL lab testing and has been officially deployed on-ground for citizen benefit.`,
            timestamp: new Date(c.resolvedAt || c.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            date: c.resolvedAt || c.updatedAt,
            isUnread: true,
            type: 'resolution',
            department: c.resolutionDossier?.department || 'Urban Development & Housing Department'
          });
        });
      }

      const grants = await GovernmentGrantFund.find({ status: 'Active' })
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

      if (grants && grants.length > 0) {
        grants.forEach((g) => {
          updates.push({
            id: g.fundId || String(g._id),
            title: g.title,
            category: g.scheme || 'Grant Announcement',
            description: g.description || `Funding allocation for financial year ${g.financialYear || ''}.`,
            timestamp: new Date(g.allocationDate || g.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            date: g.allocationDate || g.createdAt,
            isUnread: false,
            type: 'announcement'
          });
        });
      }

      return updates;
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
