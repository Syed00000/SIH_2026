import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const testDb = async () => {
  try {
    await mongoose.connect(process.env.URL);
    const db = mongoose.connection;
    const users = await db.collection('users').find({}).toArray();
    console.log('--- USERS ---');
    users.forEach(u => {
      console.log(`User: ${u.email} | ID=${u._id} | Role=${u.role} | Name=${u.fullName || u.name}`);
    });
    const bos = await db.collection('budget_officers').find({}).toArray();
    console.log('\n--- BUDGET OFFICERS ---');
    bos.forEach(bo => {
      console.log(`BO: ${bo.email} | ID=${bo._id} | Name=${bo.fullName || bo.name} | Dept=${bo.departmentName}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};
testDb();
