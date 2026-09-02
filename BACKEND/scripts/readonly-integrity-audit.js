import 'dotenv/config';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';

async function runAudit() {
  const db = await connectMongo();
  console.log('=== DETAILED READ-ONLY INTEGRITY AUDIT ===\n');

  // 1. DUPLICATE_USER_IDENTITIES
  const dupEmails = await db.collection('users').aggregate([
    { $group: { _id: { $toLower: '$email' }, count: { $sum: 1 }, ids: { $push: '$_id' } } },
    { $match: { count: { $gt: 1 } } }
  ]).toArray();
  console.log('1. DUPLICATE_USER_IDENTITIES:');
  console.log('   Status:', dupEmails.length === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', dupEmails.length);

  // 2. ADMIN_WITHOUT_USER
  const admins = await db.collection('admins').find({}).toArray();
  const missingAdminUsers = [];
  for (const a of admins) {
    const u = await db.collection('users').findOne({ email: a.email.toLowerCase() });
    if (!u) missingAdminUsers.push(a._id.toString());
  }
  console.log('2. ADMIN_WITHOUT_USER:');
  console.log('   Status:', missingAdminUsers.length === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', missingAdminUsers.length);

  // 3. FACULTY_WITHOUT_USER
  const faculty = await db.collection('university_faculty').find({ status: { $ne: 'Removed' } }).toArray();
  const missingFacultyUsers = [];
  for (const f of faculty) {
    const u = f.userId ? await db.collection('users').findOne({ _id: f.userId }) : await db.collection('users').findOne({ email: f.email.toLowerCase() });
    if (!u) missingFacultyUsers.push(f._id.toString());
  }
  console.log('3. FACULTY_WITHOUT_USER:');
  console.log('   Status:', missingFacultyUsers.length === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', missingFacultyUsers.length);

  // 4. USER_WITHOUT_PROFILE
  const users = await db.collection('users').find({}).toArray();
  let orphanUsers = 0;
  const orphanUserDetails = [];
  for (const u of users) {
    if (u.accountStatus === 'SUSPENDED' || u.accountStatus === 'BLOCKED') continue;
    if (u.role === 'UNIVERSITY') {
      const uni = await db.collection('universities').findOne({ $or: [{ userId: u._id }, { 'credentials.loginEmail': u.email.toLowerCase() }] });
      if (!uni) { orphanUsers++; orphanUserDetails.push({ id: u._id.toString(), role: u.role, status: u.accountStatus }); }
    } else if (u.role === 'INDUSTRY') {
      const ind = await db.collection('industries').findOne({ $or: [{ userId: u._id }, { officialEmail: u.email.toLowerCase() }] });
      if (!ind) { orphanUsers++; orphanUserDetails.push({ id: u._id.toString(), role: u.role, status: u.accountStatus }); }
    } else if (u.role === 'FACULTY') {
      const fac = await db.collection('university_faculty').findOne({ $or: [{ userId: u._id }, { email: u.email.toLowerCase() }] });
      if (!fac) { orphanUsers++; orphanUserDetails.push({ id: u._id.toString(), role: u.role, status: u.accountStatus }); }
    }
  }
  console.log('4. USER_WITHOUT_PROFILE:');
  console.log('   Status:', orphanUsers === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', orphanUsers);
  if (orphanUserDetails.length > 0) {
    console.log('   Sample IDs:', JSON.stringify(orphanUserDetails));
    const mongoose = (await import('mongoose')).default;
    const sampleUser = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId('6a94965e936e1ecfa43c085c') });
    console.log('   Orphan User Sanitized Info:', sampleUser ? { role: sampleUser.role, status: sampleUser.accountStatus, createdAt: sampleUser.createdAt } : 'NOT FOUND');
  }

  // 5. ORPHAN_PROJECTS
  const projects = await db.collection('university_projects').find({ isDeleted: { $ne: true } }).toArray();
  const orphanProjects = [];
  for (const p of projects) {
    if (p.challengeId) {
      const c = await db.collection('citizen_challenges').findOne({ challengeId: p.challengeId });
      if (!c) orphanProjects.push(p.projectId);
    }
  }
  console.log('5. ORPHAN_PROJECTS:');
  console.log('   Status:', orphanProjects.length === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', orphanProjects.length);

  // 6. ORPHAN_TEAMS
  const teams = await db.collection('university_teams').find({ status: { $ne: 'Archived' } }).toArray();
  const orphanTeams = [];
  for (const t of teams) {
    if (t.projectId) {
      const p = await db.collection('university_projects').findOne({ $or: [{ projectId: t.projectId }, { challengeId: t.projectId }] });
      if (!p) orphanTeams.push(t.teamCode);
    }
  }
  console.log('6. ORPHAN_TEAMS:');
  console.log('   Status:', orphanTeams.length === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', orphanTeams.length);

  // 7. TEAMS_WRONG_UNIVERSITY
  let teamUniMismatches = 0;
  for (const t of teams) {
    if (t.projectId) {
      const p = await db.collection('university_projects').findOne({ $or: [{ projectId: t.projectId }, { challengeId: t.projectId }] });
      if (p && p.universityCode.toUpperCase() !== t.universityCode.toUpperCase()) {
        teamUniMismatches++;
      }
    }
  }
  console.log('7. TEAMS_WRONG_UNIVERSITY:');
  console.log('   Status:', teamUniMismatches === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', teamUniMismatches);

  // 8. PROJECTS_WRONG_UNIVERSITY
  const unis = await db.collection('universities').find({}).toArray();
  const validUniMap = {};
  unis.forEach(u => {
    const keys = [u.code?.toUpperCase(), u.aisheCode?.toUpperCase(), u._id.toString()].filter(Boolean);
    keys.forEach(k => validUniMap[k] = u.code?.toUpperCase());
  });

  let projectUniMismatches = 0;
  for (const p of projects) {
    const c = await db.collection('citizen_challenges').findOne({ challengeId: p.challengeId });
    if (c && c.assignedUniversity?.id) {
      const assignedCanon = validUniMap[c.assignedUniversity.id.toUpperCase()] || c.assignedUniversity.id.toUpperCase();
      const projCanon = validUniMap[p.universityCode.toUpperCase()] || p.universityCode.toUpperCase();
      if (assignedCanon !== projCanon) {
        projectUniMismatches++;
      }
    }
  }
  console.log('8. PROJECTS_WRONG_UNIVERSITY:');
  console.log('   Status:', projectUniMismatches === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', projectUniMismatches);

  // 9. CHALLENGES_INVALID_UNIVERSITY
  const chls = await db.collection('citizen_challenges').find({}).toArray();
  let invalidUniChallenges = 0;
  for (const c of chls) {
    const assignedId = c.assignedUniversity?.id?.toUpperCase();
    if (assignedId && !validUniMap[assignedId]) {
      invalidUniChallenges++;
    }
  }
  console.log('9. CHALLENGES_INVALID_UNIVERSITY:');
  console.log('   Status:', invalidUniChallenges === 0 ? 'PASS' : 'FAIL');
  console.log('   Count :', invalidUniChallenges);

  // 10. DUPLICATE_CHALLENGES
  const dupChls = await db.collection('citizen_challenges').aggregate([
    { $group: { _id: '$challengeId', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]).toArray();
  console.log('10. DUPLICATE_CHALLENGES:');
  console.log('    Status:', dupChls.length === 0 ? 'PASS' : 'FAIL');
  console.log('    Count :', dupChls.length);

  // 11. DUPLICATE_INDUSTRIES
  const dupInds = await db.collection('industries').aggregate([
    { $group: { _id: '$industryId', count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]).toArray();
  console.log('11. DUPLICATE_INDUSTRIES:');
  console.log('    Status:', dupInds.length === 0 ? 'PASS' : 'FAIL');
  console.log('    Count :', dupInds.length);

  // 12. BROKEN_INDUSTRY_REQUESTS
  const indReqs = await db.collection('university_industry_requests').find({}).toArray();
  let brokenIndReqs = 0;
  for (const r of indReqs) {
    if (r.partnerId) {
      const ind = await db.collection('industries').findOne({ $or: [{ industryId: r.partnerId }, { _id: r.partnerId }] });
      if (!ind) brokenIndReqs++;
    }
  }
  console.log('12. BROKEN_INDUSTRY_REQUESTS:');
  console.log('    Status:', brokenIndReqs === 0 ? 'PASS' : 'FAIL');
  console.log('    Count :', brokenIndReqs);

  await closeMongo();
}

runAudit().catch(console.error);
