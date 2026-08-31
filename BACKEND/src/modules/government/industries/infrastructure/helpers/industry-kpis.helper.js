export async function computeIndustryKpis(MongooseIndustry) {
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
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          projects: { $sum: '$financials.supportedProjectsCount' },
          labs: { $sum: '$financials.labsCount' }
        }
      },
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

export default computeIndustryKpis;
