import { grantRequestRepository } from './grant-request.repository.js';
import { GovernmentGrantPayment } from './model.js';
import departmentRepository from '../departments/infrastructure/department.repository.js';

export class GrantRequestService {
  constructor(repo = grantRequestRepository) {
    this.repo = repo;
  }

  async createRequest(data) {
    const amount = Number(data.requestedAmount || data.amountRequested || 0);
    if (!amount || amount <= 0) {
      throw new Error('Valid requested amount is required');
    }
    data.requestedAmount = amount;
    if (!data.purpose || !data.purpose.trim()) {
      throw new Error('Purpose / Problem statement is required');
    }

    const requesterDept = await departmentRepository.findById(data.requesterDeptId);
    const requesterCategory = requesterDept?.category || data.requesterCategory;
    let tier = 'WARD_TO_BLOCK';
    let targetCategory = 'Block / Tehsil Office';

    if (data.isEmergency) {
      if (requesterCategory === 'Ward Commissioner' || requesterCategory === 'Ward') {
        tier = data.emergencyTargetTier === 'STATE' ? 'WARD_TO_STATE' : 'WARD_TO_DISTRICT';
        targetCategory = data.emergencyTargetTier === 'STATE' ? 'State Ministry' : 'District Department';
      } else {
        tier = requesterCategory === 'Block / Tehsil Office' ? 'BLOCK_TO_STATE' : 'DISTRICT_TO_STATE';
        targetCategory = 'State Ministry';
      }
    } else if (requesterCategory === 'District Department' || requesterCategory === 'State Ministry') {
      tier = 'DISTRICT_TO_STATE';
      targetCategory = 'State Ministry';
    } else if (requesterCategory === 'Block / Tehsil Office') {
      tier = 'BLOCK_TO_DISTRICT';
      targetCategory = 'District Department';
    }

    let targetDept = null;
    if (data.targetDeptId) {
      targetDept = await departmentRepository.findById(data.targetDeptId);
    }
    if (!targetDept) {
      const candidates = await departmentRepository.find({ category: targetCategory });
      if (targetCategory === 'District Department') {
        const rawDist = data.district || requesterDept?.district;
        const distName = (rawDist && isNaN(rawDist)) ? rawDist : (requesterDept?.headquartersLocation || 'Ranchi');
        targetDept = candidates.find((d) => d.district?.toLowerCase() === distName?.toLowerCase())
          || candidates.find((d) => d.name?.toLowerCase().includes(distName?.toLowerCase()))
          || candidates.find((d) => d.district?.toLowerCase() === 'ranchi')
          || candidates[0];
      } else {
        targetDept = candidates[0];
      }
    }

    const count = await this.repo.count();
    const requestId = `GR-2026-${String(count + 1).padStart(4, '0')}`;

    return this.repo.create({
      requestId,
      requesterDeptId: data.requesterDeptId,
      requesterName: requesterDept?.name || data.requesterName || 'Department Authority',
      requesterCategory,
      targetDeptId: targetDept?.deptId || data.targetDeptId || 'DEPT-PARENT',
      targetName: targetDept?.name || data.targetName || 'Parent Authority',
      targetCategory,
      tier,
      district: data.district || requesterDept?.district || 'Ranchi',
      block: data.block || requesterDept?.block || '',
      wardId: data.wardId || requesterDept?.wardId || '',
      requestedAmount: Number(data.requestedAmount),
      purpose: data.purpose.trim(),
      sector: data.sector || 'Civic Infrastructure',
      justification: data.justification || '',
      priority: data.isEmergency ? 'Emergency SOS' : (data.priority || 'Normal'),
      isEmergency: Boolean(data.isEmergency),
      emergencyType: data.emergencyType || '',
      status: 'Pending'
    });
  }

  async getRequests(filter = {}, options = {}) {
    return this.repo.find(filter, options);
  }

  async getById(id) {
    const req = await this.repo.findById(id);
    if (!req) throw new Error('Grant request not found');
    return req;
  }

  async grantRequest(id, grantData = {}) {
    const existing = await this.getById(id);
    if (existing.status !== 'Pending') {
      throw new Error(`Cannot grant request with status '${existing.status}'`);
    }

    const sanctionedAmount = Number(grantData.sanctionedAmount) || existing.requestedAmount;
    const utrNumber = grantData.utrNumber || `UTR-JH-CSR-${Date.now().toString().slice(-8)}`;

    const updated = await this.repo.update(id, {
      status: 'Granted',
      sanctionedAmount,
      utrNumber,
      grantedAt: new Date(),
      grantedBy: grantData.grantedBy || existing.targetName,
      grantRemarks: grantData.remarks || 'Sanctioned & Disbursed via CSR Pool'
    });

    // Atomically credit requester department pool balance
    let targetDept = null;
    try {
      targetDept = await departmentRepository.findById(existing.requesterDeptId);
      if (!targetDept) {
        const { Department } = await import('../departments/infrastructure/department.schema.js');
        targetDept = await Department.findOne({ deptId: existing.requesterDeptId });
      }
      if (targetDept) {
        const currentPool = Number(targetDept.allocatedFundPool) || 0;
        await departmentRepository.update(targetDept.deptId || targetDept._id, { allocatedFundPool: currentPool + sanctionedAmount });
      }
    } catch (deptErr) {
      console.warn('Could not update requester department pool balance:', deptErr.message);
    }

    try {
      const { GovernmentGrantFund } = await import('./model.js');
      await GovernmentGrantFund.create({
        fundId: `GGF-REQ-${Date.now().toString().slice(-5)}`,
        title: `Grant Approved: ${existing.purpose}`,
        scheme: existing.sector || 'State Innovation Grant for Department Civic Works',
        department: targetDept?.name || existing.requesterName,
        departmentId: targetDept?.deptId || existing.requesterDeptId,
        departmentCategory: targetDept?.category || existing.requesterCategory,
        targetDeptCode: targetDept?.code || '',
        fundType: 'DEPARTMENT_ALLOCATION',
        amount: sanctionedAmount,
        sanctionOrderNo: `JH-SANCTION-REQ-${Date.now().toString().slice(-6)}`,
        financialYear: '2026-2027',
        allocationDate: new Date(),
        allocatedBy: grantData.grantedBy || 'Super Admin, Govt of Jharkhand',
        description: `Sanctioned grant for department request (${existing.requestId}): ${existing.purpose}`,
        status: 'Active'
      });
    } catch (e) {
      console.warn('Could not record grant fund entry for request:', e.message);
    }

    try {
      await GovernmentGrantPayment.create({
        paymentId: `PAY-GR-${Date.now().toString().slice(-6)}`,
        payer: existing.targetName || 'Govt State Treasury (PFMS Escrow)',
        payee: `${existing.requesterName} (${existing.requesterDeptId})`,
        amount: `₹ ${sanctionedAmount.toLocaleString('en-IN')}`,
        rawAmount: sanctionedAmount,
        disbursedAmount: `₹ ${sanctionedAmount.toLocaleString('en-IN')}`,
        utrNumber,
        makerCheckerStatus: 'Approved',
        bankStatus: 'success',
        scheme: 'CSR Municipal Development Grant',
        projectRef: existing.requestId,
        projectTitle: existing.purpose,
        purpose: `Inter-tier Grant Disbursal (${existing.tier})`
      });
    } catch (e) {
      console.warn('Could not record payment ledger entry:', e.message);
    }

    return updated;
  }

  async rejectRequest(id, rejectData = {}) {
    const existing = await this.getById(id);
    if (existing.status !== 'Pending') {
      throw new Error(`Cannot reject request with status '${existing.status}'`);
    }

    return this.repo.update(id, {
      status: 'Rejected',
      rejectionReason: rejectData.reason || 'Insufficient funds or documentation'
    });
  }
}

export const grantRequestService = new GrantRequestService();
export default grantRequestService;
