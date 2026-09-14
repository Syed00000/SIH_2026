import departmentRepository from '../departments/infrastructure/department.repository.js';
import { Department } from '../departments/infrastructure/department.schema.js';
import { GovernmentGrantFund, GovernmentGrantPayment } from './model.js';

export async function processGrantFulfillment(existing, grantData = {}) {
  const sanctionedAmount = Number(grantData.sanctionedAmount) || existing.requestedAmount;
  const utrNumber = grantData.utrNumber || `UTR-JH-CSR-${Date.now().toString().slice(-8)}`;

  // 1. Validate and debit source granting department (if not government treasury)
  const sourceDeptIdentifier = grantData.grantedDeptId || existing.targetDeptId;
  if (sourceDeptIdentifier && sourceDeptIdentifier !== 'DEPT-PARENT' && sourceDeptIdentifier !== 'STATE_GOV') {
    let sourceDept = await departmentRepository.findById(sourceDeptIdentifier);
    if (!sourceDept && existing.targetDeptId) {
      sourceDept = await departmentRepository.findById(existing.targetDeptId);
    }
    if (!sourceDept) {
      sourceDept = await Department.findOne({ $or: [{ deptId: sourceDeptIdentifier }, { deptId: existing.targetDeptId }] });
    }
    if (sourceDept) {
      const sourcePool = Number(sourceDept.allocatedFundPool) || 0;
      if (sourcePool <= 0) {
        throw new Error(`Yeh department fund allocate nahi kar sakta kyunki iske paas ₹0 fund hai (Sufficient fund nahi hai).`);
      }
      if (sourcePool < sanctionedAmount) {
        throw new Error(`Yeh department fund allocate nahi kar sakta kyunki iske paas sufficient fund nahi hai (Available: ₹${sourcePool.toLocaleString('en-IN')}, Requested: ₹${sanctionedAmount.toLocaleString('en-IN')}).`);
      }
      await departmentRepository.update(sourceDept.deptId || sourceDept._id, {
        allocatedFundPool: sourcePool - sanctionedAmount
      });
    }
  }

  // 2. Credit beneficiary/requester department pool balance
  let targetDept = null;
  try {
    targetDept = await departmentRepository.findById(existing.requesterDeptId);
    if (!targetDept) {
      targetDept = await Department.findOne({ deptId: existing.requesterDeptId });
    }
    if (targetDept) {
      const currentPool = Number(targetDept.allocatedFundPool) || 0;
      await departmentRepository.update(targetDept.deptId || targetDept._id, {
        allocatedFundPool: currentPool + sanctionedAmount
      });
    }
  } catch (deptErr) {
    console.warn('Could not update requester department pool balance:', deptErr.message);
  }

  // 3. Record GovernmentGrantFund ledger
  try {
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
      allocatedBy: grantData.grantedBy || existing.targetName || 'Higher Department Authority',
      description: `Sanctioned grant for department request (${existing.requestId}): ${existing.purpose}`,
      status: 'Active'
    });
  } catch (e) {
    console.warn('Could not record grant fund entry for request:', e.message);
  }

  // 4. Record GovernmentGrantPayment audit ledger
  try {
    await GovernmentGrantPayment.create({
      paymentId: `PAY-GR-${Date.now().toString().slice(-6)}`,
      payer: existing.targetName || 'Department Grant Pool',
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

  return { sanctionedAmount, utrNumber };
}

export default processGrantFulfillment;
