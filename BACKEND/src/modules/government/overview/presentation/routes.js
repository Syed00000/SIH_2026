import { Router } from 'express';
import { MongooseUniversity } from '../../heis/infrastructure/model.js';
import { MongooseIndustry } from '../../industries/infrastructure/model.js';
import { MongooseAdmin } from '../../admins/infrastructure/model.js';
import { MongooseUser } from '../../../users/infrastructure/model.js';

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
      totalCitizens,
      industryFinancials,
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
      MongooseUniversity.aggregate([
        { $group: { _id: '$district', count: { $sum: 1 } } }
      ]),
      MongooseIndustry.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ])
    ]);

    const financials = industryFinancials[0] || { totalCsrFundsCr: 0, totalProjects: 0, totalLabs: 0 };

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
        citizens: {
          total: totalCitizens
        },
        financials: {
          totalCsrFundsCr: Number((financials.totalCsrFundsCr || 0).toFixed(2)),
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
