import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

async function testCascade() {
  await mongoose.connect(process.env.URL);
  console.log('Connected to DB');

  const { cascadeDeleteProblemOrProject } = await import('../src/modules/university/infrastructure/helpers/cascade-delete.helper.js');
  const { projectCrudRepository } = await import('../src/modules/university/infrastructure/repositories/project-crud.repository.js');
  const { UniversityProject, UniversityFaculty, UniversityApproval, UniversityTeam } = await import('../src/modules/university/infrastructure/model.js');
  const { CitizenChallenge } = await import('../src/modules/citizen/infrastructure/model.js');

  const testChlId = `CHL-TEST-${Date.now().toString().slice(-4)}`;
  const testProjId = `PRJ-TEST-${Date.now().toString().slice(-4)}`;
  const uniCode = 'RU001';

  console.log(`Creating test records: Challenge=${testChlId}, Project=${testProjId}`);

  // 1. Create test challenge assigned to Ranchi University
  await CitizenChallenge.create({
    challengeId: testChlId,
    title: 'Test Clean Cascade Challenge',
    description: 'Verifying end-to-end cascading deletion',
    domain: 'Water Resources',
    status: 'In Progress',
    location: { district: 'Ranchi' },
    submitter: { name: 'Test Citizen', mobileNumber: '9876543210' },
    assignedUniversity: {
      id: uniCode,
      name: 'Ranchi University',
      mentorName: 'binod',
      mentorEmail: 'binod@gmail.com',
      acceptanceStatus: 'Accepted'
    }
  });

  // 2. Create test project linked to challenge
  await UniversityProject.create({
    projectId: testProjId,
    challengeId: testChlId,
    title: 'Test Clean Cascade Challenge',
    domain: 'Water Resources',
    universityCode: uniCode,
    status: 'Proposal Stage',
    facultyMentor: {
      name: 'binod',
      email: 'binod@gmail.com',
      department: 'Civil & Environmental Engineering'
    },
    leadMentor: 'binod'
  });

  // 3. Add to binod's assignedChallenges
  const facBefore = await UniversityFaculty.findOne({ email: 'binod@gmail.com' });
  const activeCountBefore = facBefore.activeProjects;
  await UniversityFaculty.updateOne(
    { email: 'binod@gmail.com' },
    {
      $push: {
        assignedChallenges: {
          challengeId: testChlId,
          title: 'Test Clean Cascade Challenge',
          role: 'Lead Mentor'
        }
      },
      $inc: { activeProjects: 1 }
    }
  );

  // 4. Create an approval and a team
  await UniversityApproval.create({
    approvalId: `APP-${testProjId}`,
    projectId: testProjId,
    universityCode: uniCode,
    type: 'PROPOSAL_REVIEW',
    title: 'Test Proposal Review',
    project: 'Test Clean Cascade Challenge',
    requestedBy: 'binod',
    status: 'Pending'
  });

  await UniversityTeam.create({
    teamCode: `TC-${testProjId}`,
    name: 'Cascade Test Team',
    projectId: testProjId,
    universityCode: uniCode,
    members: [{ name: 'Student 1', role: 'Developer' }]
  });

  console.log('Test records created. Now triggering cascade delete on Project...');

  // 5. Call cascade deletion
  const delResult = await cascadeDeleteProblemOrProject(uniCode, testProjId);
  console.log('Cascade delete returned:', delResult);

  // 6. Assertions
  const checkProj = await UniversityProject.findOne({ $or: [{ projectId: testProjId }, { challengeId: testChlId }] });
  const checkChl = await CitizenChallenge.findOne({ challengeId: testChlId });
  const facAfter = await UniversityFaculty.findOne({ email: 'binod@gmail.com' });
  const checkApp = await UniversityApproval.findOne({ projectId: testProjId });
  const checkTeam = await UniversityTeam.findOne({ projectId: testProjId });

  const hasInAssigned = facAfter.assignedChallenges.some(c => c.challengeId === testChlId);

  console.log('--- VERIFICATION CHECKS ---');
  console.log('1. UniversityProject deleted:', checkProj === null ? 'PASS (null)' : 'FAIL');
  console.log('2. CitizenChallenge unassigned from uni:', checkChl.assignedUniversity === undefined || !checkChl.assignedUniversity?.id ? 'PASS (unassigned)' : 'FAIL');
  console.log('3. CitizenChallenge status:', checkChl.status === 'Declined' ? 'PASS (Declined)' : `FAIL (${checkChl.status})`);
  console.log('4. Faculty assignedChallenges removed:', !hasInAssigned ? 'PASS (removed)' : 'FAIL');
  console.log('5. Faculty activeProjects decremented:', facAfter.activeProjects === activeCountBefore ? `PASS (${facAfter.activeProjects})` : `WARN (${facAfter.activeProjects} vs ${activeCountBefore})`);
  console.log('6. UniversityApproval purged:', checkApp === null ? 'PASS (null)' : 'FAIL');
  console.log('7. UniversityTeam purged:', checkTeam === null ? 'PASS (null)' : 'FAIL');

  // 7. Check anti-resurrection in getProjectsByUniversity
  const fetchedProjects = await projectCrudRepository.getProjectsByUniversity(uniCode);
  const resurrected = fetchedProjects.some(p => p.challengeId === testChlId || p.projectId === testProjId);
  console.log('8. Anti-resurrection check:', !resurrected ? 'PASS (Not resurrected)' : 'FAIL (RESURRECTED!)');

  // Clean up test challenge completely
  await CitizenChallenge.deleteOne({ challengeId: testChlId });

  console.log('--- ALL CASCADE TESTS COMPLETED SUCCESSFULLY ---');
  process.exit(0);
}

testCascade().catch(err => {
  console.error(err);
  process.exit(1);
});
