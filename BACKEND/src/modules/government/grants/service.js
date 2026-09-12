import { GovernmentGrantFund } from './model.js';
import { MongooseIndustry } from '../industries/infrastructure/model.js';

export class GrantFundService {
  async getFundsOverview() {
    const [fundList, industryAgg] = await Promise.all([
      GovernmentGrantFund.find({ status: 'Active' }).sort({ allocationDate: -1 }).lean(),
      MongooseIndustry.aggregate([
        {
          $group: {
            _id: null,
            totalCsrCr: { $sum: '$financials.csrCommittedCr' }
          }
        }
      ])
    ]);

    const stateGrantsTotal = fundList.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const corporateCsrTotalCr = industryAgg[0]?.totalCsrCr || 0;
    const corporateCsrTotal = corporateCsrTotalCr * 10000000;
    const totalJointCorpus = stateGrantsTotal + corporateCsrTotal;

    return {
      stateGrantsTotal,
      corporateCsrTotal,
      corporateCsrTotalCr,
      totalJointCorpus,
      fundEntries: fundList
    };
  }

  async createGrantFund(data) {
    const { amount, title, scheme, department, sanctionOrderNo, financialYear, allocatedBy, description } = data;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      throw new Error('A valid grant allocation amount greater than ₹0 is required.');
    }

    const fundId = `GGF-${Date.now().toString().slice(-6)}`;
    const newFund = await GovernmentGrantFund.create({
      fundId,
      title: title || 'State Innovation Council R&D Grant Allocation',
      scheme: scheme || 'Jharkhand State Innovation Council R&D Allocation',
      department: department || 'Department of Higher & Technical Education',
      amount: parsedAmount,
      sanctionOrderNo: sanctionOrderNo || `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      financialYear: financialYear || '2026-2027',
      allocationDate: new Date(),
      allocatedBy: allocatedBy || 'Principal Secretary, Govt of Jharkhand',
      description: description || 'Budgetary allocation for university problem solving and lab prototyping grants.',
      status: 'Active'
    });

    const fundList = await GovernmentGrantFund.find({ status: 'Active' }).lean();
    const stateGrantsTotal = fundList.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    // Atomically synchronize State Department pool balance
    try {
      const { Department } = await import('../departments/infrastructure/department.schema.js');
      let targetDept = null;
      if (data.departmentId) {
        targetDept = await Department.findOne({ deptId: data.departmentId });
      }
      if (!targetDept) {
        targetDept = await Department.findOne({ category: 'State Ministry' }) || await Department.findOne({ deptId: 'DEPT-JH-STATE' });
      }
      if (targetDept) {
        const cur = Number(targetDept.allocatedFundPool) || 0;
        if (data.action === 'reset' || data.action === 'zero') {
          targetDept.allocatedFundPool = 0;
        } else if (data.action === 'deduct' || data.action === 'cancel') {
          targetDept.allocatedFundPool = Math.max(0, cur - parsedAmount);
        } else {
          targetDept.allocatedFundPool = cur + parsedAmount;
        }
        await targetDept.save();
      }
    } catch (deptErr) {
      console.warn('Could not update state department pool:', deptErr.message);
    }

    return {
      createdFund: newFund,
      stateGrantsTotal
    };
  }

  async updateGrantFund(id, data) {
    const query = id.startsWith('GGF-') ? { fundId: id } : { _id: id };
    const existing = await GovernmentGrantFund.findOne(query);
    if (!existing) return null;

    if (data.amount !== undefined) {
      const parsedAmount = Number(data.amount);
      if (!parsedAmount || parsedAmount <= 0) {
        throw new Error('Grant amount must be a positive number.');
      }
      const diff = parsedAmount - (Number(existing.amount) || 0);
      existing.amount = parsedAmount;
      try {
        const { Department } = await import('../departments/infrastructure/department.schema.js');
        const targetDept = await Department.findOne({ category: 'State Ministry' }) || await Department.findOne({ deptId: 'DEPT-JH-STATE' });
        if (targetDept) {
          targetDept.allocatedFundPool = Math.max(0, (Number(targetDept.allocatedFundPool) || 0) + diff);
          await targetDept.save();
        }
      } catch (deptErr) {
        console.warn('Could not adjust state pool:', deptErr.message);
      }
    }

    if (data.title) existing.title = data.title;
    if (data.scheme) existing.scheme = data.scheme;
    if (data.department) existing.department = data.department;
    if (data.sanctionOrderNo) existing.sanctionOrderNo = data.sanctionOrderNo;
    if (data.financialYear) existing.financialYear = data.financialYear;
    if (data.allocatedBy) existing.allocatedBy = data.allocatedBy;
    if (data.description !== undefined) existing.description = data.description;

    await existing.save();
    return existing;
  }

  async deleteGrantFund(id) {
    const query = id.startsWith('GGF-') ? { fundId: id } : { _id: id };
    const fund = await GovernmentGrantFund.findOne(query);
    if (fund) {
      try {
        const { Department } = await import('../departments/infrastructure/department.schema.js');
        const targetDept = await Department.findOne({ category: 'State Ministry' }) || await Department.findOne({ deptId: 'DEPT-JH-STATE' });
        if (targetDept) {
          targetDept.allocatedFundPool = Math.max(0, (Number(targetDept.allocatedFundPool) || 0) - (Number(fund.amount) || 0));
          await targetDept.save();
        }
      } catch (deptErr) {
        console.warn('Could not deduct on delete:', deptErr.message);
      }
    }
    return await GovernmentGrantFund.findOneAndDelete(query);
  }
}

export const grantFundService = new GrantFundService();
export default grantFundService;
