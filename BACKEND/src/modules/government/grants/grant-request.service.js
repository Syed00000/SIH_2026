import { grantRequestRepository } from './grant-request.repository.js';
import { GovernmentGrantPayment } from './model.js';
import departmentRepository from '../departments/infrastructure/department.repository.js';
import { processGrantFulfillment } from './grant-fulfillment.helper.js';

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
    const finalFilter = { ...filter };
    if (finalFilter.targetDeptId) {
      const idVal = finalFilter.targetDeptId;
      const dept = await departmentRepository.findById(idVal);
      const possibleIds = [idVal];
      if (dept) {
        if (dept.deptId) possibleIds.push(dept.deptId);
        if (dept._id) possibleIds.push(String(dept._id));
        if (dept.code) possibleIds.push(dept.code);
        
        const cat = (dept.category || '').toLowerCase();
        if (dept.deptId === 'DEPT-JH-STATE' || cat.includes('state') || cat.includes('ministry')) {
          delete finalFilter.targetDeptId;
          finalFilter.$or = [
            { targetDeptId: { $in: [...new Set(possibleIds)] } },
            { tier: 'DISTRICT_TO_STATE' },
            { targetCategory: 'State Ministry' }
          ];
        } else if (dept.deptId?.includes('DIST') || cat.includes('district')) {
          delete finalFilter.targetDeptId;
          const dName = dept.district || 'Ranchi';
          finalFilter.$or = [
            { targetDeptId: { $in: [...new Set(possibleIds)] } },
            { tier: 'BLOCK_TO_DISTRICT', district: new RegExp(dName, 'i') },
            { targetCategory: 'District Department' }
          ];
        } else {
          finalFilter.targetDeptId = { $in: [...new Set(possibleIds)] };
        }
      } else {
        finalFilter.targetDeptId = { $in: [...new Set(possibleIds)] };
      }
    }
    if (finalFilter.requesterDeptId) {
      const idVal = finalFilter.requesterDeptId;
      const dept = await departmentRepository.findById(idVal);
      const possibleIds = [idVal];
      if (dept) {
        if (dept.deptId) possibleIds.push(dept.deptId);
        if (dept._id) possibleIds.push(String(dept._id));
        if (dept.code) possibleIds.push(dept.code);
      }
      finalFilter.requesterDeptId = { $in: [...new Set(possibleIds)] };
    }
    return this.repo.find(finalFilter, options);
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

    const { sanctionedAmount, utrNumber } = await processGrantFulfillment(existing, grantData);

    const updated = await this.repo.update(id, {
      status: 'Granted',
      sanctionedAmount,
      utrNumber,
      grantedAt: new Date(),
      grantedBy: grantData.grantedBy || existing.targetName,
      grantRemarks: grantData.remarks || 'Sanctioned & Disbursed via CSR Pool'
    });

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
