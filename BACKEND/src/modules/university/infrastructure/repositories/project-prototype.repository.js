import { UniversityProject, UniversityApproval, UniversityActivity, UniversityTeam } from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { buildPrototypeApprovalDocument } from '../helpers/prototype-approval-builder.helper.js';
import { uploadProjectPdfDocument } from '../helpers/project-pdf-upload.helper.js';
import { deployProjectToPublicRegistry } from '../helpers/project-deployment.helper.js';

export class ProjectPrototypeRepository {
  async deployProject(projectId, universityCode, payload = {}) {
    return await deployProjectToPublicRegistry({ projectId, code: universityCode, payload });
  }
  async uploadProjectPdf(projectId, universityCode, file, type = 'prototype') {
    return await uploadProjectPdfDocument({ projectId, universityCode, file, type });
  }
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
            ...(prototypeData?.pdfUrl ? { pdfUrl: prototypeData.pdfUrl, pdfName: prototypeData.pdfName } : {})
          } 
        },
        { new: true }
      );

      if (project) {
        await UniversityTeam.updateMany(
          { $or: [{ projectId: project.projectId }, { challengeId: project.challengeId }] },
          { $set: { workStatus: 'Prototype Sent to University (In Review)' } }
        );

        const approvalPayload = buildPrototypeApprovalDocument({ code, project, prototypeData });
        const newApproval = await UniversityApproval.create(approvalPayload);

        await UniversityActivity.create({
          universityCode: code,
          text: `Prototype blueprint for "${project.title}" submitted by Faculty Mentor.`,
          type: 'PROTOTYPE_SUBMITTED',
          timestamp: new Date()
        });

        return { success: true, projectId, approvalId: newApproval.approvalId };
      }
      return { success: false, message: 'Project not found' };
    } catch (err) {
      console.error('Error submitting prototype:', err);
      return { success: false, error: err.message };
    }
  }

  async forwardPrototypeToGovernment(projectId, universityCode, remarks = '') {
    try {
      const proj = await UniversityProject.findOneAndUpdate(
        { $or: [{ projectId }, { challengeId: projectId }] },
        {
          $set: {
            sentToGovernment: true,
            governmentStatus: 'Under State Evaluation',
            prototypeStatus: 'Approved',
            forwardedToGovAt: new Date(),
            adminRemarks: remarks || 'Forwarded to Government for State TRL certification.',
            progressPercentage: 85,
            milestonesCompleted: 6
          }
        },
        { new: true }
      );

      await UniversityApproval.updateMany(
        { $or: [{ projectId }, { challengeId: projectId }], type: 'Prototype Approval' },
        { $set: { sentToGovernment: true, governmentStatus: 'Under State Evaluation', status: 'Approved' } }
      );

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

  async updateGovernmentPrototypeStatus(projectId, status, trlLevel, remarks = '') {
    try {
      const isApproved = status === 'Approved';
      const nextTrl = trlLevel || (isApproved ? 'TRL-9' : 'TRL-4');

      const updateFields = {
        governmentStatus: status,
        governmentRemarks: remarks,
        trlLevel: nextTrl,
        stateCertifiedAt: isApproved ? new Date() : null,
        progressPercentage: isApproved ? 100 : 75,
        milestonesCompleted: isApproved ? 7 : 6
      };

      if (isApproved) {
        updateFields.status = 'Completed';
        updateFields.prototypeStatus = 'Approved';
        updateFields.budgetStatus = 'Prototype Certified & Deployed by State Government';
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

      if (proj) {
        if (isApproved) {
          await CitizenChallenge.updateMany(
            { $or: [{ challengeId: proj.challengeId }, { title: proj.title }] },
            {
              $set: {
                status: 'Resolved',
                'milestones.4.status': 'COMPLETED',
                'milestones.4.completedAt': new Date(),
                'milestones.4.remarks': 'State Certified (TRL-9) & Publicly Deployed. Citizen problem resolved.'
              }
            }
          );
        }

        await UniversityActivity.create({
          universityCode: proj.universityCode || 'RU001',
          text: isApproved
            ? `State Government (DHTE) officially APPROVED & STATE CERTIFIED (${nextTrl}) prototype for "${proj.title}". Problem statement marked as RESOLVED and deployed for citizen benefit.`
            : `State Government evaluation update for "${proj.title}": ${status.toUpperCase()}.${remarks ? ` Directives: "${remarks}"` : ''}`,
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
