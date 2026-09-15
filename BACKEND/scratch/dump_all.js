// using native fetch

async function test() {
  try {
    const resP = await fetch('http://localhost:3000/api/v1/university/projects?universityCode=ALL');
    const dataP = await resP.json();
    const projects = dataP.data || dataP;
    
    console.log('--- PROJECTS ---');
    projects.forEach(p => {
      console.log(`Project: ID=${p._id} | projectId=${p.projectId} | challengeId=${p.challengeId} | title=${p.title}`);
      if (p.assignedBudgetOfficer) {
        console.log(`  Assigned to: ${p.assignedBudgetOfficer.name} (${p.assignedBudgetOfficer.status})`);
      }
    });

    const resC = await fetch('http://localhost:3000/api/v1/university/challenges');
    const dataC = await resC.json();
    const challenges = dataC.data || dataC;
    
    console.log('\n--- CHALLENGES ---');
    challenges.forEach(c => {
      console.log(`Challenge: ID=${c._id} | challengeId=${c.challengeId} | title=${c.title}`);
      if (c.assignedBudgetOfficer) {
        console.log(`  Assigned to: ${c.assignedBudgetOfficer.name} (${c.assignedBudgetOfficer.status})`);
      }
    });

  } catch (e) {
    console.error(e);
  }
}

test();
