import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UniversityProject } from '../modules/university/infrastructure/model.js';

dotenv.config();

async function checkProjects() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);
    console.log('--- Connected to MongoDB ---');

    const projects = await UniversityProject.find({}).lean();
    console.log(`Total projects in university_projects: ${projects.length}`);
    for (const p of projects) {
      console.log(`\n▶ ID: ${p._id}`);
      console.log(`  projectId: ${p.projectId}`);
      console.log(`  challengeId: ${p.challengeId}`);
      console.log(`  title: ${p.title}`);
      console.log(`  leadMentor: ${p.leadMentor}`);
      console.log(`  budget: ${p.budget}`);
      console.log(`  proposedBudget: ${p.proposedBudget}`);
      console.log(`  budgetBreakdown:`, JSON.stringify(p.budgetBreakdown));
      console.log(`  methodology: ${p.methodology?.slice(0, 50)}...`);
      console.log(`  status: ${p.status}`);
      console.log(`  progressPercentage: ${p.progressPercentage}`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

checkProjects();
