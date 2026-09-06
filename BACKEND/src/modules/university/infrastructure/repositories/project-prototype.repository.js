import { UniversityProject, UniversityApproval, UniversityActivity, UniversityTeam, UniversityChallenge, UniversityIndustryRequest } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { buildPrototypeApprovalDocument } from '../helpers/prototype-approval-builder.helper.js';
import { uploadProjectPdfDocument, deleteProjectPdfDocument } from '../helpers/project-pdf-upload.helper.js';
import { deployProjectToPublicRegistry } from '../helpers/project-deployment.helper.js';

export class ProjectPrototypeRepository {
  deployProject(projectId, code, payload = {}) { return deployProjectToPublicRegistry({ projectId, code, payload }); }
  uploadProjectPdf(projectId, code, file, type = 'prototype') { return uploadProjectPdfDocument({ projectId, universityCode: code, file, type }); }
  deleteProjectPdf(projectId, code, type = 'prototype') { return deleteProjectPdfDocument({ projectId, universityCode: code, type }); }
  async submitPrototype(projectId, universityCode, prototypeData) {
    try {
      const code = (universityCode || 'RU001').toUpperCase();
      const project = await UniversityProject.findOneAndUpdate(
        { $or: [{ projectId }, { challengeId: projectId }] },
        { 
          $set: { 
            prototypeStatus: 'In Review', 
            prototypeData,
            sentToUniversity: true,
            submittedToUniversityAt: new Date(),
            ...(prototypeData?.pdfUrl ? { pdfUrl: prototypeData.pdfUrl, pdfName: prototypeData.pdfName } : {}),
            ...(Array.isArray(prototypeData?.testingStages) && prototypeData.testingStages.length ? { testingStages: prototypeData.testingStages } : {}),
            ...(prototypeData?.industryRequisition?.selectedPartner ? { testingPartner: prototypeData.industryRequisition.selectedPartner } : {})
          } 
        },
        { new: true }
      );

      if (project) {
        await UniversityTeam.updateMany({ $or: [{ projectId: project.projectId }, { challengeId: project.challengeId }] }, { $set: { workStatus: 'Prototype Sent to University (In Review)' } });
        await UniversityActivity.create({ universityCode: code, text: `Prototype blueprint for "${project.title}" submitted by Faculty Mentor to Industry Testing Pipeline.`, type: 'PROTOTYPE_SUBMITTED', timestamp: new Date() });
        return { success: true, projectId };
      }
      return { success: false, message: 'Project not found' };
    } catch (err) {
      console.error('Error submitting prototype:', err);
      return { success: false, error: err.message };
    }
  }

  async forwardPrototypeToGovernment(projectId, universityCode, remarks = '') {
    try {
      let pId = projectId;
      if (typeof projectId === 'string' && projectId.startsWith('APP-')) {
        const appDoc = await UniversityApproval.findOne({ approvalId: projectId }).lean();
        if (appDoc?.projectId) pId = appDoc.projectId;
        else if (appDoc?.challengeId) pId = appDoc.challengeId;
      }

      const proj = await UniversityProject.findOneAndUpdate(
        { $or: [{ projectId: pId }, { challengeId: pId }] },
        {
          $set: {
            sentToGovernment: true, governmentStatus: 'Under State Evaluation', prototypeStatus: 'Approved',
            forwardedToGovAt: new Date(), adminRemarks: remarks || 'Forwarded to Government for State TRL certification.',
            trlLevel: 'TRL-7', progressPercentage: 86, milestonesCompleted: 6,
            'milestones.5.status': 'Completed', 'milestones.5.completedAt': new Date(), 'milestones.6.status': 'In Progress'
          }
        },
        { new: true }
      );

      await UniversityApproval.updateMany({ $or: [{ projectId: pId }, { challengeId: pId }, { approvalId: projectId }] }, { $set: { sentToGovernment: true, governmentStatus: 'Under State Evaluation', status: 'Approved' } });
      if (proj) {
        await CitizenChallenge.updateMany({ $or: [{ challengeId: proj.challengeId }, { challengeId: pId }] }, { $set: { stage: 'Prototype Evaluation (State TRL Review)', governmentReview: true } });
      }

      await UniversityActivity.create({
        universityCode: (universityCode || 'RU001').toUpperCase(),
        text: `Prototype Blueprint for "${proj?.title || projectId}" officially shipped & forwarded to Department of Higher & Technical Education (Government) for State TRL Evaluation.`,
        type: 'PROTOTYPE_SHIPPED_TO_GOV',
        timestamp: new Date()
      });

      return { success: true, project: proj };
    } catch (err) {
      console.error('forwardPrototypeToGovernment error:', err);
      return { success: false, error: err.message };
    }
  }

  async updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks = '', extra = {}) {
    try {
      const isApproved = status === 'Approved';
      const nextTrl = trlLevel || (isApproved ? 'TRL-9' : 'TRL-4');
      const dept = extra.department || 'Urban Development & Housing Department';

      const updateFields = {
        governmentStatus: status,
        governmentRemarks: remarks,
        trlLevel: nextTrl,
        stateCertifiedAt: isApproved ? new Date() : null,
        progressPercentage: isApproved ? 100 : 75,
        milestonesCompleted: isApproved ? 7 : 6
      };

      if (isApproved) {
        updateFields.status = 'Deployed';
        updateFields.isDeployed = true;
        updateFields.isLocked = true;
        updateFields.deployedAt = new Date();
        updateFields.handoverDepartment = dept;
        updateFields.prototypeStatus = 'Deployed';
        updateFields.budgetStatus = 'Prototype Certified & Deployed by State Government';
        updateFields['milestones.6.status'] = 'Completed';
        updateFields['milestones.6.completedAt'] = new Date();
      } else if (status === 'Changes Required') {
        updateFields.prototypeStatus = 'Changes Required';
        updateFields.budgetStatus = 'Prototype Revisions Directed by Government';
      } else if (status === 'Rejected') {
        updateFields.prototypeStatus = 'Rejected';
        updateFields.budgetStatus = 'Prototype Rejected by Government';
      }

      const proj = await UniversityProject.findOneAndUpdate(
        { $or: [{ projectId }, { challengeId: projectId }] },
        { $set: updateFields },
        { new: true }
      );

      if (proj && isApproved) {
        const cFilter = { $or: [{ challengeId: proj.challengeId }, { title: proj.title }] };
        await CitizenChallenge.updateMany(cFilter, {
          $set: {
            status: 'Deployed',
            isDeployed: true,
            isLocked: true,
            resolvedAt: new Date(),
            deployedAt: new Date(),
            prototypePdfUrl: proj.testingReportPdfUrl || proj.pdfUrl || '',
            'milestones.4.status': 'COMPLETED',
            'milestones.4.completedAt': new Date(),
            'milestones.4.remarks': `State Certified (${nextTrl}) & Handed over to ${dept}. Problem statement officially deployed on ground.`,
            resolutionDossier: {
              deployedAt: new Date(),
              department: dept,
              prototypeTitle: proj.title,
              notificationText: `Your citizen problem statement "${proj.title}" has been successfully solved! The engineered prototype has completed NABL lab testing and has been officially deployed on-ground to ${dept} for citizen benefit.`,
              sendToDepartment: Boolean(extra.sendToDepartment !== false)
            }
          }
        });

        await UniversityChallenge.updateMany(cFilter, { $set: { status: 'Deployed', actionLabel: 'Deployed & Locked', isDeployed: true, isLocked: true } });
        await UniversityApproval.updateMany({ $or: [{ challengeId: proj.challengeId }, { projectId: proj.projectId }, { project: proj.title }] }, { $set: { status: 'Deployed', isDeployed: true, isLocked: true } });
        await UniversityIndustryRequest.updateMany({ $or: [{ challengeId: proj.challengeId }, { projectId: proj.projectId }] }, { $set: { status: 'Deployed', isDeployed: true, isLocked: true } });

        try {
          const { getSocketIO } = await import('../../../../infrastructure/socket/socketServer.js');
          const io = getSocketIO();
          if (io) {
            io.emit('project_deployed', { projectId: proj.projectId, challengeId: proj.challengeId, status: 'Deployed', isLocked: true });
            io.emit('joharsetu_challenge_updated', { challengeId: proj.challengeId, status: 'Deployed', isLocked: true });
          }
        } catch (_) {}
      }

      if (proj) {
        await UniversityActivity.create({
          universityCode: proj.universityCode || 'RU001',
          text: isApproved ? `State Government (DHTE) officially APPROVED & STATE CERTIFIED (${nextTrl}) prototype for "${proj.title}". Problem statement marked as DEPLOYED and locked for citizen benefit.` : `State Government evaluation update for "${proj.title}": ${status.toUpperCase()}.${remarks ? ` Directives: "${remarks}"` : ''}`,
          type: isApproved ? 'PROTOTYPE_CERTIFIED_GOV' : 'PROTOTYPE_REVIEW_GOV',
          timestamp: new Date()
        });
      }

      return { success: true, project: proj };
    } catch (err) {
      console.error('updateGovernmentPrototypeStatus error:', err);
      return { success: false, error: err.message };
    }
  }
}

export const projectPrototypeRepository = new ProjectPrototypeRepository();
export default projectPrototypeRepository;
