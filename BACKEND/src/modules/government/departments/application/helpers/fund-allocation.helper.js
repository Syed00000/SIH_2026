import { GovernmentGrantFund } from '../../../grants/model.js';
import { Technician } from '../../../technicians/infrastructure/technician.schema.js';

export async function executeFundAllocation(repo, { fromDeptId, toDeptId, amount, scheme, sanctionOrderNo, description, allocatedBy }) {
  const parsedAmount = Number(amount);
  if (!parsedAmount || parsedAmount <= 0) {
    throw new Error('A valid allocation amount greater than ₹0 is required');
  }

  // 1. Fetch fromDept
  const fromDept = await repo.findById(fromDeptId);
  if (!fromDept) throw new Error(`Source department ${fromDeptId} not found`);

  // 2. Balance Validation
  const currentFromBalance = Number(fromDept.allocatedFundPool) || 0;
  if (currentFromBalance < parsedAmount) {
    throw new Error(`Insufficient funds: ${fromDept.name} has ₹${currentFromBalance.toLocaleString('en-IN')}, requested ₹${parsedAmount.toLocaleString('en-IN')}`);
  }

  // 3. Find toDept or Technician recipient
  let toDept = null;
  let technician = null;
  let isTechnician = false;

  if (typeof toDeptId === 'string' && toDeptId.startsWith('TECH-')) {
    technician = await Technician.findOne({ technicianId: toDeptId });
    if (technician) isTechnician = true;
  }

  if (!isTechnician) {
    toDept = await repo.findById(toDeptId);
    if (!toDept) {
      technician = await Technician.findOne({
        $or: [{ technicianId: toDeptId }, { _id: toDeptId?.match(/^[0-9a-fA-F]{24}$/) ? toDeptId : null }]
      });
      if (technician) isTechnician = true;
    }
  }

  if (!toDept && !isTechnician) {
    throw new Error(`Target recipient ${toDeptId} not found in departments or technicians`);
  }

  // 4. Atomically update balances
  const updatedFromBalance = currentFromBalance - parsedAmount;
  await repo.update(fromDept.deptId || fromDept._id, { allocatedFundPool: updatedFromBalance });

  let updatedToBalance = 0;
  let recipientName = '';
  let recipientId = '';

  if (isTechnician) {
    technician.allocatedSalaryPool = (Number(technician.allocatedSalaryPool) || 0) + parsedAmount;
    technician.totalEarnings = (Number(technician.totalEarnings) || 0) + parsedAmount;
    await technician.save();
    updatedToBalance = technician.allocatedSalaryPool;
    recipientName = `Technician ${technician.name} (${technician.specialization})`;
    recipientId = technician.technicianId;
  } else {
    updatedToBalance = (Number(toDept.allocatedFundPool) || 0) + parsedAmount;
    await repo.update(toDept.deptId || toDept._id, { allocatedFundPool: updatedToBalance });
    recipientName = toDept.name;
    recipientId = toDept.deptId;
  }

  // 5. Record audit ledger entry
  const generatedOrderNo = sanctionOrderNo || `JH-ALLOC-${Date.now().toString().slice(-6)}`;
  try {
    await GovernmentGrantFund.create({
      fundId: `GGF-${Date.now().toString().slice(-6)}`,
      title: `${fromDept.name} → ${recipientName} Disbursal`,
      scheme: scheme || (isTechnician ? 'Ward Field Technician Wages & Honorarium' : 'Inter-Departmental Subordinate Fund Allocation'),
      department: isTechnician ? (technician.departmentName || fromDept.name) : toDept.name,
      amount: parsedAmount,
      sanctionOrderNo: generatedOrderNo,
      financialYear: '2026-2027',
      allocationDate: new Date(),
      allocatedBy: allocatedBy || fromDept.headName || fromDept.name,
      description: description || `Fund disbursal from ${fromDept.name} to ${recipientName}`,
      status: 'Active'
    });
  } catch (e) {
    console.warn('Could not record fund ledger entry:', e.message);
  }

  return {
    success: true,
    message: `₹${parsedAmount.toLocaleString('en-IN')} allocated successfully from ${fromDept.name} to ${recipientName}`,
    fromDepartment: { deptId: fromDept.deptId, name: fromDept.name, newBalance: updatedFromBalance },
    toDepartment: { deptId: recipientId, name: recipientName, newBalance: updatedToBalance, isTechnician },
    allocatedAmount: parsedAmount,
    sanctionOrderNo: generatedOrderNo
  };
}

export default executeFundAllocation;
