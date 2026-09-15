async function test() {
  try {
    // 1. Fetch Budget Officers for "water department"
    const resBO = await fetch('http://localhost:3000/api/v1/government/budget-officers');
    const dataBO = await resBO.json();
    const bos = (dataBO.data || dataBO).filter(bo => bo.departmentName === 'water department');
    console.log(`Fetched ${bos.length} BOs for water department`);
    
    // 2. Fetch Projects
    const res = await fetch('http://localhost:3000/api/v1/university/projects?universityCode=ALL');
    const data = await res.json();
    const allProjects = data.data || data;
    console.log(`Fetched ${allProjects.length} projects`);
    
    // 3. Simulate merging logic
    const merged = [];
    allProjects.forEach(proj => {
      if (proj.handoverDepartment === 'water department' || 
         (proj.assignedBudgetOfficer && bos.some(bo => String(bo._id) === String(proj.assignedBudgetOfficer.officerId)))) {
        merged.push(proj);
      }
    });
    console.log(`Merged ${merged.length} projects for water department`);
    
    // 4. Simulate filtering for Review panel
    const reviewableBudgets = merged.filter(p => p.assignedBudgetOfficer?.status === 'Submitted' || p.assignedBudgetOfficer?.status === 'Forwarded');
    console.log(`Reviewable budgets: ${reviewableBudgets.length}`);
    if (reviewableBudgets.length > 0) {
      console.log(`Success! Project "${reviewableBudgets[0].title}" is reviewable!`);
    } else {
      console.log('FAIL! No reviewable budgets found.');
    }
  } catch (e) {
    console.error(e);
  }
}
test();
