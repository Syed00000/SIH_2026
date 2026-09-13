import { GovernmentGrantFund } from './model.js';
import { MongooseIndustry } from '../industries/infrastructure/model.js';

export class GrantFundService {
  async getFundsOverview() {
    const [fundList, industryAgg] = await Promise.all([
      GovernmentGrantFund.find({ status: 'Active' }).sort({ allocationDate: -1 }).lean(),
      MongooseIndustry.aggregate([{ $group: { _id: null, totalCsrCr: { $sum: '$financials.csrCommittedCr' } } }])
    ]);

    const inflows = fundList.filter((f) => f.fundType === 'CORPUS_INFLOW' || f.fundId === 'GGF-122380' || (!f.departmentId && f.department === 'State Department'));
    const allocations = fundList.filter((f) => f.fundType === 'DEPARTMENT_ALLOCATION' || (f.fundId !== 'GGF-122380' && (f.departmentId || f.department !== 'State Department')));

    const totalCommittedInflows = inflows.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const totalAllocatedToDepts = allocations.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);

    const stateGrantsTotal = Math.max(0, totalCommittedInflows - totalAllocatedToDepts);
    const corporateCsrTotalCr = industryAgg[0]?.totalCsrCr || 0;
    const corporateCsrTotal = corporateCsrTotalCr * 10000000;
    const totalJointCorpus = stateGrantsTotal + corporateCsrTotal;

    return {
      stateGrantsTotal,
      totalCommittedInflows,
      totalAllocatedToDepts,
      corporateCsrTotal,
      corporateCsrTotalCr,
      totalJointCorpus,
      fundEntries: allocations.length > 0 ? allocations : fundList
    };
  }

  async createGrantFund(data) {
    const { amount, title, scheme, department, sanctionOrderNo, financialYear, allocatedBy, description, fundType } = data;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      throw new Error('A valid grant allocation amount greater than ₹0 is required.');
    }

    const isCorpusInflow = fundType === 'CORPUS_INFLOW' || data.isCorpusInflow;
    if (!isCorpusInflow) {
      const currentOverview = await this.getFundsOverview();
      if (currentOverview.stateGrantsTotal < parsedAmount) {
        throw new Error(`Insufficient State Innovation Pool balance: Available is ₹${currentOverview.stateGrantsTotal.toLocaleString('en-IN')}, requested allocation is ₹${parsedAmount.toLocaleString('en-IN')}.`);
      }
    }

    // Atomically synchronize State Department pool balance
    let targetDept = null;
    try {
      const { Department } = await import('../departments/infrastructure/department.schema.js');
      if (data.departmentId) {
        targetDept = await Department.findOne({ deptId: data.departmentId });
        if (!targetDept && /^[0-9a-fA-F]{24}$/.test(data.departmentId)) {
          targetDept = await Department.findById(data.departmentId);
        }
      }
      if (!targetDept && data.department) {
        targetDept = await Department.findOne({ name: data.department });
      }
      if (!targetDept) {
        targetDept = await Department.findOne({ category: 'State Ministry' }) || await Department.findOne({ deptId: 'DEPT-JH-STATE' });
      }
      if (targetDept) {
        const cur = Number(targetDept.allocatedFundPool) || 0;
        targetDept.allocatedFundPool = cur + parsedAmount;
        await targetDept.save();

        if (targetDept.deptId !== 'DEPT-JH-STATE') {
          const apex = await Department.findOne({ deptId: 'DEPT-JH-STATE' });
          if (apex) {
            apex.allocatedFundPool = Math.max(0, (Number(apex.allocatedFundPool) || 0) - parsedAmount);
            await apex.save();
          }
        }
      }
    } catch (deptErr) {
      console.warn('Could not update state department pool:', deptErr.message);
    }

    const fundId = `GGF-${Date.now().toString().slice(-6)}`;
    const newFund = await GovernmentGrantFund.create({
      fundId,
      title: title || (targetDept ? `State Innovation Allocation to ${targetDept.name}` : 'State Innovation Council R&D Grant Allocation'),
      scheme: scheme || 'Jharkhand State Innovation Council R&D Allocation',
      department: targetDept?.name || department || 'Department of Higher & Technical Education',
      departmentId: targetDept?.deptId || data.departmentId || '',
      departmentCategory: targetDept?.category || data.departmentCategory || 'State Ministry',
      targetDeptCode: targetDept?.code || '',
      fundType: isCorpusInflow ? 'CORPUS_INFLOW' : 'DEPARTMENT_ALLOCATION',
      amount: parsedAmount,
      sanctionOrderNo: sanctionOrderNo || `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      financialYear: financialYear || '2026-2027',
      allocationDate: new Date(),
      allocatedBy: allocatedBy || 'Principal Secretary, Govt of Jharkhand',
      description: description || `State budgetary grant allocation to ${targetDept?.name || department || 'Department'}.`,
      status: 'Active'
    });

    const overview = await this.getFundsOverview();

    return {
      createdFund: newFund,
      stateGrantsTotal: overview.stateGrantsTotal,
      targetDepartment: targetDept ? {
        deptId: targetDept.deptId,
        name: targetDept.name,
        category: targetDept.category,
        newBalance: targetDept.allocatedFundPool
      } : null
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
