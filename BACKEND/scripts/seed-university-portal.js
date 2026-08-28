import dotenv from 'dotenv';
import { connectMongo, closeMongo } from '../src/infrastructure/database/mongo/client.js';
import {
  UniversityChallenge,
  UniversityProject,
  UniversityFaculty,
  UniversityTeam,
  UniversityPartner,
  UniversityApproval,
  UniversityActivity
} from '../src/modules/university/infrastructure/model.js';
import {
  FULL_CHALLENGES_DATA,
  FULL_PROJECTS_DATA,
  FULL_FACULTY_DATA,
  FULL_TEAMS_DATA,
  FULL_PARTNERS_DATA,
  FULL_APPROVALS_DATA,
  FULL_ACTIVITIES_DATA
} from '../src/modules/university/application/seedChallengesData.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectMongo();
    console.log('🌱 Populating 100% comprehensive live collections in MongoDB Atlas...');

    const uniCodes = ['RU001', 'RUNI-JH', 'BITM-008', 'BIT-JH', 'BAU002', 'KU003', 'CUJ-2026', 'SKBU006', 'UMU-2026'];

    for (const code of uniCodes) {
      await UniversityChallenge.deleteMany({ universityCode: code });
      await UniversityProject.deleteMany({ universityCode: code });
      await UniversityFaculty.deleteMany({ universityCode: code });
      await UniversityTeam.deleteMany({ universityCode: code });
      await UniversityPartner.deleteMany({ universityCode: code });
      await UniversityApproval.deleteMany({ universityCode: code });
      await UniversityActivity.deleteMany({ universityCode: code });

      await UniversityChallenge.insertMany(FULL_CHALLENGES_DATA.map(c => ({ ...c, universityCode: code, assignedOn: new Date(c.assignedOn || Date.now()) })));
      await UniversityProject.insertMany(FULL_PROJECTS_DATA.map(p => ({ ...p, universityCode: code, startDate: new Date() })));
      await UniversityFaculty.insertMany(FULL_FACULTY_DATA.map(f => ({ ...f, universityCode: code })));
      await UniversityTeam.insertMany(FULL_TEAMS_DATA.map(t => ({ ...t, universityCode: code })));
      await UniversityPartner.insertMany(FULL_PARTNERS_DATA.map(pt => ({ ...pt, universityCode: code })));
      await UniversityApproval.insertMany(FULL_APPROVALS_DATA.map(ap => ({ ...ap, universityCode: code })));
      await UniversityActivity.insertMany(FULL_ACTIVITIES_DATA.map(a => ({ ...a, universityCode: code, timestamp: new Date() })));

      console.log(`✅ Seeded complete collections for: ${code}`);
    }

    console.log('\n🎉 MongoDB Atlas successfully populated with 100% real live data!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await closeMongo();
    process.exit(0);
  }
};

seedDatabase();
