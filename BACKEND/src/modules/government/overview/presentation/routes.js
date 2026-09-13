import { Router } from 'express';
import { MongooseUniversity } from '../../heis/infrastructure/model.js';
import { MongooseIndustry } from '../../industries/infrastructure/model.js';
import { MongooseAdmin } from '../../admins/infrastructure/model.js';
import { MongooseUser } from '../../../users/infrastructure/model.js';
import { GrantFundService } from '../../grants/service.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { UniversityProject } from '../../../university/infrastructure/model.js';
import { governmentNotificationService } from '../application/government-notification.service.js';

const router = Router();
const grantFundService = new GrantFundService();

router.get('/', (req, res, next) => {
  req.url = '/stats';
  router.handle(req, res, next);
});

router.get('/notifications', async (req, res, next) => {
  try {
    const data = await governmentNotificationService.getLiveNotifications();
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    const [
      activeHeis,
      totalHeis,
      activeIndustries,
      totalIndustries,
      activeAdmins,
      totalProblems,
      solvedProblems,
      inProgressProblems,
      totalCitizens,
      industryFinancials,
      fundsOverview,
      projectList,
      heisByDistrict,
      industriesByCategory,
      sectorsAgg,
      topHeisList,
      recentChallenges
    ] = await Promise.all([
      MongooseUniversity.countDocuments({
        $or: [{ status: 'Approved' }, { status: 'Active' }],
        accessStatus: { $ne: 'Disabled' }
      }),
      MongooseUniversity.countDocuments(),
      MongooseIndustry.countDocuments({ status: 'Active', accessStatus: 'Enabled' }),
      MongooseIndustry.countDocuments(),
      MongooseAdmin.countDocuments({ status: 'Active' }),
      CitizenChallenge.countDocuments({ isDeleted: { $ne: true } }),
      CitizenChallenge.countDocuments({ isDeleted: { $ne: true }, status: { $in: ['Resolved', 'Completed', 'Deployed'] } }),
      CitizenChallenge.countDocuments({
        isDeleted: { $ne: true },
        status: { $in: ['In Progress', 'Under Review', 'Accepted', 'Assigned', 'Clarified', 'Clarification Requested', 'Submitted'] }
      }),
      MongooseUser.countDocuments({ role: 'CITIZEN' }),
      MongooseIndustry.aggregate([
        {
          $group: {
            _id: null,
            totalCsrFundsCr: { $sum: '$financials.csrCommittedCr' },
            totalProjects: { $sum: '$financials.supportedProjectsCount' },
            totalLabs: { $sum: '$financials.labsCount' }
          }
        }
      ]),
      grantFundService.getFundsOverview(),
      UniversityProject.find({ isDeleted: { $ne: true } }).lean(),
      MongooseUniversity.aggregate([{ $group: { _id: '$district', count: { $sum: 1 } } }]),
      MongooseIndustry.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      CitizenChallenge.aggregate([
        { $match: { isDeleted: { $ne: true } } },
        { $group: { _id: '$domain', count: { $sum: 1 } } }
      ]),
      MongooseUniversity.find({ isDeleted: { $ne: true } }).select('name code district status').limit(10).lean(),
      CitizenChallenge.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 }).limit(10).lean()
    ]);

    const financials = industryFinancials[0] || { totalCsrFundsCr: 0, totalProjects: 0, totalLabs: 0 };
    const stateGrantsTotal = fundsOverview?.stateGrantsTotal || 0;
    const stateGrantsTotalCr = stateGrantsTotal / 10000000;
    const totalCommittedCorpus = stateGrantsTotal + ((financials.totalCsrFundsCr || 0) * 10000000);
    const totalInnovationCorpusCr = Number(((financials.totalCsrFundsCr || 0) + stateGrantsTotalCr).toFixed(2));

    let totalDisbursedFunds = 0;
    projectList.forEach((p) => {
      if (p.disbursedAmount) {
        const num = Number(String(p.disbursedAmount).replace(/[^\d.]/g, '')) || 0;
        totalDisbursedFunds += num;
      }
    });

    const availableInnovationCorpus = Math.max(0, totalCommittedCorpus - totalDisbursedFunds);
    const availableInnovationCorpusCr = Number((availableInnovationCorpus / 10000000).toFixed(2));
    const resolutionRate = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

    // Map top HEIs with actual active projects count and solved challenges
    const topHeis = topHeisList.map((hei) => {
      const activeProjects = projectList.filter((p) => p.universityCode === hei.code || p.universityId === String(hei._id)).length;
      const solvedChallenges = recentChallenges.filter(
        (c) => (c.assignedUniversity?.id === String(hei._id) || c.assignedUniversity?.code === hei.code) && ['Resolved', 'Completed', 'Deployed'].includes(c.status)
      ).length;
      return {
        id: String(hei._id),
        name: hei.name,
        code: hei.code,
        district: hei.district || 'Jharkhand',
        activeProjects,
        projects: activeProjects,
        solvedChallenges,
        solved: solvedChallenges
      };
    });

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        heis: { active: activeHeis, total: totalHeis },
        industries: { active: activeIndustries, total: totalIndustries },
        admins: { active: activeAdmins },
        problems: {
          total: totalProblems,
          received: totalProblems,
          solved: solvedProblems,
          inProgress: inProgressProblems,
          resolutionRate
        },
        citizens: { total: totalCitizens },
        financials: {
          totalCsrFundsCr: Number((financials.totalCsrFundsCr || 0).toFixed(2)),
          stateGrantsTotalCr: Number(stateGrantsTotalCr.toFixed(2)),
          stateGrantsTotal,
          totalInnovationCorpusCr,
          availableInnovationCorpus,
          availableInnovationCorpusCr,
          totalDisbursedFunds,
          totalProjects: financials.totalProjects || 0,
          verifiedLabs: financials.totalLabs || 0
        },
        heisByDistrict,
        industriesByCategory,
        sectors: sectorsAgg.map((s) => ({ name: s._id || 'Other', count: s.count })),
        topHeis,
        recentChallenges
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
