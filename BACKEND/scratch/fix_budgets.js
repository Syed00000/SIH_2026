import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const fixBudgets = async () => {
  try {
    await mongoose.connect(process.env.URL);
    console.log('Connected to DB');
    
    const db = mongoose.connection;
    const collection = db.collection('university_projects');
    
    const projects = await collection.find({ "assignedBudgetOfficer": { $exists: true } }).toArray();
    console.log(`Found ${projects.length} projects with assignedBudgetOfficer`);
    
    let updated = 0;
    for (const p of projects) {
      if (p.assignedBudgetOfficer && (p.assignedBudgetOfficer.status === 'Assigned' || !p.assignedBudgetOfficer.status)) {
        await collection.updateOne(
          { _id: p._id },
          { $set: { "assignedBudgetOfficer.status": "Submitted" } }
        );
        updated++;
        console.log(`Updated project ${p.projectId || p.challengeId} to Submitted`);
      } else {
        console.log(`Project ${p.projectId || p.challengeId} already has status: ${p.assignedBudgetOfficer.status}`);
      }
    }
    console.log(`Successfully updated ${updated} projects.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
};

fixBudgets();
