import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'e:/SIH_2026/BACKEND/.env' });

async function run() {
  await mongoose.connect(process.env.URL);
  const res = await mongoose.connection.db.collection('university_projects').updateOne(
    { projectId: 'PRJ-20268560' },
    { $set: { budgetStatus: 'Grant Sanctioned by Government', disbursedAmount: '₹ 20,000', status: 'Active' } }
  );
  console.log('Update result:', res);
  const updated = await mongoose.connection.db.collection('university_projects').findOne({ projectId: 'PRJ-20268560' });
  console.log('Updated in DB:', updated?.projectId, updated?.budgetStatus, updated?.disbursedAmount);
  await mongoose.disconnect();
}

run();
