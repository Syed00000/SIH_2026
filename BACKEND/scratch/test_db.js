import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const testDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Using strict: false model or native collection
    const projects = await mongoose.connection.collection('university_projects').find({}).toArray();
    console.log('Total Projects:', projects.length);
    
    const assignedProjects = projects.filter(p => p.assignedBudgetOfficer);
    console.log('Projects with assignedBudgetOfficer:', assignedProjects.length);
    
    assignedProjects.forEach(p => {
      console.log(`Project ${p.projectId || p.challengeId}: BO Status = ${p.assignedBudgetOfficer?.status}`);
    });
    
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

testDb();
