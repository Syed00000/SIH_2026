import mongoose from 'mongoose';
import config from '../shared/config/index.js';
import Department from '../modules/government/departments/infrastructure/department.schema.js';

async function runMigration() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to DB');

    const departments = await Department.find({});
    let updatedCount = 0;

    for (const dept of departments) {
      let needsUpdate = false;
      if (!dept.credentials) {
        dept.credentials = {};
      }

      if (!dept.credentials.loginEmail) {
        const idStr = dept.deptId || dept.code || dept._id.toString().slice(-4);
        dept.credentials.loginEmail = `${idStr.toLowerCase().replace(/[^a-z0-9]/g, '')}@jharkhand.gov.in`;
        needsUpdate = true;
      }
      
      if (!dept.credentials.password && !dept.credentials.generatedPassword) {
        dept.credentials.password = `Gov@Dist2026`;
        dept.credentials.generatedPassword = `Gov@Dist2026`;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await dept.save();
        updatedCount++;
      }
    }

    console.log(`Migration complete. Updated ${updatedCount} departments.`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
