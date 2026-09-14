import { GovernmentGrantFund } from '../../../grants/model.js';

export async function manageFundPool(repo, dept, fundData = {}) {
  const action = fundData.action || 'add';
  const currentPool = Number(dept.allocatedFundPool) || 0;
  let newPool = currentPool;
  let recordedAmount = 0;
  let title = '';

  if (action === 'reset' || action === 'zero') {
    newPool = 0;
    recordedAmount = currentPool;
    title = `${dept.name} Fund Pool Reset to ₹0`;
  } else if (action === 'deduct' || action === 'cancel') {
    const amount = Number(fundData.amount);
    if (!amount || amount <= 0) throw new Error('Valid cancellation amount greater than ₹0 is required');
    newPool = Math.max(0, currentPool - amount);
    recordedAmount = amount;
    title = `${dept.name} Fund Cancellation / Deduction`;
  } else {
    const amount = Number(fundData.amount);
    if (!amount || amount <= 0) throw new Error('Valid fund amount greater than ₹0 is required');
    newPool = currentPool + amount;
    recordedAmount = amount;
    title = fundData.title || `${dept.name} Sanctioned Pool Top-up`;
  }

  const updated = await repo.update(dept.deptId || dept.id || dept._id, { allocatedFundPool: newPool });
  if (action === 'add') {
    try {
      const { recordDepartmentAllocation } = await import('./record-fund-allocation.helper.js');
      await recordDepartmentAllocation({
        deptId: dept.deptId, departmentName: dept.name, departmentCategory: dept.category,
        amount: recordedAmount, allocationType: 'DIRECT_TOPUP', previousBalance: currentPool,
        newBalance: newPool, sanctionOrderNo: fundData.sanctionOrderNo,
        scheme: fundData.scheme || 'Direct Department Pool Top-up',
        purpose: fundData.description || `${dept.name} Pool Top-up`,
        allocatedBy: fundData.allocatedBy || dept.headName || 'Department Authority'
      });
    } catch (e) {
      console.warn('Could not record fund allocation entry:', e.message);
    }
  }
  try {
    await GovernmentGrantFund.create({
      fundId: `GGF-${Date.now().toString().slice(-6)}`,
      title,
      scheme: fundData.scheme || 'Departmental Fund Adjustment',
      department: dept.name,
      amount: recordedAmount,
      sanctionOrderNo: fundData.sanctionOrderNo || `JH-GOV-${Date.now().toString().slice(-6)}`,
      financialYear: '2026-2027',
      allocationDate: new Date(),
      allocatedBy: fundData.allocatedBy || dept.headName || 'Department Authority',
      description: fundData.description || `Pool adjustment (${action}) for ${dept.name}`,
      status: action === 'reset' ? 'Cancelled' : 'Active'
    });
  } catch (e) {
    console.warn('Could not record fund ledger entry:', e.message);
  }

  return updated;
}

export default manageFundPool;
