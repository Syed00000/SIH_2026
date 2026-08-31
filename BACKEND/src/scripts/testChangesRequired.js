import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { universityDashboardRepository } from '../modules/university/infrastructure/repository.js';
import { UniversityProject, UniversityApproval } from '../modules/university/infrastructure/model.js';

dotenv.config();

async function testChangesRequiredFlow() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);

    console.log('Testing "Changes Required" flow...');
    const result = await universityDashboardRepository.updateApprovalStatus(
      'APP-PRJ-20268560',
      'RU001',
      'Changes Required',
      'Please reduce sensor component costs by ₹10,000 and add 3D printed enclosure details.'
    );

    console.log('Approval Status updated:', result?.status);

    const project = await UniversityProject.findOne({ projectId: 'PRJ-20268560' }).lean();
    console.log('Project in DB:');
    console.log('  Budget Status:', project?.budgetStatus);
    console.log('  Admin Remarks:', project?.adminRemarks);
    console.log('  Progress %:', project?.progressPercentage);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

testChangesRequiredFlow();
