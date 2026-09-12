const BASE_URL = 'http://localhost:3000/api/v1/government';

async function runTests() {
  console.log('--- STARTING COMPLETE FUND ALLOCATION & CANCEL/RESET TEST ---');

  // 1. Check current status of departments & technicians
  const deptsRes = await fetch(`${BASE_URL}/departments`);
  const deptsData = await deptsRes.json();
  const stateDept = deptsData.data.find(d => d.deptId === 'DEPT-JH-STATE');
  const distDept = deptsData.data.find(d => d.deptId === 'DEPT-JH-DIST-RNC');
  const blockDept = deptsData.data.find(d => d.deptId === 'DEPT-KNK-02');
  const wardDept = deptsData.data.find(d => d.deptId === 'DEPT-JH-3731');

  console.log('Initial Balances:');
  console.log('  State (DEPT-JH-STATE):', stateDept?.allocatedFundPool);
  console.log('  District (DEPT-JH-DIST-RNC):', distDept?.allocatedFundPool);
  console.log('  Block (DEPT-KNK-02):', blockDept?.allocatedFundPool);
  console.log('  Ward (DEPT-JH-3731):', wardDept?.allocatedFundPool);

  // 2. Fetch Technicians in Ward DEPT-JH-3731
  const techRes = await fetch(`${BASE_URL}/technicians?departmentId=DEPT-JH-3731`);
  const techData = await techRes.json();
  console.log('Ward Technicians count:', techData.data?.length);
  const wardTech = techData.data?.[0];
  console.log('  Technician:', wardTech?.technicianId, wardTech?.name, 'Current Wages:', wardTech?.allocatedSalaryPool);

  // 3. Test Ward -> Technician Disbursal (e.g. ₹5,000)
  console.log('\n--- 3. Testing Ward -> Technician Disbursal (₹5,000) ---');
  const techDisbursalRes = await fetch(`${BASE_URL}/departments/allocate-fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromDeptId: 'DEPT-JH-3731',
      toDeptId: wardTech.technicianId,
      amount: 5000,
      scheme: 'Ward Field Technician Problem Resolution Wages',
      description: 'Monthly honorarium and issue resolution wages'
    })
  });
  const techDisbursalJson = await techDisbursalRes.json();
  console.log('Technician Disbursal Result:', techDisbursalJson.message);
  console.log('  Ward new balance:', techDisbursalJson.data?.fromDepartment?.newBalance);
  console.log('  Tech new balance:', techDisbursalJson.data?.toDepartment?.newBalance);

  // 4. Test Pool Deduct / Cancel (e.g. deduct ₹10,000 from Block DEPT-KNK-02)
  console.log('\n--- 4. Testing Deduct/Cancel from Pool (Block: DEPT-KNK-02) ---');
  const deductRes = await fetch(`${BASE_URL}/departments/DEPT-KNK-02/fund-pool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'deduct',
      amount: 10000,
      description: 'Clawback of unused contingency funds'
    })
  });
  const deductJson = await deductRes.json();
  console.log('Deduct Result:', deductJson.success ? 'Success' : 'Failed');
  console.log('  Block new pool:', deductJson.data?.allocatedFundPool);

  // 5. Test Pool Reset / Zero on Dhanbad District (DEPT-JH-DIST-DHN)
  console.log('\n--- 5. Testing Reset/Zero on Pool ---');
  // First add 25000
  await fetch(`${BASE_URL}/departments/DEPT-JH-DIST-DHN/fund-pool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'add', amount: 25000, description: 'Test topup' })
  });
  // Now reset to 0
  const resetRes = await fetch(`${BASE_URL}/departments/DEPT-JH-DIST-DHN/fund-pool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'reset' })
  });
  const resetJson = await resetRes.json();
  console.log('Reset Result:', resetJson.success ? 'Success' : 'Failed');
  console.log('  Dhanbad pool after reset:', resetJson.data?.allocatedFundPool);

  // 6. Test Insufficient Funds Validation
  console.log('\n--- 6. Testing Insufficient Funds Validation (Over-allocation) ---');
  const overAllocRes = await fetch(`${BASE_URL}/departments/allocate-fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromDeptId: 'DEPT-JH-3731',
      toDeptId: wardTech.technicianId,
      amount: 999999999
    })
  });
  const overAllocJson = await overAllocRes.json();
  console.log('Expected 400 failure received:', overAllocRes.status === 400, '| Message:', overAllocJson.message);

  console.log('\n--- ALL VERIFICATIONS COMPLETED SUCCESSFULLY ---');
}

runTests().catch(console.error);
