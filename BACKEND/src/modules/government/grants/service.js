import { GovernmentGrantFund } from './model.js';
import { MongooseIndustry } from '../industries/infrastructure/model.js';

export class GrantFundService {
  async getFundsOverview() {
    const [fundList, industryAgg] = await Promise.all([
      GovernmentGrantFund.find({ status: 'Active' }).sort({ allocationDate: -1 }).lean(),
      MongooseIndustry.aggregate([{ $group: { _id: null, totalCsrCr: { $sum: '$financials.csrCommittedCr' } } }])
    ]);

    const inflows = fundList.filter((f) =>
      f.fundType === 'CORPUS_INFLOW' || f.fundType === 'CORPUS_DEDUCTION' || f.departmentId === 'STATE_GOV' || f.department === 'Government of Jharkhand State Innovation Pool'
    );
    const allocations = fundList.filter((f) =>
      f.fundType === 'DEPARTMENT_ALLOCATION' || (!['CORPUS_INFLOW', 'CORPUS_DEDUCTION'].includes(f.fundType) && f.departmentId && f.departmentId !== 'STATE_GOV')
    );

    const totalCommittedInflows = Math.max(0, inflows.reduce((sum, f) => sum + (Number(f.amount) || 0), 0));
    const totalAllocatedToDepts = allocations.reduce((sum, f) => sum + (Number(f.amount) || 0), 0);
    const stateGrantsTotal = Math.max(0, totalCommittedInflows - totalAllocatedToDepts);
    const corporateCsrTotalCr = industryAgg[0]?.totalCsrCr || 0;
    const corporateCsrTotal = corporateCsrTotalCr * 10000000;
    const totalJointCorpus = stateGrantsTotal + corporateCsrTotal;

    return {
      stateGrantsTotal, totalCommittedInflows, totalAllocatedToDepts,
      corporateCsrTotal, corporateCsrTotalCr, totalJointCorpus,
      fundEntries: allocations, inflowEntries: inflows, allEntries: fundList
    };
  }

  async createGrantFund(data) {
    if (data.action === 'reset') {
      await GovernmentGrantFund.deleteMany({});
      await MongooseIndustry.updateMany({}, { $set: { 'financials.csrCommittedCr': 0 } });
      try {
        const { default: mongoose } = await import('mongoose');
        await mongoose.connection.db.collection('industry_disbursements').deleteMany({});
        await mongoose.connection.db.collection('industry_funds').deleteMany({});
      } catch {}
      return await this.getFundsOverview();
    }

    const { amount, title, scheme, department, sanctionOrderNo, financialYear, allocatedBy, description, fundType } = data;
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      throw new Error('A valid grant allocation amount greater than ₹0 is required.');
    }

    const isDeduction = data.action === 'deduct' || fundType === 'CORPUS_DEDUCTION';
    const isCorpusInflow = !isDeduction && fundType !== 'DEPARTMENT_ALLOCATION' && (fundType === 'CORPUS_INFLOW' || data.isCorpusInflow || data.action === 'add' || data.departmentId === 'STATE_GOV' || (!data.departmentId && !data.department));
    const currentOverview = await this.getFundsOverview();

    if (isDeduction) {
      if (currentOverview.stateGrantsTotal < parsedAmount) {
        throw new Error(`Insufficient State Pool balance: Available is ₹${currentOverview.stateGrantsTotal.toLocaleString('en-IN')}, requested deduction is ₹${parsedAmount.toLocaleString('en-IN')}.`);
      }
      const fundId = `GGF-${Date.now().toString().slice(-6)}`;
      const cleanTitle = title?.startsWith('Deduction') ? title : `Deduction: ${title || 'State Pool Deduction'}`;
      const newFund = await GovernmentGrantFund.create({
        fundId, title: cleanTitle, scheme: scheme || 'State Innovation & Problem Resolution Fund',
        department: 'Government of Jharkhand State Innovation Pool', departmentId: 'STATE_GOV',
        departmentCategory: 'State Ministry', fundType: 'CORPUS_DEDUCTION', amount: -parsedAmount,
        sanctionOrderNo: sanctionOrderNo || `JH-GOV-DEDUCT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        financialYear: financialYear || '2026-2027', allocationDate: new Date(), allocatedBy: allocatedBy || 'Principal Secretary, Govt of Jharkhand',
        description: description || 'State grant funds deducted from State Innovation Pool.', status: 'Active'
      });
      const overview = await this.getFundsOverview();
      return { createdFund: newFund, stateGrantsTotal: overview.stateGrantsTotal, targetDepartment: null };
    }

    if (!isCorpusInflow && currentOverview.stateGrantsTotal < parsedAmount) {
      throw new Error(`Insufficient State Innovation Pool balance: Available is ₹${currentOverview.stateGrantsTotal.toLocaleString('en-IN')}, requested is ₹${parsedAmount.toLocaleString('en-IN')}.`);
    }

    let targetDept = null;
    if (!isCorpusInflow) {
      try {
        const { Department } = await import('../departments/infrastructure/department.schema.js');
        if (data.departmentId) {
          targetDept = await Department.findOne({ deptId: data.departmentId }) || (/^[0-9a-fA-F]{24}$/.test(data.departmentId) ? await Department.findById(data.departmentId) : null);
        }
        if (!targetDept && data.department) {
          const cleanName = data.department.replace(/\(.*?\)/g, '').trim();
          targetDept = await Department.findOne({ name: { $regex: new RegExp(cleanName, 'i') } }) || await Department.findOne({ name: data.department });
        }
        if (targetDept) {
          const cur = Number(targetDept.allocatedFundPool) || 0;
          targetDept.allocatedFundPool = cur + parsedAmount;
          await targetDept.save();
          const { recordDepartmentAllocation } = await import('../departments/application/helpers/record-fund-allocation.helper.js');
          await recordDepartmentAllocation({
            deptId: targetDept.deptId, departmentName: targetDept.name, departmentCategory: targetDept.category,
            amount: parsedAmount, allocationType: 'STATE_GRANT', sourceDeptId: 'STATE_GOV',
            sourceDeptName: 'Government of Jharkhand (State Treasury)', previousBalance: cur,
            newBalance: targetDept.allocatedFundPool, sanctionOrderNo, scheme, purpose: description, allocatedBy
          });
        }
      } catch (deptErr) {
        console.warn('Could not update department pool:', deptErr.message);
      }
    }

    const fundId = `GGF-${Date.now().toString().slice(-6)}`;
    const newFund = await GovernmentGrantFund.create({
      fundId, title: title || (targetDept ? `State Innovation Allocation to ${targetDept.name}` : 'State Innovation Council R&D Grant Allocation'),
      scheme: scheme || 'Jharkhand State Innovation Council R&D Allocation',
      department: targetDept?.name || department || 'Department of Higher & Technical Education',
      departmentId: targetDept?.deptId || data.departmentId || '',
      departmentCategory: targetDept?.category || data.departmentCategory || 'State Ministry',
      targetDeptCode: targetDept?.code || '', fundType: isCorpusInflow ? 'CORPUS_INFLOW' : 'DEPARTMENT_ALLOCATION',
      amount: parsedAmount, sanctionOrderNo: sanctionOrderNo || `JH-GOV-RD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      financialYear: financialYear || '2026-2027', allocationDate: new Date(), allocatedBy: allocatedBy || 'Principal Secretary, Govt of Jharkhand',
      description: description || `State budgetary grant allocation to ${targetDept?.name || department || 'Department'}.`, status: 'Active'
    });

    const overview = await this.getFundsOverview();
    return {
      createdFund: newFund, stateGrantsTotal: overview.stateGrantsTotal,
      targetDepartment: targetDept ? { deptId: targetDept.deptId, name: targetDept.name, category: targetDept.category, newBalance: targetDept.allocatedFundPool } : null
    };
  }

  async updateGrantFund(id, data) {
    const query = id.startsWith('GGF-') ? { fundId: id } : { _id: id };
    const existing = await GovernmentGrantFund.findOne(query);
    if (!existing) return null;

    if (data.amount !== undefined) {
      const numAmount = Number(data.amount);
      if (!numAmount || numAmount <= 0) throw new Error('Grant amount must be a positive number.');
      const parsedAmount = existing.fundType === 'CORPUS_DEDUCTION' ? -Math.abs(numAmount) : Math.abs(numAmount);
      const diff = parsedAmount - (Number(existing.amount) || 0);
      existing.amount = parsedAmount;
      if (existing.fundType === 'DEPARTMENT_ALLOCATION') {
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
    }

    ['title', 'scheme', 'department', 'sanctionOrderNo', 'financialYear', 'allocatedBy', 'description'].forEach(field => {
      if (data[field] !== undefined) existing[field] = data[field];
    });

    await existing.save();
    return existing;
  }

  async deleteGrantFund(id) {
    const query = id.startsWith('GGF-') ? { fundId: id } : { _id: id };
    const fund = await GovernmentGrantFund.findOne(query);
    if (fund && fund.fundType === 'DEPARTMENT_ALLOCATION') {
      try {
        const { Department } = await import('../departments/infrastructure/department.schema.js');
        const targetDept = await Department.findOne({ category: 'State Ministry' }) || await Department.findOne({ deptId: 'DEPT-JH-STATE' });
        if (targetDept) {
          targetDept.allocatedFundPool = Math.max(0, (Number(targetDept.allocatedFundPool) || 0) - (Number(fund.amount) || 0));
          await targetDept.save();
        }
        const { DepartmentFundAllocation } = await import('../departments/infrastructure/department-fund-allocation.schema.js');
        if (fund.sanctionOrderNo) await DepartmentFundAllocation.findOneAndDelete({ sanctionOrderNo: fund.sanctionOrderNo });
      } catch (deptErr) {
        console.warn('Could not deduct on delete:', deptErr.message);
      }
    }
    return await GovernmentGrantFund.findOneAndDelete(query);
  }
}

export const grantFundService = new GrantFundService();
export default grantFundService;
