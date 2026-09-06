import { GovernmentGrantPayment } from './model.js';
import { UniversityProject } from '../../university/infrastructure/model.js';
import { CitizenChallenge } from '../../citizen/infrastructure/model.js';
import { syncGrantSanctionAndDisbursal } from './grant-stage-sync.helper.js';

export class GovernmentLedgerService {
  async getLedger() {
    try {
      const payments = await GovernmentGrantPayment.find({}).sort({ timestamp: -1 }).lean();
      return payments.map((p) => ({
        id: p.paymentId,
        paymentId: p.paymentId,
        txId: `LED-${p.paymentId.replace(/\D/g, '').slice(-4) || '001'}`,
        payer: p.payer || 'Govt State Treasury (PFMS Escrow)',
        payee: p.payee,
        amount: p.amount,
        rawAmount: p.rawAmount,
        disbursedAmount: p.disbursedAmount,
        mode: p.mode || 'Direct PFMS',
        utr: p.utrNumber,
        utrNumber: p.utrNumber,
        makerCheckerSign: p.makerCheckerSign || 'Verified & Approved',
        makerCheckerStatus: p.makerCheckerStatus || 'Approved',
        bankAck: p.bankAckStatus || 'Credited to University Escrow',
        bankAckStatus: p.bankAckStatus || 'Credited to University Escrow',
        bankStatus: p.bankStatus || 'success',
        scheme: p.scheme || 'Jharkhand State Innovation Grant',
        project: p.projectTitle || p.projectRef,
        tracking: p.purpose || 'Grant Tranche Disbursal',
        projectRef: p.projectRef,
        challengeId: p.challengeId || '',
        timestamp: p.timestamp ? new Date(p.timestamp).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN'),
        createdAt: p.createdAt || p.timestamp
      }));
    } catch {
      return [];
    }
  }

  async createPayment(data) {
    const rawVal = Number(data.rawAmount) || Number(String(data.amount || '0').replace(/[^\d]/g, ''));
    const formattedAmt = data.amount || `₹ ${rawVal.toLocaleString('en-IN')}`;
    const paymentId = data.id || data.paymentId || `PAY-${Math.floor(90000 + Math.random() * 9999)}`;
    const utr = data.utrNumber || data.utr || `JH-PFMS-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const pRef = data.projectRef || data.projectId || '';
    let projTitle = data.projectTitle || data.project || 'Citizen Innovation Project';
    let chalId = data.challengeId || '';

    if (pRef) {
      const proj = await UniversityProject.findOne({
        $or: [{ projectId: pRef }, { challengeId: pRef }, { _id: pRef.match(/^[0-9a-fA-F]{24}$/) ? pRef : null }]
      }).lean();
      if (proj) {
        projTitle = proj.title || projTitle;
        chalId = proj.challengeId || chalId;
      }
    }

    const { GovernmentGrantFund } = await import('./model.js');
    const fundList = await GovernmentGrantFund.find({ status: 'Active' }).lean();
    const stateGrantsTotal = fundList.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    const existingPayments = await GovernmentGrantPayment.find({}).lean();
    const totalDisbursed = existingPayments
      .filter((p) => p.makerCheckerStatus === 'Approved' || p.bankStatus === 'success')
      .reduce((sum, p) => sum + (Number(p.rawAmount) || 0), 0);

    const availableFund = Math.max(0, stateGrantsTotal - totalDisbursed);
    if (stateGrantsTotal > 0 && availableFund < rawVal) {
      const err = new Error(`Low Budget Error: Insufficient State Grant Fund. Available treasury balance is ₹ ${availableFund.toLocaleString('en-IN')}, but required payment is ₹ ${rawVal.toLocaleString('en-IN')}. Please allocate State Grant Funds before disbursal.`);
      err.statusCode = 400;
      throw err;
    }

    const newPayment = await GovernmentGrantPayment.create({
      paymentId,
      payer: data.payer || 'Govt State Treasury (PFMS Escrow)',
      payee: data.payee || 'Ranchi University (RU001)',
      amount: formattedAmt,
      rawAmount: rawVal,
      disbursedAmount: formattedAmt,
      mode: data.mode || 'Direct PFMS',
      utrNumber: utr,
      makerCheckerSign: data.makerCheckerSign || 'Authorized by State Nodal Officer',
      makerCheckerStatus: data.makerCheckerStatus || 'Approved',
      bankAckStatus: data.bankAckStatus || 'Credited to University Escrow',
      bankStatus: data.bankStatus || 'success',
      scheme: data.scheme || 'Jharkhand State Innovation Grant',
      projectRef: pRef,
      projectTitle: projTitle,
      challengeId: chalId,
      tdsAmount: data.tdsAmount || '₹ 0',
      netDisbursed: data.netDisbursed || formattedAmt,
      purpose: data.purpose || 'Direct State Grant Tranche Disbursal',
      timestamp: new Date()
    });

    // Update University Project, Citizen Challenge, Approvals & Notifications across all stages
    if (pRef) {
      await syncGrantSanctionAndDisbursal({
        projectId: pRef,
        challengeId: chalId,
        rawAmount: rawVal,
        formattedAmount: formattedAmt,
        utrNumber: utr,
        sanctionOrderNo: data.sanctionOrderNo || '',
        payee: data.payee || ''
      }).catch((err) => console.warn('syncGrantSanctionAndDisbursal warning:', err));
    }

    return newPayment;
  }

  async authorizePayment(paymentId) {
    const query = paymentId.startsWith('PAY-') ? { paymentId } : { _id: paymentId };
    return await GovernmentGrantPayment.findOneAndUpdate(
      query,
      { $set: { makerCheckerStatus: 'Approved', makerCheckerSign: 'Verified & Approved' } },
      { new: true }
    );
  }

  async clearLedger() {
    await GovernmentGrantPayment.deleteMany({});
    return { success: true, message: 'All ledger transactions cleared' };
  }

  async getUtilizationAndCompliance() {
    const [projects, payments, challenges] = await Promise.all([
      UniversityProject.find({ isDeleted: { $ne: true } }).lean(),
      GovernmentGrantPayment.find({}).lean(),
      CitizenChallenge.find({}).lean()
    ]);

    const challengeMap = new Map();
    challenges.forEach((c) => challengeMap.set(c.challengeId, c));

    const realProjects = projects.map((p) => {
      const chl = challengeMap.get(p.challengeId) || {};
      const projPayments = payments.filter((pay) => pay.projectRef === p.projectId || pay.challengeId === p.challengeId);
      const totalDisbursedNum = projPayments.reduce((s, pay) => s + (pay.rawAmount || 0), 0);

      return {
        projectId: p.projectId,
        challengeId: p.challengeId,
        title: p.title || chl.title || 'Citizen Problem Statement',
        citizenProblem: chl.title || p.title,
        domain: p.domain || chl.domain || 'Urban Development',
        district: p.district || chl.district || 'Ranchi',
        universityName: p.universityName || 'Ranchi University (RU001)',
        budget: p.budget || p.proposedBudget || '₹ 80,000',
        disbursedAmount: totalDisbursedNum > 0 ? `₹ ${totalDisbursedNum.toLocaleString('en-IN')}` : p.disbursedAmount || '₹ 0',
        budgetStatus: p.budgetStatus || 'Pending Review',
        milestones: p.milestones || [],
        milestonesCompleted: p.milestonesCompleted || 0,
        progressPercentage: p.progressPercentage || (totalDisbursedNum > 0 ? 50 : 25),
        budgetBreakdown: p.budgetBreakdown || [],
        methodology: p.methodology || '',
        paymentsCount: projPayments.length,
        hasDisbursal: totalDisbursedNum > 0 || Boolean(p.disbursedAmount && p.disbursedAmount !== '₹ 0')
      };
    });

    return { projects: realProjects, paymentsCount: payments.length };
  }
}

export const governmentLedgerService = new GovernmentLedgerService();
export default governmentLedgerService;
