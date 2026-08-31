import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'e:/SIH_2026/BACKEND/.env' });

async function check() {
  await mongoose.connect(process.env.URL);
  const citizenCount = await mongoose.connection.db.collection('citizen_challenges').countDocuments();
  console.log('citizen_challenges count:', citizenCount);

  const uniProjects = await mongoose.connection.db.collection('university_projects').find({}).toArray();
  console.log('university_projects count:', uniProjects.length);
  uniProjects.forEach(p => console.log('PRJ:', p.projectId, p.title, 'Status:', p.status, 'BudgetStatus:', p.budgetStatus, 'Disbursed:', p.disbursedAmount));

  const funds = await mongoose.connection.db.collection('government_grant_funds').find({}).toArray();
  console.log('government_grant_funds count:', funds.length);
  funds.forEach(f => console.log('Fund:', f.fundId, f.name, f.amount));

  const ind = await mongoose.connection.db.collection('industries').find({}).toArray();
  let csrTotal = 0;
  ind.forEach(i => {
    csrTotal += (i.financials?.csrCommittedCr || 0);
  });
  console.log('Total Industry CSR Cr:', csrTotal);

  await mongoose.disconnect();
}

check();
