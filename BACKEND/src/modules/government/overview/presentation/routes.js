import { Router } from 'express';
import { MongooseUniversity } from '../../heis/infrastructure/model.js';
import { MongooseIndustry } from '../../industries/infrastructure/model.js';
import { MongooseAdmin } from '../../admins/infrastructure/model.js';
import { MongooseUser } from '../../../users/infrastructure/model.js';
import { GovernmentGrantFund } from '../../grants/model.js';

import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { UniversityProject } from '../../../university/infrastructure/model.js';

const router = Router();

router.get('/', (req, res, next) => {
  req.url = '/stats';
  router.handle(req, res, next);
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
      totalCitizens,
      industryFinancials,
      stateGrantFunds,
      projectList,
      heisByDistrict,
      industriesByCategory
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
      GovernmentGrantFund.find({ status: 'Active' }).lean(),
      UniversityProject.find({ isDeleted: { $ne: true } }).lean(),
      MongooseUniversity.aggregate([
        { $group: { _id: '$district', count: { $sum: 1 } } }
      ]),
      MongooseIndustry.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    const financials = industryFinancials[0] || { totalCsrFundsCr: 0, totalProjects: 0, totalLabs: 0 };
    const stateGrantsTotal = stateGrantFunds.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
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

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        heis: {
          active: activeHeis,
          total: totalHeis
        },
        industries: {
          active: activeIndustries,
          total: totalIndustries
        },
        admins: {
          active: activeAdmins
        },
        problems: {
          total: totalProblems,
          received: totalProblems
        },
        citizens: {
          total: totalCitizens
        },
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
        industriesByCategory
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
