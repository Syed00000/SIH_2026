import {
  UniversityProject,
  UniversityFaculty,
  UniversityApproval,
  UniversityTeam,
  UniversityIndustryRequest,
  UniversityActivity
} from '../model.js';
import { CitizenChallenge } from '../../../citizen/infrastructure/model.js';
import { findUniversityIdentity } from './lookup.helper.js';

/**
 * Completely and permanently purges a problem or project and cascades deletion
 * across UniversityProject, CitizenChallenge, UniversityFaculty, UniversityApproval,
 * UniversityTeam, and UniversityIndustryRequest.
 *
 * @param {string} universityCode
 * @param {string} identifier - projectId, challengeId, or MongoDB _id
 * @param {string} deletedBy
 */
export async function cascadeDeleteProblemOrProject(universityCode, identifier, deletedBy = 'University Admin') {
  if (!identifier) return { success: false, message: 'Identifier is required' };

  const identity = await findUniversityIdentity(universityCode);
  const validCodes = identity?.validIdentifiers || [universityCode];

  const isMongoId = typeof identifier === 'string' && identifier.match(/^[0-9a-fA-F]{24}$/);

  // 1. Locate UniversityProject if existing
  const projQuery = isMongoId
    ? { _id: identifier }
    : { $or: [{ projectId: identifier }, { challengeId: identifier }] };

  let project = null;
  try {
    project = await UniversityProject.findOne(projQuery).lean();
  } catch (err) {
    console.error('[CascadeDelete] Error finding project:', err);
  }

  // 2. Locate CitizenChallenge if existing
  const chlQuery = isMongoId
    ? { $or: [{ _id: identifier }, { challengeId: identifier }] }
    : { challengeId: identifier };

  let citizenChallenge = null;
  try {
    citizenChallenge = await CitizenChallenge.findOne(chlQuery).lean();
  } catch (err) {
    console.error('[CascadeDelete] Error finding citizen challenge:', err);
  }

  const resolvedProjectId = project?.projectId || (!identifier.startsWith('CHL-') && !isMongoId ? identifier : null);
  const resolvedChallengeId = project?.challengeId || citizenChallenge?.challengeId || (identifier.startsWith('CHL-') ? identifier : null);
  const projectDbId = project?._id;
  const challengeDbId = citizenChallenge?._id;

  const projectTitle = project?.title || citizenChallenge?.title || 'Unknown Project/Problem';

  console.log(`[CascadeDelete] Purging problem/project:`, {
    resolvedProjectId,
    resolvedChallengeId,
    projectTitle,
    deletedBy
  });

  // 2b. Clean up all Cloudinary assets (PDFs, lab reports, evidence photos, media)
  try {
    const { getStorageProvider } = await import('../../../../infrastructure/storage/index.js');
    const storageProvider = getStorageProvider();

    // Collect project PDF URLs
    const projectFiles = [
      project?.pdfUrl,
      project?.prototypeData?.pdfUrl,
      project?.testingReportPdfUrl,
      ...(Array.isArray(project?.documents) ? project.documents.map(d => d.url) : [])
    ].filter(Boolean);

    for (const fileUrl of projectFiles) {
      if (typeof fileUrl === 'string' && (fileUrl.includes('cloudinary.com') || fileUrl.includes('/api/v1/media/pdf'))) {
        try {
          await storageProvider.delete({ providerPublicId: fileUrl, resourceType: 'raw' });
        } catch (_) {}
      }
    }

    // Cascade delete all challenge evidence media, photos, videos from Cloudinary
    if (resolvedChallengeId || challengeDbId) {
      const { handleCascadeDeleteChallengeMedia } = await import('../../../citizen/application/services/media/media-delete.subservice.js');
      await handleCascadeDeleteChallengeMedia(storageProvider, resolvedChallengeId || challengeDbId);
    }
  } catch (cleanErr) {
    console.warn('[CascadeDelete] Non-blocking Cloudinary media cleanup warning:', cleanErr.message);
  }

  // 3. HARD DELETE matching UniversityProject records
  try {
    const projectDeleteConditions = [];
    if (projectDbId) projectDeleteConditions.push({ _id: projectDbId });
    if (resolvedProjectId) projectDeleteConditions.push({ projectId: resolvedProjectId });
    if (resolvedChallengeId) projectDeleteConditions.push({ challengeId: resolvedChallengeId });

    if (projectDeleteConditions.length > 0) {
      const deleteResult = await UniversityProject.deleteMany({ $or: projectDeleteConditions });
      console.log(`[CascadeDelete] Deleted ${deleteResult.deletedCount} UniversityProject record(s)`);
    }
  } catch (err) {
    console.error('[CascadeDelete] Error deleting UniversityProject:', err);
  }

  // 4. UNLINK & RESET CitizenChallenge (so it never matches this university or resurrects)
  if (resolvedChallengeId) {
    try {
      await CitizenChallenge.updateMany(
        { challengeId: resolvedChallengeId },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
            deletedBy,
            status: 'Declined',
            acceptanceStatus: 'Declined',
            'milestones.2.status': 'PENDING',
            'milestones.2.completedAt': null,
            'milestones.2.remarks': `Declined and permanently removed by University (${universityCode}).`,
            'milestones.3.status': 'PENDING',
            'milestones.3.completedAt': null,
            'milestones.3.remarks': 'Removed.'
          },
          $unset: {
            assignedUniversity: 1,
            assignedFaculty: 1,
            mentorName: 1,
            mentorEmail: 1,
            media: 1,
            mediaUrls: 1,
            evidence: 1,
            attachments: 1
          }
        }
      );
      console.log(`[CascadeDelete] Unlinked, purged media, and soft-deleted CitizenChallenge ${resolvedChallengeId}`);
    } catch (err) {
      console.error('[CascadeDelete] Error unlinking CitizenChallenge:', err);
    }
  }

  // 5. CLEAN UP & DEDUPLICATE UniversityFaculty records
  try {
    const facultySearchOr = [];
    if (resolvedChallengeId) {
      facultySearchOr.push({ 'assignedChallenges.challengeId': resolvedChallengeId });
    }
    if (resolvedProjectId) {
      facultySearchOr.push({ 'assignedChallenges.challengeId': resolvedProjectId });
    }
    if (project?.facultyMentor?.email) {
      facultySearchOr.push({ email: project.facultyMentor.email.toLowerCase().trim() });
    }
    if (project?.leadMentor && project.leadMentor !== 'Unassigned') {
      facultySearchOr.push({ name: new RegExp(`^${project.leadMentor.trim()}$`, 'i') });
    }

    if (facultySearchOr.length > 0) {
      const affectedFaculties = await UniversityFaculty.find({ $or: facultySearchOr });

      for (const fac of affectedFaculties) {
        // Filter out target challenge/project
        const filteredChallenges = (fac.assignedChallenges || []).filter((item) => {
          const cid = item?.challengeId;
          const ctitle = (item?.title || '').toLowerCase().trim();
          const ptitleLower = projectTitle.toLowerCase().trim();

          const isTargetId = cid === resolvedChallengeId || cid === resolvedProjectId;
          const isTargetTitle = ptitleLower.length > 5 && ctitle === ptitleLower;

          return !isTargetId && !isTargetTitle;
        });

        // Deduplicate remaining challenges by challengeId
        const uniqueChallenges = [];
        const seenChallengeIds = new Set();
        for (const item of filteredChallenges) {
          const idKey = item?.challengeId || item?.title;
          if (idKey && !seenChallengeIds.has(idKey)) {
            seenChallengeIds.add(idKey);
            uniqueChallenges.push(item);
          }
        }

        const newActiveProjects = uniqueChallenges.length;
        const newAvailability = newActiveProjects === 0 ? 'Available' : (newActiveProjects >= 4 ? 'Busy' : 'In Project');

        await UniversityFaculty.updateOne(
          { _id: fac._id },
          {
            $set: {
              assignedChallenges: uniqueChallenges,
              activeProjects: newActiveProjects,
              availabilityStatus: newAvailability
            }
          }
        );

        console.log(`[CascadeDelete] Updated faculty ${fac.name} (${fac.email}): activeProjects ${fac.activeProjects} -> ${newActiveProjects}`);
      }
    }
  } catch (err) {
    console.error('[CascadeDelete] Error updating UniversityFaculty:', err);
  }

  // 6. PURGE UniversityApproval records
  try {
    const approvalOr = [];
    if (resolvedProjectId) {
      approvalOr.push({ projectId: resolvedProjectId }, { approvalId: `APP-${resolvedProjectId}` });
    }
    if (resolvedChallengeId) {
      approvalOr.push({ challengeId: resolvedChallengeId }, { approvalId: `APP-${resolvedChallengeId}` });
    }
    if (projectDbId) {
      approvalOr.push({ projectId: String(projectDbId) });
    }
    if (approvalOr.length > 0) {
      const res = await UniversityApproval.deleteMany({ $or: approvalOr });
      console.log(`[CascadeDelete] Purged ${res.deletedCount} UniversityApproval record(s)`);
    }
  } catch (err) {
    console.error('[CascadeDelete] Error purging UniversityApproval:', err);
  }

  // 7. PURGE UniversityTeam records
  try {
    const teamOr = [];
    if (resolvedProjectId) teamOr.push({ projectId: resolvedProjectId }, { assignedProjectId: resolvedProjectId });
    if (resolvedChallengeId) teamOr.push({ challengeId: resolvedChallengeId }, { assignedChallengeId: resolvedChallengeId });
    if (teamOr.length > 0) {
      const res = await UniversityTeam.deleteMany({ $or: teamOr });
      console.log(`[CascadeDelete] Purged ${res.deletedCount} UniversityTeam record(s)`);
    }
  } catch (err) {
    console.error('[CascadeDelete] Error purging UniversityTeam:', err);
  }

  // 8. PURGE UniversityIndustryRequest records
  try {
    const indOr = [];
    if (resolvedProjectId) indOr.push({ projectId: resolvedProjectId });
    if (resolvedChallengeId) indOr.push({ challengeId: resolvedChallengeId });
    if (indOr.length > 0) {
      const res = await UniversityIndustryRequest.deleteMany({ $or: indOr });
      console.log(`[CascadeDelete] Purged ${res.deletedCount} UniversityIndustryRequest record(s)`);
    }
  } catch (err) {
    console.error('[CascadeDelete] Error purging UniversityIndustryRequest:', err);
  }

  // 9. LOG UniversityActivity
  try {
    await UniversityActivity.create({
      universityCode: (universityCode || 'RU001').toUpperCase(),
      text: `Permanently deleted project "${projectTitle}" (${resolvedProjectId || resolvedChallengeId}) and purged all cascading assignments, faculty links, and approvals.`,
      type: 'PROJECT_DELETED',
      timestamp: new Date()
    });
  } catch (err) {
    console.warn('[CascadeDelete] Non-blocking activity log error:', err.message);
  }

  return {
    success: true,
    deletedId: identifier,
    projectId: resolvedProjectId,
    challengeId: resolvedChallengeId,
    title: projectTitle
  };
}
