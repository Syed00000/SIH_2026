// using native fetch

async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/university/projects?universityCode=ALL');
    const data = await res.json();
    console.log(`Total projects: ${data.data ? data.data.length : data.length}`);
    
    const projects = data.data || data;
    const submitted = projects.filter(p => p.assignedBudgetOfficer && p.assignedBudgetOfficer.status === 'Submitted');
    console.log(`Submitted projects: ${submitted.length}`);
    if (submitted.length > 0) {
      submitted.forEach(p => console.log('Sample submitted:', JSON.stringify(p.assignedBudgetOfficer, null, 2)));
    }
  } catch (e) {
    console.error(e);
  }
}

test();

test();

test();
