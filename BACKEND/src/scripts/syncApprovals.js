import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UniversityProject, UniversityApproval } from '../modules/university/infrastructure/model.js';

dotenv.config();

async function syncApprovals() {
  try {
    const uri = process.env.URL || process.env.MONGO_URI || 'mongodb://localhost:27017/sih_2026';
    await mongoose.connect(uri);

    const projects = await UniversityProject.find({}).lean();
    console.log(`Syncing approvals for ${projects.length} projects...`);

    for (const p of projects) {
      const budgetItems = p.budgetBreakdown?.length
        ? p.budgetBreakdown
        : [
            { category: 'Field Telemetry Sensors & Hardware Modules', amount: '₹ 35,000', amountNumber: 35000 },
            { category: 'Lab Fabrication, 3D Casing & PCB Prototyping', amount: '₹ 20,000', amountNumber: 20000 },
            { category: 'District Field Trials & On-Ground Calibration', amount: '₹ 15,000', amountNumber: 15000 },
            { category: 'Student Research Fellowship & Institutional Overhead', amount: '₹ 10,000', amountNumber: 10000 }
          ];

      const totalBudgetStr = p.budget || p.proposedBudget || '₹ 80,000';
      const methodologyStr = p.methodology || 'Edge IoT sensor array with solar telemetry harvesting for continuous water quality parameters (pH, TDS, Fluoride, Turbidity).';

      const app = await UniversityApproval.findOneAndUpdate(
        { approvalId: `APP-${p.projectId}` },
        {
          $set: {
            approvalId: `APP-${p.projectId}`,
            universityCode: p.universityCode || 'RU001',
            title: `R&D Grant Proposal & Line-Item Budget: ${p.title}`,
            type: 'R&D Grant Proposal',
            project: p.title,
            projectId: p.projectId,
            challengeId: p.challengeId,
            requestedBy: p.leadMentor || 'Dr. Binod Kumar',
            requestedByDept: p.facultyMentor?.department || 'Electrical & Electronics',
            date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            dateTime: '11:00 AM',
            status: 'Pending',
            faculty: {
              name: p.leadMentor || 'Dr. Binod Kumar',
              department: p.facultyMentor?.department || 'Electrical & Electronics'
            },
            team: {
              name: p.studentTeam || 'Student Research Team',
              membersCount: p.teamMembers?.length || 4
            },
            startDate: p.startDate || '20 May 2026',
            estimatedBudget: totalBudgetStr,
            proposedBudget: totalBudgetStr,
            methodology: methodologyStr,
            budgetBreakdown: budgetItems,
            supportTypes: ['Government Grant Funding', 'Lab Testing Bench'],
            documentsCount: 3,
            history: [
              {
                action: 'Proposal Submitted by Faculty',
                performedBy: p.leadMentor || 'Dr. Binod Kumar',
                timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, 11:00 AM`,
                note: `Itemized R&D Budget of ${totalBudgetStr} submitted for University & Government review.`
              }
            ]
          }
        },
        { upsert: true, new: true }
      );

      console.log(`✔ Created Approval: ${app.approvalId} for Project: ${p.projectId} (Budget: ${totalBudgetStr})`);
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
}

syncApprovals();
