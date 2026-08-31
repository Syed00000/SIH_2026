import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: 'e:/SIH_2026/BACKEND/.env' });

async function run() {
  await mongoose.connect(process.env.URL);
  const p = await mongoose.connection.db.collection('university_projects').findOne({ projectId: 'PRJ-20268560' });
  console.log('Project in DB:');
  console.log('title:', p?.title);
  console.log('status:', p?.status);
  console.log('budgetStatus:', p?.budgetStatus);
  console.log('disbursedAmount:', p?.disbursedAmount);
  await mongoose.disconnect();
}

run();
