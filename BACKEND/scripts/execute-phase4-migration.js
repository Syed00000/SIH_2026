import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';
import { findUniversityIdentity } from '../src/modules/university/infrastructure/helpers/lookup.helper.js';

async function main() {
  console.log('🚀 EXECUTING PHASE 4 CONTROLLED COLLECTION MIGRATION');
  const db = await connectMongo();

  const migrationLog = {
    startedAt: new Date().toISOString(),
    adminMigration: { migrated: 0, failed: 0 },
    facultyCredentialSeparation: { stripped: 0 },
    tenantIdBackfill: {},
    indexesCreated: [],
    completedAt: null
  };

  // ================================================================
  // STEP 1: ADMIN METADATA CONSOLIDATION (Phase 3)
  // ================================================================
  console.log('\n--- STEP 1: ADMIN METADATA CONSOLIDATION ---');
  const legacyAdmins = await db.collection('admins').find({}).toArray();
  console.log(`Found ${legacyAdmins.length} legacy admin documents to consolidate into users.`);

  for (const admin of legacyAdmins) {
    const email = admin.email.toLowerCase().trim();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      console.error(`❌ FATAL: No matching User found for legacy admin: ${email}`);
      throw new Error(`Admin without user: ${email}`);
    }

    const adminDetails = {
      assignedDepartment: admin.assignedDepartment || 'State Administration',
      accessLevel: admin.accessLevel || 'State',
      primaryRole: admin.primaryRole || 'State Co-ordinator',
      avatarColor: admin.avatarColor || '#3B82F6',
      dateOfJoining: admin.dateOfJoining || admin.createdAt || new Date(),
      address: admin.address || null,
      employeeId: admin.employeeId || null,
      createdBy: admin.createdBy || 'SYSTEM',
      lastLogin: admin.lastLogin || null
    };

    const updateRes = await db.collection('users').updateOne(
      { _id: user._id },
      {
        $set: {
          'profile.adminDetails': adminDetails,
          'profile.district': admin.district || user.profile?.district || 'Ranchi',
          updatedAt: new Date()
        }
      }
    );

    if (updateRes.matchedCount !== 1) {
      throw new Error(`Failed to update User ${user._id} for admin ${email}`);
    }
    migrationLog.adminMigration.migrated++;
    console.log(`  ✓ Consolidated admin: ${email} -> User ${user._id}`);
  }
  console.log(`✅ Admin consolidation complete: ${migrationLog.adminMigration.migrated}/${legacyAdmins.length} migrated.`);

  // ================================================================
  // STEP 2: FACULTY CREDENTIAL SEPARATION (Phase 5)
  // ================================================================
  console.log('\n--- STEP 2: FACULTY CREDENTIAL SEPARATION ---');
  const facultyWithCreds = await db.collection('university_faculty').find({ passwordHash: { $ne: null } }).toArray();
  console.log(`Found ${facultyWithCreds.length} faculty profile documents with legacy passwordHash.`);

  for (const fac of facultyWithCreds) {
    // Verify matching user has passwordHash
    const user = await db.collection('users').findOne({ $or: [{ _id: fac.userId }, { email: fac.email.toLowerCase() }] });
    if (!user || !user.passwordHash) {
      console.error(`❌ FATAL: Cannot strip credentials from faculty ${fac.email}; matching User lacks passwordHash!`);
      throw new Error(`Faculty user lacks passwordHash: ${fac.email}`);
    }

    await db.collection('university_faculty').updateOne(
      { _id: fac._id },
      {
        $set: { passwordHash: null, updatedAt: new Date() }
      }
    );
    migrationLog.facultyCredentialSeparation.stripped++;
    console.log(`  ✓ Stripped duplicate passwordHash from faculty profile: ${fac.email} (Auth canonicalized to User: ${user._id})`);
  }
  console.log(`✅ Faculty credential separation complete: ${migrationLog.facultyCredentialSeparation.stripped} updated.`);

  // ================================================================
  // STEP 3: UNIVERSITY TENANT ID BACKFILL (Phase 6)
  // ================================================================
  console.log('\n--- STEP 3: UNIVERSITY TENANT ID BACKFILL ---');
  const targetCollections = [
    'university_projects',
    'university_faculty',
    'university_teams',
    'university_approvals',
    'university_activities',
    'university_industry_requests'
  ];

  // Pre-load university identities
  const allUnis = await db.collection('universities').find({}).toArray();
  const uniMap = new Map();
  for (const u of allUnis) {
    if (u.code) uniMap.set(u.code.toUpperCase(), u._id);
    if (u.aisheCode) uniMap.set(u.aisheCode.toUpperCase(), u._id);
    if (u.credentials?.loginEmail) uniMap.set(u.credentials.loginEmail.toLowerCase(), u._id);
    uniMap.set(u._id.toString(), u._id);
  }

  function resolveUniId(code) {
    if (!code) return null;
    const clean = String(code).trim().toUpperCase();
    return uniMap.get(clean) || null;
  }

  for (const colName of targetCollections) {
    const docs = await db.collection(colName).find({}).toArray();
    let updated = 0;

    for (const doc of docs) {
      const targetUniId = resolveUniId(doc.universityCode);
      if (!targetUniId) {
        throw new Error(`Unresolvable universityCode "${doc.universityCode}" in ${colName} (doc id: ${doc._id})`);
      }

      await db.collection(colName).updateOne(
        { _id: doc._id },
        {
          $set: { universityId: targetUniId }
        }
      );
      updated++;
    }

    migrationLog.tenantIdBackfill[colName] = { total: docs.length, updated };
    console.log(`  ✓ ${colName.padEnd(30)} : ${updated}/${docs.length} documents backfilled with universityId`);
  }
  console.log('✅ University Tenant ID backfill complete across all 6 collections.');

  // ================================================================
  // STEP 4: INDEX CREATION (Phase 7)
  // ================================================================
  console.log('\n--- STEP 4: CREATING RECOMMENDED COMPOUND INDEXES ---');

  const indexSpecs = [
    {
      col: 'university_projects',
      key: { universityId: 1, isDeleted: 1, updatedAt: -1 },
      name: 'idx_universityId_isDeleted_updatedAt'
    },
    {
      col: 'university_faculty',
      key: { universityId: 1, status: 1 },
      name: 'idx_universityId_status'
    },
    {
      col: 'university_teams',
      key: { universityId: 1, projectId: 1 },
      name: 'idx_universityId_projectId'
    },
    {
      col: 'university_activities',
      key: { universityId: 1, timestamp: -1 },
      name: 'idx_universityId_timestamp'
    }
  ];

  for (const spec of indexSpecs) {
    const existing = await db.collection(spec.col).indexes();
    const exists = existing.some(idx => {
      const keys = Object.keys(idx.key);
      const specKeys = Object.keys(spec.key);
      return keys.length === specKeys.length && keys.every((k, i) => k === specKeys[i] && idx.key[k] === spec.key[k]);
    });

    if (exists) {
      console.log(`  - Index already exists on ${spec.col}:`, JSON.stringify(spec.key));
    } else {
      await db.collection(spec.col).createIndex(spec.key, { name: spec.name });
      migrationLog.indexesCreated.push(`${spec.col}.${spec.name}`);
      console.log(`  ✓ Created index on ${spec.col}:`, JSON.stringify(spec.key));
    }
  }
  console.log('✅ Index creation complete.');

  // ================================================================
  // STEP 5: POST-MIGRATION INVENTORY VERIFICATION
  // ================================================================
  console.log('\n--- STEP 5: POST-MIGRATION COLLECTION INVENTORY ---');
  const collections = await db.listCollections().toArray();
  for (const c of collections.sort((a, b) => a.name.localeCompare(b.name))) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`  ${c.name.padEnd(32)} : ${count}`);
  }

  migrationLog.completedAt = new Date().toISOString();
  console.log('\n🎉 CONTROLLED PHASE 4 MIGRATION EXECUTION COMPLETED SUCCESSFULLY');
  console.log('Summary:', JSON.stringify(migrationLog, null, 2));

  await closeMongo();
}

main().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
