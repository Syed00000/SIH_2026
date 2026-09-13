import { applyTriageChanges } from './src/modules/citizen/infrastructure/helpers/triage-updater.helper.js';

const mockChallenge = {
  status: 'In Progress',
  district: 'Ranchi',
  location: { district: 'Ranchi', block: 'Namkum' },
  assignedDepartment: {
    name: 'Namkum District Department',
    category: 'District Department',
    level: 'District Department',
    district: 'Ranchi',
    assignedAt: new Date(),
    assignedBy: 'Block Office',
    status: 'In Progress'
  },
  assignedBlock: null,
  assignedWard: null,
  milestones: [
    { title: 'Reported', status: 'COMPLETED' },
    { title: 'Triage', status: 'COMPLETED' },
    { title: 'Action', status: 'CURRENT' },
    { title: 'Resolved', status: 'PENDING' }
  ]
};

const triageData = {
  status: 'Escalated'
};

console.log("=== BEFORE ===");
console.log(JSON.stringify(mockChallenge, null, 2));

applyTriageChanges(mockChallenge, triageData, { fullName: 'District Head' });

console.log("\n=== AFTER ===");
console.log(JSON.stringify(mockChallenge, null, 2));
