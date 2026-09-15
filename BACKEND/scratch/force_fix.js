// using native fetch

async function test() {
  try {
    const putRes = await fetch('http://localhost:3000/api/v1/university/projects/CHL-JH-2026-9238?universityCode=ALL', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assignedBudgetOfficer: {
          officerId: "6aa8741d5c8960afb50bc2a6", // Ariba's ID
          name: "ariba",
          status: "Submitted",
          assignedAt: new Date().toISOString(),
          submittedAt: new Date().toISOString()
        }
      })
    });
    
    if (putRes.ok) {
      console.log('Successfully forced ariba to be the submitted budget officer for flood project.');
    } else {
      console.log('Failed:', await putRes.text());
    }
  } catch (e) {
    console.error(e);
  }
}

test();
