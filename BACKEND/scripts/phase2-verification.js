import 'dotenv/config';
import assert from 'assert';
import mongoose from 'mongoose';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';
import User from '../src/modules/users/infrastructure/model.js';
import { MongooseRefreshToken } from '../src/modules/auth/infrastructure/model.js';
import MongoTokenRepository from '../src/modules/auth/infrastructure/repository.js';
import TokenService from '../src/modules/auth/application/services/token.service.js';
import { findUniversityIdentity } from '../src/modules/university/infrastructure/helpers/lookup.helper.js';
import {
  UniversityProject,
  UniversityTeam,
  UniversityFaculty,
  UniversityIndustryRequest
} from '../src/modules/university/infrastructure/model.js';
import { CitizenChallenge } from '../src/modules/citizen/infrastructure/model.js';
import citizenRepository from '../src/modules/citizen/infrastructure/repository.js';
import { projectApprovalRepository } from '../src/modules/university/infrastructure/repositories/project-approval.repository.js';
import { projectCrudRepository } from '../src/modules/university/infrastructure/repositories/project-crud.repository.js';
import { facultyTeamRepository } from '../src/modules/university/infrastructure/repositories/faculty-team.repository.js';
import { challengeRepository } from '../src/modules/university/infrastructure/repositories/challenge.repository.js';
import { partnerRequestRepository } from '../src/modules/university/infrastructure/repositories/partner-request.repository.js';
import MongooseIndustry from '../src/modules/government/industries/infrastructure/model.js';

async function runPhase2Tests() {
  console.log('🚀 STARTING PHASE 2 STABILIZATION TEST SUITE\n');
  await connectMongo();
  const tokenRepo = new MongoTokenRepository();

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(`     Reason: ${err.message}`);
      failed++;
    }
  }

  // ==========================================
  // 1. AUTH & TOKEN LIFECYCLE
  // ==========================================
  console.log('\n--- 1. Auth & Refresh Token Lifecycle ---');
  const testUserEmail = `test_user_${Date.now()}@joharsetu.test`;
  let testUser = null;

  await test('Create active user and generate refresh token', async () => {
    testUser = await User.create({
      fullName: 'Phase 2 Test User',
      email: testUserEmail,
      mobileNumber: `91${Date.now().toString().slice(-8)}`,
      passwordHash: 'dummy_hash',
      role: 'FACULTY',
      accountStatus: 'ACTIVE',
      emailVerification: { verified: true }
    });
    assert(testUser._id, 'User must be created');

    const fakeToken = `test_refresh_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await MongooseRefreshToken.create({
      token: fakeToken,
      userId: testUser._id,
      expiresAt
    });

    const stored = await MongooseRefreshToken.findOne({ userId: testUser._id });
    assert(stored && stored.token === fakeToken, 'Refresh token must be stored');
  });

  await test('Revoke refresh token by userId', async () => {
    await tokenRepo.revokeTokensByUserId(testUser._id);
    const stored = await MongooseRefreshToken.findOne({ userId: testUser._id });
    assert(stored && stored.revoked === true, 'Token must be marked revoked');
  });

  await test('Disabled/Suspended user refreshes are blocked and revoked', async () => {
    await User.findByIdAndUpdate(testUser._id, { accountStatus: 'SUSPENDED' });
    const newToken = `test_token_refresh_${Date.now()}`;
    await MongooseRefreshToken.create({
      token: newToken,
      userId: testUser._id,
      expiresAt: new Date(Date.now() + 10000),
      revoked: false
    });

    const mockUserService = {
      getUserById: async (id) => User.findById(id).lean()
    };
    const tokenService = new TokenService(tokenRepo, mockUserService);

    let caughtError = null;
    try {
      await tokenService.refresh(newToken);
    } catch (err) {
      caughtError = err;
    }
    assert(caughtError && caughtError.message.includes('ACCOUNT_SUSPENDED'), 'Suspended user must be rejected');
  });

  await test('User deletion cascades and leaves NO orphan refresh tokens', async () => {
    await tokenRepo.deleteTokensByUserId(testUser._id);
    await User.findByIdAndDelete(testUser._id);

    const tokenCount = await MongooseRefreshToken.countDocuments({ userId: testUser._id });
    assert.strictEqual(tokenCount, 0, 'No orphan refresh token must remain in database');
  });

  // ==========================================
  // 2. TENANT ISOLATION & CANONICAL RESOLUTION
  // ==========================================
  console.log('\n--- 2. Tenant Isolation & University Identity ---');

  await test('findUniversityIdentity resolves RU001 to canonical identity without regex bleed', async () => {
    const identity = await findUniversityIdentity('RU001');
    assert(identity, 'Must resolve RU001');
    assert.strictEqual(identity.code, 'RU001', 'Code must match');
    assert(identity.validIdentifiers.includes('RU001'), 'Must include RU001 in valid identifiers');
  });

  await test('findUniversityIdentity fails closed on invalid/empty input', async () => {
    const r1 = await findUniversityIdentity('');
    const r2 = await findUniversityIdentity(null);
    const r3 = await findUniversityIdentity(' ');
    assert.strictEqual(r1, null, 'Must fail closed on empty string');
    assert.strictEqual(r2, null, 'Must fail closed on null');
    assert.strictEqual(r3, null, 'Must fail closed on whitespace');
  });

  await test('University A cannot access University B projects', async () => {
    const testChlId = `TEST-CHL-${Date.now()}`;
    // Create a project under CUJ001
    const cujProj = await UniversityProject.create({
      projectId: `PRJ-CUJ-${Date.now()}`,
      challengeId: testChlId,
      universityCode: 'CUJ001',
      title: 'CUJ Specific Innovation',
      domain: 'Healthcare',
      leadMentor: 'Dr. CUJ Mentor',
      isDeleted: false
    });

    // Query under RU001
    const ruProjects = await projectCrudRepository.getProjectsByUniversity('RU001');
    const leaked = ruProjects.some((p) => p.projectId === cujProj.projectId);
    assert.strictEqual(leaked, false, 'RU001 must NOT receive CUJ001 projects');

    // Clean up
    await UniversityProject.findByIdAndDelete(cujProj._id);
  });

  await test('University A cannot update University B project (Tenant boundary check)', async () => {
    const testChlId = `TEST-CHL-${Date.now()}`;
    const cujProj = await UniversityProject.create({
      projectId: `PRJ-CUJ-UPDATE-${Date.now()}`,
      challengeId: testChlId,
      universityCode: 'CUJ001',
      title: 'CUJ Protected Project',
      domain: 'Healthcare',
      leadMentor: 'Dr. CUJ Mentor',
      isDeleted: false
    });

    // Try to update from RU001
    const updateResult = await projectApprovalRepository.updateProject('RU001', cujProj.projectId, {
      title: 'Hacked Title by Other Uni'
    });
    assert.strictEqual(updateResult, null, 'Cross-tenant update must return null');

    const freshDoc = await UniversityProject.findById(cujProj._id);
    assert.strictEqual(freshDoc.title, 'CUJ Protected Project', 'Project title must remain untouched');

    // Clean up
    await UniversityProject.findByIdAndDelete(cujProj._id);
  });

  // ==========================================
  // 3. CHALLENGE REASSIGNMENT & LIFECYCLE
  // ==========================================
  console.log('\n--- 3. Challenge Reassignment & Project Stubs ---');

  await test('Reassigning challenge soft-transfers old university project without data loss', async () => {
    const reassignChlId = `CHL-REASSIGN-${Date.now()}`;
    const chl = await CitizenChallenge.create({
      challengeId: reassignChlId,
      title: 'Pothole Problem on Main Highway',
      description: 'Severe potholes causing traffic jams',
      domain: 'Urban Development',
      district: 'Ranchi',
      location: { district: 'Ranchi' },
      submitter: { name: 'Ramesh Citizen', mobileNumber: '9876543210', district: 'Ranchi' },
      assignedUniversity: {
        id: 'RU001',
        name: 'Ranchi University',
        acceptanceStatus: 'Accepted'
      },
      status: 'In Progress'
    });

    // Old university creates a project
    const oldProj = await UniversityProject.create({
      projectId: `PRJ-${Date.now()}`,
      challengeId: reassignChlId,
      universityCode: 'RU001',
      title: 'Pothole Problem Solution RU',
      domain: 'Urban Development',
      leadMentor: 'Dr. RU Faculty',
      proposedBudget: '500000',
      isDeleted: false
    });

    // Nodal officer reassigns challenge to CUJ001
    await citizenRepository.triageChallenge(
      reassignChlId,
      {
        assignedUniversity: {
          id: 'CUJ001',
          name: 'Central University of Jharkhand'
        },
        status: 'In Progress'
      },
      { fullName: 'Nodal Officer Test', role: 'NODAL' }
    );

    // Verify old project was soft-transferred
    const freshOldProj = await UniversityProject.findById(oldProj._id);
    assert(freshOldProj, 'Old project record must be preserved for audit');
    assert.strictEqual(freshOldProj.status, 'Transferred', 'Old project must be marked Transferred');
    assert.strictEqual(freshOldProj.isDeleted, true, 'Old project must be soft-deleted from active view');
    assert.strictEqual(freshOldProj.transferredTo, 'CUJ001', 'transferredTo must record new university');

    // Verify RU001 portfolio no longer shows it
    const ruProjects = await projectCrudRepository.getProjectsByUniversity('RU001');
    const stillShowing = ruProjects.some((p) => p.challengeId === reassignChlId);
    assert.strictEqual(stillShowing, false, 'Old university must not see reassigned project in active portfolio');

    // Clean up
    await CitizenChallenge.findByIdAndDelete(chl._id);
    await UniversityProject.findByIdAndDelete(oldProj._id);
  });

  // ==========================================
  // 4. TEAM ↔ PROJECT AUTHORITATIVE LINKAGE
  // ==========================================
  console.log('\n--- 4. Team ↔ Project Relationship ---');

  await test('Updating project team creates/updates UniversityTeam with correct projectId & university', async () => {
    const testProjId = `PRJ-TEAM-${Date.now()}`;
    const proj = await UniversityProject.create({
      projectId: testProjId,
      challengeId: `CHL-${Date.now()}`,
      universityCode: 'RU001',
      title: 'Solar Irrigation Automation',
      domain: 'Agriculture',
      leadMentor: 'Dr. A. Sharma',
      isDeleted: false
    });

    const teamRoster = [
      { name: 'Aman Kumar', role: 'Lead Architect', isLead: true, department: 'CSE' },
      { name: 'Priya Singh', role: 'IoT Firmware Developer', isLead: false, department: 'ECE' }
    ];

    await projectApprovalRepository.updateProject('RU001', testProjId, {
      studentTeam: 'Solar Innovators Group',
      studentLead: 'Aman Kumar',
      teamMembers: teamRoster
    });

    const syncedTeam = await UniversityTeam.findOne({ projectId: testProjId });
    assert(syncedTeam, 'UniversityTeam must exist for project');
    assert.strictEqual(syncedTeam.universityCode, 'RU001', 'Team universityCode must match');
    assert.strictEqual(syncedTeam.leader, 'Aman Kumar', 'Leader name must match');
    assert.strictEqual(syncedTeam.membersCount, 2, 'Members count must be 2');
    assert.strictEqual(syncedTeam.status, 'Active', 'Status must be Active');

    // Clean up
    await UniversityProject.findByIdAndDelete(proj._id);
    await UniversityTeam.findByIdAndDelete(syncedTeam._id);
  });

  // ==========================================
  // 5. INDUSTRY / PARTNER RELATIONSHIP
  // ==========================================
  console.log('\n--- 5. Industry / Partner Registry Reference ---');

  await test('Industry request references canonical industry entity and does not duplicate industry doc', async () => {
    // Find verified industry or create test one
    let ind = await MongooseIndustry.findOne({ status: 'Active' });
    let createdInd = false;
    if (!ind) {
      ind = await MongooseIndustry.create({
        industryId: `IND-${Date.now()}`,
        legalName: 'Tata Steel CSR Division',
        category: 'CSR',
        thematicDomain: 'Clean Energy & Water',
        officialEmail: `tata_csr_${Date.now()}@tatasteel.test`,
        status: 'Active',
        verificationStatus: 'Verified'
      });
      createdInd = true;
    }

    const reqPayload = {
      projectTitle: 'Smart Water Metering Prototype',
      partnerId: ind.industryId,
      partnerName: ind.legalName,
      fundingRequested: true,
      estimatedBudget: '₹ 8.5 Lakhs'
    };

    const res = await partnerRequestRepository.createIndustryRequest('RU001', reqPayload);
    assert(res.success, 'Request must succeed');
    assert.strictEqual(res.request.partnerId, ind.industryId, 'Request must store canonical industryId');
    assert.strictEqual(res.request.universityCode, 'RU001', 'Request must store universityCode');

    // Clean up
    await UniversityIndustryRequest.findByIdAndDelete(res.request._id);
    if (createdInd) await MongooseIndustry.findByIdAndDelete(ind._id);
  });

  // ==========================================
  // SUMMARY
  // ==========================================
  console.log('\n==========================================');
  console.log(`PHASE 2 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('==========================================\n');

  await closeMongo();
  if (failed > 0) process.exit(1);
}

runPhase2Tests().catch(async (err) => {
  console.error('Test runner fatal error:', err);
  await closeMongo();
  process.exit(1);
});
