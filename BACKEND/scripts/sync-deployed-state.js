import mongoose from 'mongoose';
import { connectMongo } from '../src/infrastructure/database/mongo/client.js';

(async () => {
  await connectMongo();
  const db = mongoose.connection.db;

  const deployedProjects = await db.collection('university_projects').find({
    $or: [{ isDeployed: true }, { isLocked: true }, { status: 'Deployed' }]
  }).toArray();
  console.log('Found deployed projects:', deployedProjects.length);

  for (const p of deployedProjects) {
    await db.collection('university_projects').updateOne(
      { _id: p._id },
      { $set: { status: 'Deployed', isDeployed: true, isLocked: true } }
    );

    const uniFilter = {
      $or: [
        { projectId: p.projectId },
        { challengeId: p.challengeId },
        { title: p.title },
        { project: p.title }
      ].filter(Boolean)
    };
    const appRes = await db.collection('university_approvals').updateMany(
      uniFilter,
      { $set: { status: 'Deployed', governmentStatus: 'Approved & Deployed', isDeployed: true, isLocked: true } }
    );
    console.log('Updated approvals for project', p.title, ':', appRes.modifiedCount);

    const facFilter = {
      $or: [
        { name: p.leadMentor },
        { name: p.facultyMentor?.name },
        { email: p.facultyMentor?.email },
        { 'assignedChallenges.challengeId': p.challengeId }
      ].filter(Boolean)
    };
    const facRes = await db.collection('university_faculty').updateMany(
      facFilter,
      { $set: { availabilityStatus: 'Available', isDeployed: true, activeProjects: 0 } }
    );
    console.log('Updated faculty for project', p.title, ':', facRes.modifiedCount);

    if (p.challengeId) {
      await db.collection('citizen_challenges').updateMany(
        { challengeId: p.challengeId },
        { $set: { status: 'Deployed', isDeployed: true, isLocked: true } }
      );
    }
  }

  console.log('SYNC COMPLETE');
  process.exit(0);
})();
