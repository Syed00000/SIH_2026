import { IndustryFund, IndustryDisbursement } from './model.js';
import { MongooseUniversity } from '../../government/heis/infrastructure/model.js';
import { MongooseIndustry } from '../../government/industries/infrastructure/model.js';
import { UniversityIndustryRequest, UniversityProject, UniversityActivity } from '../../university/infrastructure/model.js';
import { syncAllApprovedIndustryProjects } from '../../university/infrastructure/helpers/industry-project-sync.helper.js';

const DEFAULT_CATEGORY_COLORS = {
  'Research Funding': '#007A61',
  'Prototype Funding': '#3b82f6',
  'Lab & Equipment': '#8b5cf6',
  'Pilot Funding': '#f59e0b',
  'CSR Support': '#10b981'
};

export class IndustryFundService {
  /**
   * Fetches real industry profile from MongooseIndustry
   */
  async getIndustryProfile({ userId, email, industryName } = {}) {
    let query = {};
    if (userId) {
      query = { userId };
    } else if (email) {
      query = { officialEmail: email.toLowerCase().trim() };
    } else if (industryName) {
      query = { legalName: new RegExp(industryName.trim(), 'i') };
    }

    let industry = await MongooseIndustry.findOne(query).lean();
    if (!industry) {
      // Fallback to any active industry or default
      industry = await MongooseIndustry.findOne({ status: 'Active' }).lean();
    }

    try {
      await syncAllApprovedIndustryProjects();
    } catch (e) {
      console.warn('Sync industry projects warning:', e);
    }

    const [activeProjectsCount, collaborationsCount, fundsAgg] = await Promise.all([
      UniversityProject.countDocuments({ status: { $in: ['In Progress', 'Testing', 'Prototype', 'Active'] }, isDeleted: { $ne: true } }),
      UniversityIndustryRequest.countDocuments({ status: 'Approved' }),
      IndustryFund.aggregate([
        { $match: { status: 'Active' } },
        { $group: { _id: null, totalCommitted: { $sum: '$allocatedAmount' }, totalDisbursed: { $sum: '$utilizedAmount' } } }
      ])
    ]);

    const totalCommitted = fundsAgg[0]?.totalCommitted || 0;
    const totalDisbursed = fundsAgg[0]?.totalDisbursed || 0;

    return {
      industry: industry || null,
      stats: {
        activeProjectsCount,
        collaborationsCount,
        totalCommitted,
        totalDisbursed,
        totalCommittedFormatted: totalCommitted >= 10000000 
          ? `₹ ${(totalCommitted / 10000000).toFixed(2)} Cr`
          : `₹ ${(totalCommitted / 100000).toFixed(2)} L`
      }
    };
  }

  /**
   * Returns live overview of all funds, disbursements, real university requests, and eligible HEIs
   */
  async getFundsOverview({ industryName, userId, email } = {}) {
    try {
      await syncAllApprovedIndustryProjects();
    } catch (e) {
      console.warn('Sync industry projects warning in getFundsOverview:', e);
    }

    // 1. Fetch real Industry Funds
    const funds = await IndustryFund.find({ status: { $ne: 'Closed' } }).sort({ createdAt: -1 }).lean();

    // 2. Fetch real Disbursements Ledger
    const disbursements = await IndustryDisbursement.find({}).sort({ disbursedAt: -1 }).lean();

    // 3. Fetch real University Collaboration & Funding Requests from MongoDB
    const realReqs = await UniversityIndustryRequest.find({}).sort({ submittedAt: -1 }).lean();

    // 4. Fetch real registered Universities in Jharkhand
    const realUniversities = await MongooseUniversity.find({ status: { $ne: 'Disabled' } }).lean();

    // 5. Fetch real University Projects to link with universities
    const allProjects = await UniversityProject.find({ isDeleted: { $ne: true } }).lean();

    // Map eligible universities with their real active projects
    const availableUniversities = realUniversities.map((u) => {
      const uniProjects = allProjects.filter(
        (p) => p.universityCode === u.code || String(p.universityId) === String(u._id)
      );

      return {
        code: u.code,
        name: u.name,
        district: u.district || u.address?.district || 'Jharkhand',
        officialEmail: u.universityEmail || u.officialEmail || '',
        phone: u.universityPhone || '',
        activeProjects: uniProjects.map((p) => ({
          id: p.projectId || String(p._id),
          title: p.title,
          sanctionedBudget: p.sanctionedBudget || p.proposedBudget || '₹ 0',
          disbursedAmount: p.disbursedAmount || '₹ 0',
          status: p.status || 'Proposal Stage'
        }))
      };
    });

    // Map incoming requests directly from DB
    const incomingRequests = realReqs.map((r) => {
      const numAmt = Number(String(r.estimatedBudget || '').replace(/[^\d]/g, '')) || 0;
      return {
        _id: r._id,
        requestId: r.requestId,
        universityCode: r.universityCode,
        universityName: r.universityName || (r.universityCode === 'RU001' ? 'Ranchi University' : r.universityCode),
        projectTitle: r.projectTitle,
        projectId: r.projectId || '',
        partnerName: r.partnerName,
        fundingRequested: Boolean(r.fundingRequested),
        labAccessRequested: Boolean(r.labAccessRequested),
        mentorshipRequested: Boolean(r.mentorshipRequested),
        problemStatement: r.problemStatement || r.executionOutcome || '',
        challengeId: r.challengeId || '',
        executionOutcome: r.executionOutcome || '',
        labChargesQuoted: r.labChargesQuoted || '',
        quoteTerms: r.quoteTerms || '',
        quoteStatus: r.quoteStatus || '',
        testingStages: r.testingStages || [],
        estimatedBudget: r.estimatedBudget ? `₹ ${numAmt.toLocaleString('en-IN')}` : '₹ 0',
        amountNumber: numAmt,
        duration: r.duration || '3 Months',
        facultyName: r.facultyName || 'Nodal Faculty Coordinator',
        studentTeam: r.studentTeam || 'University Research Team',
        status: r.status || 'Pending',
        submittedAt: r.submittedAt || r.createdAt
      };
    });

    // Compute live metrics
    const totalCommitted = funds.reduce((acc, f) => acc + (Number(f.allocatedAmount) || 0), 0);
    const totalDisbursed = funds.reduce((acc, f) => acc + (Number(f.utilizedAmount) || 0), 0);
    const totalRemaining = funds.reduce((acc, f) => acc + (Number(f.remainingAmount) || 0), 0);

    const categories = ['Research Funding', 'Prototype Funding', 'Lab & Equipment', 'Pilot Funding', 'CSR Support'];
    const distribution = categories.map((cat) => {
      const catFunds = funds.filter((f) => f.category === cat);
      const allocated = catFunds.reduce((sum, f) => sum + (Number(f.allocatedAmount) || 0), 0);
      const utilized = catFunds.reduce((sum, f) => sum + (Number(f.utilizedAmount) || 0), 0);
      const remaining = catFunds.reduce((sum, f) => sum + (Number(f.remainingAmount) || 0), 0);
      const pct = totalCommitted > 0 ? Math.round((allocated / totalCommitted) * 100) : 0;
      return {
        name: cat,
        allocated,
        utilized,
        remaining,
        value: Number((allocated / 100000).toFixed(2)),
        color: DEFAULT_CATEGORY_COLORS[cat] || '#007A61',
        percentage: `${pct}%`
      };
    });

    const totalCommittedCr = (totalCommitted / 10000000).toFixed(2);
    const totalCommittedFormatted = totalCommitted >= 10000000 ? `${totalCommittedCr} Cr` : `₹ ${(totalCommitted / 100000).toFixed(2)} L`;

    const acceptedRequests = realReqs.filter((r) => {
      if (r.status !== 'Approved') return false;
      if (r.labChargesQuoted && r.quoteStatus !== 'Accepted') return false;
      return true;
    });

    const acceptedProjectIds = new Set(acceptedRequests.map((r) => r.projectId).filter(Boolean));
    const acceptedTitles = new Set(acceptedRequests.map((r) => r.projectTitle?.toLowerCase()).filter(Boolean));

    const activeProjects = allProjects
      .filter((p) => {
        const idMatch = p.projectId && acceptedProjectIds.has(p.projectId);
        const titleMatch = p.title && acceptedTitles.has(p.title?.toLowerCase());
        const hasAcceptedQuote = p.quoteStatus === 'Accepted';
        return (idMatch || titleMatch || hasAcceptedQuote) && (!p.labChargesQuoted || p.quoteStatus === 'Accepted');
      })
      .map((p) => {
        const uni = realUniversities.find((u) => u.code === p.universityCode || String(u._id) === String(p.universityId));
        const matchedReq = acceptedRequests.find((r) => (p.projectId && r.projectId === p.projectId) || r.projectTitle?.toLowerCase() === p.title?.toLowerCase());
        return {
          id: p.projectId || String(p._id),
          projectId: p.projectId,
          requestId: matchedReq?.requestId || '',
          title: p.title,
          university: uni?.name || (p.universityCode === 'RU001' ? 'Ranchi University' : p.universityCode),
          universityCode: p.universityCode,
          stage: p.status || 'In Progress',
          budget: p.labChargesQuoted || p.sanctionedBudget || p.proposedBudget || '₹ 0',
          disbursed: p.disbursedAmount || '₹ 0',
          status: p.disbursedAmount && p.disbursedAmount !== '₹ 0' ? 'Funded' : 'Active',
          leadMentor: p.leadMentor || p.facultyMentor?.name || 'Faculty Nodal Officer',
          studentTeam: p.studentTeam || 'Student Innovation Team',
          problemStatement: p.problemStatement || '',
          labChargesQuoted: p.labChargesQuoted || matchedReq?.labChargesQuoted || '',
          quoteStatus: p.quoteStatus || matchedReq?.quoteStatus || '',
          quoteTerms: p.quoteTerms || matchedReq?.quoteTerms || '',
          testingStages: p.testingStages || matchedReq?.testingStages || [],
          deadline: p.deadline || '3 Months'
        };
      });

    return {
      totalCommitted,
      totalCommittedFormatted,
      totalDisbursed,
      totalRemaining,
      distribution,
      funds,
      disbursements,
      incomingRequests,
      availableUniversities,
      activeProjects
    };
  }

  async createFund(data) {
    const { title, category, amount, financialYear, sanctionOrderNo, description, industryName } = data;
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      throw new Error('Please enter a valid grant allocation amount greater than ₹0.');
    }

    const fundId = `IND-FUND-${Date.now().toString().slice(-6)}`;
    const newFund = await IndustryFund.create({
      fundId,
      industryId: 'IND-DEFAULT',
      industryName: industryName || 'Ariba Research Labs',
      title: title || `${category} Grant Allocation`,
      category: category || 'Research Funding',
      allocatedAmount: parsedAmount,
      utilizedAmount: 0,
      remainingAmount: parsedAmount,
      financialYear: financialYear || '2026-2027',
      sanctionOrderNo: sanctionOrderNo || `ARL-GRANT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      description: description || 'Company capital allocation for university innovation projects.',
      status: 'Active'
    });

    return {
      success: true,
      fund: newFund,
      overview: await this.getFundsOverview({ industryName })
    };
  }

  async updateFund(id, data) {
    const query = id.startsWith('IND-FUND-') ? { fundId: id } : { _id: id };
    const fund = await IndustryFund.findOne(query);
    if (!fund) throw new Error('Fund entry not found.');

    if (data.amount !== undefined) {
      const newAmount = Number(data.amount);
      if (newAmount < fund.utilizedAmount) {
        throw new Error(`Allocated amount cannot be less than already disbursed amount (₹ ${fund.utilizedAmount.toLocaleString('en-IN')}).`);
      }
      fund.allocatedAmount = newAmount;
      fund.remainingAmount = fund.allocatedAmount - fund.utilizedAmount;
    }

    if (data.title) fund.title = data.title;
    if (data.category) fund.category = data.category;
    if (data.sanctionOrderNo) fund.sanctionOrderNo = data.sanctionOrderNo;
    if (data.financialYear) fund.financialYear = data.financialYear;
    if (data.description !== undefined) fund.description = data.description;

    fund.status = fund.remainingAmount <= 0 ? 'Depleted' : 'Active';
    await fund.save();

    return { success: true, fund };
  }

  async deleteFund(id) {
    const query = id.startsWith('IND-FUND-') ? { fundId: id } : { _id: id };
    const fund = await IndustryFund.findOne(query);
    if (!fund) throw new Error('Fund entry not found.');

    if (fund.utilizedAmount > 0) {
      throw new Error(`Cannot delete fund "${fund.title}" as ₹ ${fund.utilizedAmount.toLocaleString('en-IN')} has already been disbursed to universities.`);
    }

    await IndustryFund.deleteOne(query);
    return { success: true, message: 'Fund allocation deleted successfully.' };
  }

  /**
   * Disburses grant from an industry fund pool to a university/project.
   * Automatically deducts the amount from fund.remainingAmount.
   */
  async disburseFund(data) {
    const {
      fundId,
      universityCode,
      universityName,
      projectTitle,
      projectId,
      requestId,
      amount,
      mode,
      utrNumber,
      purpose,
      industryName = 'Ariba Research Labs'
    } = data;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      throw new Error('Please enter a valid disbursement amount greater than ₹0.');
    }

    const query = fundId?.startsWith?.('IND-FUND-') ? { fundId } : { _id: fundId };
    const fund = await IndustryFund.findOne(query);
    if (!fund) {
      throw new Error('Selected source fund pool was not found. Please allocate an industry fund first.');
    }

    if (fund.remainingAmount < parsedAmount) {
      throw new Error(
        `Insufficient balance in ${fund.title}. Available: ₹ ${fund.remainingAmount.toLocaleString('en-IN')}, Requested: ₹ ${parsedAmount.toLocaleString('en-IN')}.`
      );
    }

    // 1. DEDUCT MONEY FROM SOURCE FUND POOL
    fund.utilizedAmount += parsedAmount;
    fund.remainingAmount = fund.allocatedAmount - fund.utilizedAmount;
    if (fund.remainingAmount <= 0) {
      fund.status = 'Depleted';
    }
    await fund.save();

    // 2. RECORD IN DISBURSEMENT LEDGER
    const disbursementId = `IND-DISB-${Date.now().toString().slice(-6)}`;
    const finalUtr = utrNumber || `CORP-ESCROW-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newDisbursement = await IndustryDisbursement.create({
      disbursementId,
      fundId: fund.fundId,
      fundTitle: fund.title,
      category: fund.category,
      industryId: fund.industryId || 'IND-DEFAULT',
      industryName: fund.industryName || industryName,
      universityCode: universityCode || 'RU001',
      universityName: universityName || 'Ranchi University',
      projectId: projectId || '',
      projectTitle: projectTitle || 'University R&D Project',
      requestId: requestId || '',
      amount: parsedAmount,
      mode: mode || 'Direct Corporate Escrow',
      utrNumber: finalUtr,
      purpose: purpose || `Grant Tranche from ${fund.title}`,
      status: 'Disbursed',
      disbursedAt: new Date()
    });

    // 3. UPDATE REAL UNIVERSITY INDUSTRY REQUEST IN MONGODB
    if (requestId) {
      try {
        await UniversityIndustryRequest.findOneAndUpdate(
          { $or: [{ requestId }, { _id: requestId.match(/^[0-9a-fA-F]{24}$/) ? requestId : null }] },
          { $set: { status: 'Approved', fundedAmount: parsedAmount, utrNumber: finalUtr, disbursedAt: new Date() } }
        );
      } catch (e) {
        console.warn('Could not update UniversityIndustryRequest in MongoDB:', e);
      }
    }

    // 4. UPDATE REAL UNIVERSITY PROJECT IN MONGODB
    if (projectId || projectTitle) {
      try {
        const query = projectId 
          ? { $or: [{ projectId }, { _id: projectId.match(/^[0-9a-fA-F]{24}$/) ? projectId : null }] }
          : { title: new RegExp(projectTitle.trim(), 'i') };

        const proj = await UniversityProject.findOne(query);
        if (proj) {
          const prevDisb = Number(String(proj.disbursedAmount || '0').replace(/[^\d]/g, '')) || 0;
          const totalDisb = prevDisb + parsedAmount;
          proj.disbursedAmount = `₹ ${totalDisb.toLocaleString('en-IN')}`;
          proj.budgetStatus = 'Industry Funded';
          proj.status = 'In Progress';
          await proj.save();
        }
      } catch (e) {
        console.warn('Could not update UniversityProject in MongoDB:', e);
      }
    }

    // 5. POST REAL UNIVERSITY ACTIVITY IN MONGODB
    try {
      await UniversityActivity.create({
        universityCode: universityCode || 'RU001',
        text: `${fund.industryName} disbursed industry grant of ₹ ${parsedAmount.toLocaleString('en-IN')} for "${projectTitle}" (UTR: ${finalUtr})`,
        type: 'grant',
        timestamp: new Date()
      });
    } catch (e) {
      console.warn('Could not record university activity:', e);
    }

    return {
      success: true,
      message: `Successfully disbursed ₹ ${parsedAmount.toLocaleString('en-IN')} to ${universityName}. Amount deducted from "${fund.title}".`,
      disbursement: newDisbursement,
      updatedFund: fund
    };
  }

  async approveAndFundRequest(data) {
    const { requestId, fundId, amount, universityCode, universityName, projectTitle, utrNumber, mode, purpose } = data;
    return await this.disburseFund({
      fundId,
      requestId,
      amount,
      universityCode,
      universityName,
      projectTitle,
      utrNumber,
      mode: mode || 'Direct Corporate Escrow',
      purpose: purpose || `Approved Funding for Request ${requestId}`
    });
  }
}

export const industryFundService = new IndustryFundService();
export default industryFundService;
