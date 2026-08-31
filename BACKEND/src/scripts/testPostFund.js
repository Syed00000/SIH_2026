async function testPostFund() {
  try {
    const res = await fetch('http://127.0.0.1:3000/api/v1/government/funds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 25000000, // 2.5 Cr
        title: 'Jharkhand State Innovation Council R&D Allocation',
        scheme: 'State Problem-Solving & Innovation Fund',
        department: 'Department of Higher & Technical Education',
        sanctionOrderNo: 'JH-GOV-RD-2026-4401',
        description: 'Approved annual allocation for university innovation nodes and field telemetry testing.'
      })
    });

    const data = await res.json();
    console.log('POST Status:', res.status);
    console.log('POST Response:', JSON.stringify(data, null, 2));

    const checkRes = await fetch('http://127.0.0.1:3000/api/v1/government/funds');
    const checkData = await checkRes.json();
    console.log('\nGET Funds After POST:');
    console.log('State Grants Total:', checkData.data?.stateGrantsTotal);
    console.log('Total Joint Corpus:', checkData.data?.totalJointCorpus);
  } catch (err) {
    console.error('Test error:', err.message);
  }
}

testPostFund();
