import mongoose from 'mongoose';
import { UniversityProject, UniversityActivity } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';

export async function deployProjectToPublicRegistry({ projectId, code = 'RU001', payload = {} }) {
  const isOid = mongoose.Types.ObjectId.isValid(projectId) && String(new mongoose.Types.ObjectId(projectId)) === String(projectId);
  const pFilter = isOid
    ? { $or: [{ _id: projectId }, { projectId }, { challengeId: projectId }, { title: projectId }] }
    : { $or: [{ projectId }, { challengeId: projectId }, { title: projectId }] };

  const updateFields = {
    status: 'Deployed',
    stage: 'Deployed to Citizen Registry',
    isDeployed: true,
    deployedAt: new Date(),
    deploymentRemarks: payload.remarks || 'Publicly deployed by State Government (DHTE) with certified prototype dossier.',
    trlLevel: 'TRL-9',
    updatedAt: new Date()
  };

  const proj = await UniversityProject.findOneAndUpdate(pFilter, { $set: updateFields }, { new: true });
  if (!proj) {
    return { success: false, message: 'Project not found' };
  }

  const pdfUrl = proj.testingReportPdfUrl || proj.pdfUrl || payload.pdfUrl || '';
  const pdfName = proj.testingReportPdfName || proj.pdfName || payload.pdfName || 'Certified_Prototype_Dossier.pdf';

  // Update matching CitizenChallenge so citizens see the resolution with prototype PDF
  const citizenUpdate = {
    status: 'Resolved',
    resolvedAt: new Date(),
    resolutionDossier: {
      deployedAt: new Date(),
      status: 'Deployed & Active',
      prototypePdfUrl: pdfUrl,
      prototypePdfName: pdfName,
      hei: proj.university || proj.institution || 'Ranchi University',
      leadMentor: proj.facultyMentor?.name || proj.faculty || 'Lead Faculty Investigator',
      studentTeam: proj.studentTeam || proj.teamName || 'Student Innovation Team',
      remarks: 'Certified solution successfully deployed to public registry for citizen benefit.'
    },
    'milestones.3.status': 'COMPLETED',
    'milestones.4.status': 'COMPLETED',
    'milestones.4.completedAt': new Date(),
    'milestones.4.remarks': 'Publicly deployed with verified prototype dossier.'
  };

  if (pdfUrl) {
    citizenUpdate.prototypePdfUrl = pdfUrl;
    citizenUpdate.prototypePdfName = pdfName;
    citizenUpdate.solutionPdfUrl = pdfUrl;
  }

  await CitizenChallenge.collection.updateMany(
    { $or: [{ challengeId: proj.challengeId }, { title: proj.title }] },
    { $set: citizenUpdate }
  );

  const uniFilter = {
    $or: [
      { projectId: proj.projectId },
      { challengeId: proj.challengeId },
      { title: proj.title },
      { project: proj.title }
    ]
  };

  await Promise.allSettled([
    mongoose.connection.db.collection('university_approvals').updateMany(
      uniFilter,
      { $set: { governmentStatus: 'Approved & Deployed', status: 'Deployed', isDeployed: true, isLocked: true } }
    ),
    mongoose.connection.db.collection('university_industry_requests').updateMany(
      uniFilter,
      { $set: { testingStatus: 'Completed & Deployed', isDeployed: true, isLocked: true } }
    ),
    mongoose.connection.db.collection('university_challenges').updateMany(
      { $or: [{ challengeId: proj.challengeId }, { title: proj.title }] },
      { $set: { status: 'Resolved', stage: 'Deployed', isDeployed: true, isLocked: true } }
    ),
    mongoose.connection.db.collection('university_teams').updateMany(
      { $or: [{ projectId: proj.projectId }, { challengeId: proj.challengeId }] },
      { $set: { isDeployed: true, status: 'Deployed', isLocked: true } }
    ),
    mongoose.connection.db.collection('university_faculty').updateMany(
      {
        $or: [
          { name: proj.leadMentor },
          { name: proj.facultyMentor?.name },
          { email: proj.facultyMentor?.email },
          { 'assignedChallenges.challengeId': proj.challengeId }
        ].filter(Boolean)
      },
      {
        $set: {
          availabilityStatus: 'Available',
          isDeployed: true,
          activeProjects: 0
        },
        $inc: { completedProjects: 1 }
      }
    )
  ]);

  await UniversityActivity.create({
    universityCode: proj.universityCode || code,
    text: `State Government (DHTE) officially DEPLOYED "${proj.title}" to Public Citizen Registry. Challenge marked as RESOLVED with certified prototype dossier.`,
    type: 'PROJECT_DEPLOYED_PUBLIC',
    user: 'State Government Admin',
    time: `${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
    timestamp: new Date()
  });

  return { success: true, project: proj, citizenUpdated: true };
}

export default deployProjectToPublicRegistry;
