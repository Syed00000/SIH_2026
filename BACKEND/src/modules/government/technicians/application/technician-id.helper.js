export async function generateUniqueTechnicianId(technicianRepository, departmentId = '') {
  const allTechs = await technicianRepository.find({}, { limit: 1000 });
  const existingIds = new Set(allTechs.map((t) => (t.technicianId || '').toUpperCase()));

  let maxNum = 0;
  allTechs.forEach((t) => {
    const match = (t.technicianId || '').match(/TECH-(\d+)/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  });

  let nextNum = Math.max(allTechs.length + 1, maxNum + 1);
  let candidate = `TECH-${String(nextNum).padStart(3, '0')}`;
  while (existingIds.has(candidate.toUpperCase())) {
    nextNum++;
    candidate = `TECH-${String(nextNum).padStart(3, '0')}`;
  }
  return candidate;
}

export function generateDefaultDeptTechId(departmentId = '', cleanKey = 'water') {
  const deptSuffix = (departmentId || '').replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase() || 'DEPT';
  return `TECH-${deptSuffix}-${cleanKey.toUpperCase()}-01`;
}

export default {
  generateUniqueTechnicianId,
  generateDefaultDeptTechId
};
