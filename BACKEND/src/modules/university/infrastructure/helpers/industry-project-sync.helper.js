import { UniversityProject, UniversityIndustryRequest, UniversityActivity } from '../model.js';

export async function syncIndustryApprovedProject(request) {
  if (!request || request.status !== 'Approved') return null;
  if (request.labChargesQuoted && request.quoteStatus !== 'Accepted') return null;

  try {
    const uniCode = (request.universityCode || 'RU001').toUpperCase();
    const cleanBudgetNum = Number(String(request.estimatedBudget || '').replace(/[^\d]/g, '')) || 0;
    const formattedBudget = cleanBudgetNum > 0 ? `₹ ${cleanBudgetNum.toLocaleString('en-IN')}` : '₹ 0';
    const finalBudget = request.labChargesQuoted || formattedBudget;
    const cleanDisbursedNum = Number(String(request.fundedAmount || '').replace(/[^\d]/g, '')) || 0;
    const formattedDisbursed = cleanDisbursedNum > 0 ? `₹ ${cleanDisbursedNum.toLocaleString('en-IN')}` : '₹ 0';

    const generatedProjectId = `PRJ-IND-${request.requestId ? request.requestId.replace(/[^0-9]/g, '').slice(-6) : Date.now().toString().slice(-6)}`;
    const projectId = request.projectId || generatedProjectId;

    const existingProject = await UniversityProject.findOne({
      $or: [
        { projectId },
        { title: request.projectTitle, universityCode: uniCode }
      ]
    }).lean();

    const rawGovtGrant = existingProject?.originalGovernmentGrant || existingProject?.disbursedAmount || existingProject?.sanctionedBudget || '₹ 80,000';
    const govtGrantNum = Number(String(rawGovtGrant).replace(/[^\d]/g, '')) || 80000;
    const testingFeeNum = Number(String(request.labChargesQuoted || '0').replace(/[^\d]/g, '')) || 0;
    const netUniversityBalanceNum = Math.max(0, govtGrantNum - testingFeeNum);
    const formattedNetBalance = `₹ ${netUniversityBalanceNum.toLocaleString('en-IN')}`;
    const formattedGovtGrant = `₹ ${govtGrantNum.toLocaleString('en-IN')}`;
    const formattedTestingFee = testingFeeNum > 0 ? `₹ ${testingFeeNum.toLocaleString('en-IN')}` : (request.labChargesQuoted || '₹ 0');

    const project = await UniversityProject.findOneAndUpdate(
      {
        $or: [
          { projectId },
          { title: request.projectTitle, universityCode: uniCode }
        ]
      },
      {
        $setOnInsert: {
          projectId,
          challengeId: 'CHL-INDUSTRY',
          universityCode: uniCode,
          title: request.projectTitle,
          domain: 'Industry Collaboration',
          problemStatement: request.problemStatement || request.executionOutcome || request.projectTitle,
          leadMentor: request.facultyName || 'Faculty Nodal Officer',
          facultyMentor: {
            name: request.facultyName || 'Faculty Nodal Officer',
            department: 'Engineering & Innovation',
            email: request.facultyEmail || ''
          },
          studentTeam: request.studentTeam || 'Student Research Team',
          teamMembersCount: 4,
          startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          deadline: request.duration || '3 Months',
          milestonesTotal: 4,
          milestonesCompleted: 1,
          isDeleted: false
        },
        $set: {
          status: 'In Progress',
          budgetStatus: 'Industry Approved',
          originalGovernmentGrant: formattedGovtGrant,
          sanctionedBudget: formattedNetBalance,
          disbursedAmount: formattedNetBalance,
          testingLabFee: formattedTestingFee,
          labChargesQuoted: request.labChargesQuoted || '',
          quoteStatus: request.quoteStatus || '',
          quoteTerms: request.quoteTerms || '',
          partnerName: request.partnerName || 'Industry Partner',
          partnerId: request.partnerId || '',
          testingStages: request.testingStages || [],
          'matchingApproval.sanctionedBudget': formattedNetBalance,
          'matchingApproval.disbursedAmount': formattedNetBalance,
          'matchingApproval.testingLabFee': formattedTestingFee,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    if (!request.projectId && project?.projectId) {
      await UniversityIndustryRequest.updateOne(
        { _id: request._id },
        { $set: { projectId: project.projectId } }
      );
    }

    await UniversityActivity.create({
      universityCode: uniCode,
      text: `University accepted lab testing fee of ${formattedTestingFee} from "${request.partnerName}". Net government grant balance updated to ${formattedNetBalance} (deducted from initial ${formattedGovtGrant}).`,
      type: 'INDUSTRY_APPROVED',
      user: request.partnerName || 'Industry Partner',
      time: `${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: new Date()
    });

    return project;
  } catch (err) {
    console.warn('Error in syncIndustryApprovedProject:', err);
    return null;
  }
}

export async function syncAllApprovedIndustryProjects() {
  try {
    const approvedRequests = await UniversityIndustryRequest.find({
      status: 'Approved',
      $or: [
        { labChargesQuoted: { $in: ['', null] } },
        { quoteStatus: 'Accepted' }
      ]
    }).lean();
    const synced = [];
    for (const req of approvedRequests) {
      const proj = await syncIndustryApprovedProject(req);
      if (proj) synced.push(proj);
    }
    return synced;
  } catch (err) {
    console.warn('Error in syncAllApprovedIndustryProjects:', err);
    return [];
  }
}

export default {
  syncIndustryApprovedProject,
  syncAllApprovedIndustryProjects
};
