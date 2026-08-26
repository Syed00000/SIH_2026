import MongooseIndustry from './model.js';

export class IndustryRepository {
  async create(data) {
    const industry = new MongooseIndustry(data);
    return await industry.save();
  }

  async findById(id) {
    return await MongooseIndustry.findById(id).populate('userId', 'fullName email mobileNumber accountStatus role');
  }

  async findByIndustryId(industryId) {
    return await MongooseIndustry.findOne({ industryId: industryId.toUpperCase() });
  }

  async findByEmail(email) {
    const normalized = email.toLowerCase().trim();
    return await MongooseIndustry.findOne({
      $or: [
        { officialEmail: normalized },
        { 'credentials.loginEmail': normalized }
      ]
    });
  }

  async findAll({ search, category, thematicDomain, status, accessStatus, verificationStatus, district, page = 1, limit = 10 }) {
    const query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { industryId: searchRegex },
        { legalName: searchRegex },
        { shortName: searchRegex },
        { category: searchRegex },
        { thematicDomain: searchRegex },
        { officialEmail: searchRegex },
        { spocName: searchRegex },
        { registrationNumber: searchRegex }
      ];
    }

    if (category && category !== 'All' && category !== 'All Categories') {
      query.category = category;
    }

    if (thematicDomain && thematicDomain !== 'All' && thematicDomain !== 'All Domains') {
      query.thematicDomain = new RegExp(thematicDomain, 'i');
    }

    if (status && status !== 'All' && status !== 'All Status') {
      query.status = status;
    }

    if (accessStatus && accessStatus !== 'All') {
      query.accessStatus = accessStatus;
    }

    if (verificationStatus && verificationStatus !== 'All') {
      query.verificationStatus = verificationStatus;
    }

    if (district && district !== 'All' && district !== 'All Districts') {
      query['address.district'] = new RegExp(`^${district}$`, 'i');
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [records, total] = await Promise.all([
      MongooseIndustry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      MongooseIndustry.countDocuments(query)
    ]);

    return {
      records,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    };
  }

  async getKpis() {
    const [total, active, disabled, verified, pending, rejected, totalFinancials, categoryDistribution, topCsr] = await Promise.all([
      MongooseIndustry.countDocuments(),
      MongooseIndustry.countDocuments({ status: 'Active', accessStatus: 'Enabled' }),
      MongooseIndustry.countDocuments({ $or: [{ status: 'Disabled' }, { accessStatus: 'Disabled' }] }),
      MongooseIndustry.countDocuments({ verificationStatus: 'Verified' }),
      MongooseIndustry.countDocuments({ verificationStatus: 'Pending' }),
      MongooseIndustry.countDocuments({ verificationStatus: 'Rejected' }),
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
      MongooseIndustry.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, projects: { $sum: '$financials.supportedProjectsCount' }, labs: { $sum: '$financials.labsCount' } } },
        { $sort: { count: -1 } }
      ]),
      MongooseIndustry.find({ 'financials.csrCommittedCr': { $gt: 0 } }, 'financials.csrCommittedCr')
        .sort({ 'financials.csrCommittedCr': -1 })
        .limit(6)
        .lean()
    ]);

    const financials = totalFinancials[0] || { totalCsrFundsCr: 0, totalProjects: 0, totalLabs: 0 };
    const csrTrend = topCsr.map((c) => c.financials?.csrCommittedCr || 0);

    return {
      totalIndustries: total,
      activeIndustries: active,
      disabledIndustries: disabled,
      verifiedPartners: verified,
      pendingReview: pending,
      rejectedIndustries: rejected,
      totalCsrFundsCr: Number((financials.totalCsrFundsCr || 0).toFixed(2)),
      supportedProjects: financials.totalProjects || 0,
      verifiedLabs: financials.totalLabs || 0,
      csrTrend: csrTrend.length > 0 ? csrTrend : [],
      categoryDistribution: categoryDistribution || []
    };
  }

  async update(id, updateData) {
    return await MongooseIndustry.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  async addAuditLog(id, logEntry) {
    return await MongooseIndustry.findByIdAndUpdate(
      id,
      {
        $push: {
          auditLogs: {
            ...logEntry,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );
  }

  async delete(id) {
    return await MongooseIndustry.findByIdAndDelete(id);
  }

  async count() {
    return await MongooseIndustry.countDocuments();
  }

  async findLatestIndustry() {
    return await MongooseIndustry.findOne().sort({ createdAt: -1 });
  }
}

export const industryRepository = new IndustryRepository();
export default industryRepository;
