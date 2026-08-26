import { connectMongo } from '../src/infrastructure/database/mongo/client.js';
import MongooseUniversity from '../src/modules/government/heis/infrastructure/model.js';
import MongooseUser from '../src/modules/users/infrastructure/model.js';
import { universityService } from '../src/modules/government/heis/application/service.js';

async function run() {
  try {
    const db = await connectMongo();
    console.log(`\n Connected to MongoDB Atlas Database: "${db.databaseName}"`);

    console.log('\n--- 1. Cleaning old collections ---');
    const delUnis = await MongooseUniversity.deleteMany({});
    const delUsers = await MongooseUser.deleteMany({ role: 'UNIVERSITY' });
    console.log(`Deleted ${delUnis.deletedCount} records from "universities" collection.`);
    console.log(`Deleted ${delUsers.deletedCount} old university accounts from "users" collection.`);

    console.log('\n--- 2. Freshly Seeding into "universities" Collection ---');
    await universityService.seedDefaultJharkhandUniversities();

    const count = await MongooseUniversity.countDocuments({});
    console.log(`\n SUCCESS! Exactly ${count} Universities freshly created in "universities" collection.`);

    const records = await MongooseUniversity.find({}).sort({ createdAt: 1 }).lean();
    records.forEach((u, i) => {
      console.log(`${i + 1}. ${u.name} (${u.code})`);
      console.log(`   - Collection: "${MongooseUniversity.collection.name}"`);
      console.log(`   - Mongo ID: ${u._id}`);
      console.log(`   - District: ${u.district}`);
      console.log(`   - Login Email: ${u.credentials.loginEmail}`);
      console.log(`   - Generated Password: ${u.credentials.generatedPassword}`);
      console.log(`   - Access Status: ${u.accessStatus}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

run();
