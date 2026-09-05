import { UniversityProject, UniversityApproval, UniversityActivity } from '../model.js';

export async function handleIndustryTestingCompletion({ updatedReq, testingStages, code }) {
  if (!updatedReq || !Array.isArray(testingStages)) return;

  const pFilter = updatedReq.projectId
    ? { projectId: updatedReq.projectId }
    : { title: updatedReq.projectTitle };

  const allCompleted = testingStages.length > 0 && testingStages.every((s) => s.status === 'Completed');

  const updateFields = {
    testingStages,
    updatedAt: new Date()
  };

  if (allCompleted) {
    updateFields.testingCompleted = true;
    updateFields.prototypeStatus = 'Pending Approval';
    updateFields.testingPartner = updatedReq.partnerName || 'Industry Partner';
    updateFields.testingLabFee = updatedReq.labChargesQuoted || '₹ 25,000';
    updateFields.testingCompletedAt = new Date();
  }

  const proj = await UniversityProject.findOneAndUpdate(pFilter, { $set: updateFields }, { new: true });

  if (allCompleted) {
    const protoQuery = {
      $or: [
        { projectId: updatedReq.projectId },
        { challengeId: updatedReq.projectId },
        { project: updatedReq.projectTitle }
      ],
      type: 'Prototype Approval'
    };

    const existingApproval = await UniversityApproval.findOne(protoQuery);

    const historyEntry = {
      action: 'Lab Testing 100% Completed',
      performedBy: updatedReq.partnerName || 'Industry Lab Engineer',
      timestamp: `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      note: 'All testing stages successfully completed and certified in industry laboratory.'
    };

    if (existingApproval) {
      await UniversityApproval.updateOne(
        { _id: existingApproval._id },
        {
          $set: {
            status: 'Pending',
            testingCompleted: true,
            testingStages,
            partnerName: updatedReq.partnerName,
            testingVerifiedAt: new Date(),
            notes: `Laboratory testing 100% completed & lab verified by ${updatedReq.partnerName}. Ready for University prototype approval.`
          },
          $push: { history: historyEntry }
        }
      );
    } else {
      const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      await UniversityApproval.create({
        approvalId: `APP-PROTO-${Date.now()}`,
        universityCode: code,
        title: `Prototype Lab Testing Completed — ${updatedReq.projectTitle}`,
        type: 'Prototype Approval',
        project: updatedReq.projectTitle,
        projectId: updatedReq.projectId || proj?.projectId || '',
        challengeId: proj?.challengeId || '',
        requestedBy: updatedReq.partnerName || 'Industry Testing Laboratory',
        partnerName: updatedReq.partnerName,
        date: nowStr,
        dateTime: timeStr,
        faculty: proj?.facultyMentor || { name: 'Lead Faculty Coordinator', department: 'Engineering' },
        team: {
          name: proj?.teamName || proj?.studentTeam || 'Assigned Innovation Team',
          membersCount: Array.isArray(proj?.teamMembers) ? proj.teamMembers.length : 4,
          members: proj?.teamMembers || []
        },
        status: 'Pending',
        testingCompleted: true,
        testingStages,
        description: `Laboratory testing 100% completed and verified by industry partner ${updatedReq.partnerName}. Ready for prototype approval and submission to State Government.`,
        history: [historyEntry]
      });
    }

    await UniversityActivity.create({
      universityCode: code,
      text: `Industry Partner "${updatedReq.partnerName}" completed 100% laboratory testing for "${updatedReq.projectTitle}". Dossier ready in Prototype Approvals for Government submission.`,
      type: 'PROTOTYPE_TESTING_COMPLETED',
      user: updatedReq.partnerName,
      time: `${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: new Date()
    });
  }
}

export default handleIndustryTestingCompletion;
