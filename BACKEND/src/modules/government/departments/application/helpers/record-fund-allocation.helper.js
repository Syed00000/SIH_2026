import { DepartmentFundAllocation } from '../../infrastructure/department-fund-allocation.schema.js';

export async function recordDepartmentAllocation({
  deptId,
  departmentName,
  departmentCategory,
  amount,
  allocationType = 'STATE_GRANT',
  sourceDeptId = 'STATE_GOV',
  sourceDeptName = 'Government of Jharkhand (State Treasury)',
  sourceDeptCategory = 'State Government',
  previousBalance = 0,
  newBalance = 0,
  sanctionOrderNo = '',
  scheme = '',
  purpose = '',
  allocatedBy = ''
}) {
  if (!deptId || !amount || Number(amount) <= 0) return null;

  const allocationId = `DFA-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  try {
    const record = await DepartmentFundAllocation.create({
      allocationId,
      deptId,
      departmentName: departmentName || deptId,
      departmentCategory: departmentCategory || 'State Ministry',
      amount: Number(amount),
      allocationType,
      sourceDeptId,
      sourceDeptName,
      sourceDeptCategory,
      previousBalance: Number(previousBalance) || 0,
      newBalance: Number(newBalance) || 0,
      sanctionOrderNo: sanctionOrderNo || `JH-SANCT-${Date.now().toString().slice(-6)}`,
      scheme: scheme || 'Jharkhand State Innovation Council Grant',
      purpose: purpose || 'Departmental Civic & Innovation Fund',
      allocatedBy: allocatedBy || 'Competent Authority',
      status: 'Active'
    });
    return record;
  } catch (err) {
    console.warn('[RecordAllocation Warning]:', err.message);
    return null;
  }
}

export default recordDepartmentAllocation;
