import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UniversityApproval } from '../modules/university/infrastructure/model.js';

dotenv.config();

async function checkApprovals() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);

    const apps = await UniversityApproval.find({}).lean();
    console.log(`Total Approvals in MongoDB: ${apps.length}`);
    for (const a of apps) {
      console.log(`\n▶ Approval ID: ${a.approvalId}`);
      console.log(`  Title: ${a.title}`);
      console.log(`  Type: ${a.type}`);
      console.log(`  Project: ${a.project}`);
      console.log(`  Requested By: ${a.requestedBy}`);
      console.log(`  Estimated Budget: ${a.estimatedBudget}`);
      console.log(`  Proposed Budget: ${a.proposedBudget}`);
      console.log(`  Methodology: ${a.methodology?.slice(0, 50)}...`);
      console.log(`  Budget Breakdown:`, JSON.stringify(a.budgetBreakdown));
      console.log(`  Status: ${a.status}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkApprovals();
