import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UniversityProject } from '../modules/university/infrastructure/model.js';

dotenv.config();

async function testSave() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);

    const testBudgetBreakdown = [
      { category: 'Field Telemetry Sensors & Hardware Modules', amount: '₹ 35,000', amountNumber: 35000 },
      { category: 'Lab Fabrication, 3D Casing & PCB Prototyping', amount: '₹ 20,000', amountNumber: 20000 },
      { category: 'District Field Trials & On-Ground Calibration', amount: '₹ 15,000', amountNumber: 15000 },
      { category: 'Student Research Fellowship & Institutional Overhead', amount: '₹ 10,000', amountNumber: 10000 }
    ];

    const updated = await UniversityProject.findOneAndUpdate(
      { projectId: 'PRJ-20268560' },
      {
        $set: {
          methodology: 'Edge IoT sensor array with solar telemetry harvesting for continuous water quality parameters (pH, TDS, Fluoride, Turbidity).',
          budget: '₹ 80,000',
          proposedBudget: '₹ 80,000',
          budgetBreakdown: testBudgetBreakdown,
          budgetStatus: 'Submitted to University for Review',
          milestonesCompleted: 3,
          progressPercentage: 43
        }
      },
      { new: true }
    );

    console.log('✔ Updated Project in MongoDB:', updated?.projectId);
    console.log('  Budget:', updated?.budget);
    console.log('  Proposed Budget:', updated?.proposedBudget);
    console.log('  Budget Breakdown:', JSON.stringify(updated?.budgetBreakdown));
    console.log('  Methodology:', updated?.methodology);
    console.log('  Budget Status:', updated?.budgetStatus);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

testSave();
