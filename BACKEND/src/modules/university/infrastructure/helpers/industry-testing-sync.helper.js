import { UniversityProject, UniversityApproval, UniversityActivity } from '../model.js';

export async function handleIndustryTestingCompletion({ updatedReq, testingStages, code, extra = {} }) {
  if (!updatedReq) return;

  const shouldSubmitDossier = Boolean(extra?.submitDossier || extra?.testingDossierSubmitted);

  const resolvedStages = (Array.isArray(testingStages) && testingStages.length > 0)
    ? testingStages.map((s) => shouldSubmitDossier ? { ...s, status: 'Completed' } : s)
    : (Array.isArray(updatedReq.testingStages) && updatedReq.testingStages.length > 0
        ? updatedReq.testingStages.map((s) => shouldSubmitDossier ? { ...s, status: 'Completed' } : s)
        : [
            { stageNumber: 1, title: 'Sample Intake & Equipment Calibration', status: shouldSubmitDossier ? 'Completed' : 'In Progress', expectedDays: '5 Days', notes: 'Baseline equipment calibration verified.' },
            { stageNumber: 2, title: 'Physical & Material Stress Testing', status: shouldSubmitDossier ? 'Completed' : 'Pending', expectedDays: '10 Days', notes: 'Temperature and load tolerances passed.' },
            { stageNumber: 3, title: 'Certified Compliance & Lab Final Report', status: shouldSubmitDossier ? 'Completed' : 'Pending', expectedDays: '7 Days', notes: 'Certified testing dossier finalized.' }
          ]
      );

  const allCompleted = resolvedStages.length > 0 && resolvedStages.every((s) => (s.status || '').toLowerCase() === 'completed');
  const isSubmissionReady = shouldSubmitDossier && allCompleted;

  const pFilter = updatedReq.projectId
    ? { $or: [{ projectId: updatedReq.projectId }, { challengeId: updatedReq.projectId }, { title: updatedReq.projectTitle }] }
    : { title: updatedReq.projectTitle };

  const updateFields = { testingStages: resolvedStages, updatedAt: new Date() };

  if (extra.testingReportPdfUrl || updatedReq.testingReportPdfUrl) {
    updateFields.testingReportPdfUrl = extra.testingReportPdfUrl || updatedReq.testingReportPdfUrl;
  }
  if (extra.testingReportPdfName || updatedReq.testingReportPdfName) {
    updateFields.testingReportPdfName = extra.testingReportPdfName || updatedReq.testingReportPdfName;
  }

  if (isSubmissionReady) {
    updateFields.testingCompleted = true;
    updateFields.prototypeStatus = 'Pending Approval';
    updateFields.testingPartner = updatedReq.partnerName || 'Industry Partner';
    updateFields.testingLabFee = updatedReq.labChargesQuoted || '₹ 25,000';
    updateFields.testingCompletedAt = new Date();
  }

  const proj = await UniversityProject.findOneAndUpdate(pFilter, { $set: updateFields }, { new: true });

  if (isSubmissionReady) {
    const protoQuery = {
      $or: [
        { projectId: updatedReq.projectId },
        { challengeId: updatedReq.projectId },
        { project: updatedReq.projectTitle },
        ...(proj?.projectId ? [{ projectId: proj.projectId }] : []),
        ...(proj?.title ? [{ project: proj.title }] : [])
      ],
      type: 'Prototype Approval'
    };

    const existingApproval = await UniversityApproval.findOne(protoQuery);
    const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const reportPdfUrl = extra.testingReportPdfUrl || updatedReq.testingReportPdfUrl || proj?.testingReportPdfUrl || '';
    const reportPdfName = extra.testingReportPdfName || updatedReq.testingReportPdfName || proj?.testingReportPdfName || 'Certified_Lab_Report.pdf';
    const blueprintPdfUrl = proj?.pdfUrl || proj?.prototypeData?.pdfUrl || updatedReq.pdfUrl || '';
    const blueprintPdfName = proj?.pdfName || proj?.prototypeData?.pdfName || updatedReq.pdfName || 'Technical_Blueprint.pdf';

    const historyEntry = {
      action: 'Certified Lab Testing Dossier Submitted',
      performedBy: updatedReq.partnerName || 'Industry Lab Engineer',
      timestamp: `${nowStr}, ${timeStr}`,
      note: `100% testing stages completed. Certified lab testing report (${reportPdfName}) submitted for prototype evaluation.`
    };

    const problemStatement = proj?.problemStatement || updatedReq.problemStatement || '';

    if (existingApproval) {
      await UniversityApproval.updateOne(
        { _id: existingApproval._id },
        {
          $set: {
            status: 'Pending',
            testingCompleted: true,
            testingStages: resolvedStages,
            reportPdfUrl,
            reportPdfName,
            pdfUrl: blueprintPdfUrl,
            pdfName: blueprintPdfName,
            partnerName: updatedReq.partnerName,
            problemStatement,
            testingVerifiedAt: new Date(),
            notes: `Laboratory testing 100% completed & lab verified by ${updatedReq.partnerName}. Final report: ${reportPdfName}.`
          },
          $push: { history: historyEntry }
        }
      );
    } else {
      await UniversityApproval.create({
        approvalId: `APP-PROTO-${Date.now()}`,
        universityCode: code || updatedReq.universityCode || proj?.universityCode || 'RU001',
        title: `Prototype Lab Testing Completed — ${updatedReq.projectTitle || proj?.title}`,
        type: 'Prototype Approval',
        project: updatedReq.projectTitle || proj?.title,
        projectId: updatedReq.projectId || proj?.projectId || '',
        challengeId: proj?.challengeId || '',
        problemStatement,
        requestedBy: updatedReq.partnerName || 'Industry Testing Laboratory',
        partnerName: updatedReq.partnerName || 'Industry Testing Laboratory',
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
        testingStages: resolvedStages,
        reportPdfUrl,
        reportPdfName,
        pdfUrl: blueprintPdfUrl,
        pdfName: blueprintPdfName,
        prototypeData: proj?.prototypeData || updatedReq.prototypeData || null,
        description: `Laboratory testing 100% completed and certified by industry partner ${updatedReq.partnerName}. Official testing report (${reportPdfName}) uploaded for university evaluation.`,
        history: [historyEntry]
      });
    }

    await UniversityActivity.create({
      universityCode: code || 'RU001',
      text: `Industry Partner "${updatedReq.partnerName}" submitted certified lab report and full testing dossier for "${updatedReq.projectTitle || proj?.title}". Ready for University Prototype Approval.`,
      type: 'PROTOTYPE_TESTING_COMPLETED',
      user: updatedReq.partnerName || 'Industry Testing Laboratory',
      time: timeStr,
      timestamp: new Date()
    });
  }
}

export default handleIndustryTestingCompletion;
