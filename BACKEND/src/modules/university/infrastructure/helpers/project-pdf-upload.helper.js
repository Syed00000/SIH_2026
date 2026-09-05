import { getStorageProvider } from '../../../../infrastructure/storage/index.js';
import { UniversityProject, UniversityTeam, UniversityApproval, UniversityActivity } from '../model.js';

export async function uploadProjectPdfDocument({ projectId, universityCode = 'RU001', file, type = 'prototype' }) {
  if (!file || !file.buffer) {
    throw new Error('No PDF file provided');
  }

  const storageProvider = getStorageProvider();
  const code = (universityCode || 'RU001').toUpperCase();
  const safeBaseName = (file.originalname || 'document.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
  const isTestingReport = type === 'testing-report';
  const folder = isTestingReport ? 'university/lab-reports' : 'university/prototypes';
  const uniqueId = `${isTestingReport ? 'lab_report' : 'proto'}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const uploadResult = await storageProvider.upload({
    buffer: file.buffer,
    originalFileName: safeBaseName,
    mimeType: 'application/pdf',
    folder,
    uniqueId,
    isPrivate: false
  });

  const rawUrl = uploadResult.accessUrl;
  const fileName = file.originalname;
  const fileSize = file.size;

  // Viewable PDF URL that streams authenticated data and opens natively in browser
  const pdfUrl = rawUrl.includes('cloudinary.com')
    ? `http://localhost:3000/api/v1/media/pdf?url=${encodeURIComponent(rawUrl)}&filename=${encodeURIComponent(fileName)}`
    : rawUrl;

  // Delete previous PDF from Cloudinary if replacing
  try {
    const existingProj = await UniversityProject.findOne({ $or: [{ projectId }, { challengeId: projectId }] }).lean();
    const oldPdfUrl = isTestingReport
      ? existingProj?.testingReportPdfUrl
      : (existingProj?.pdfUrl || existingProj?.prototypeData?.pdfUrl);

    if (oldPdfUrl && oldPdfUrl !== pdfUrl) {
      await storageProvider.delete({ providerPublicId: oldPdfUrl, resourceType: 'raw' });
    }
  } catch (err) {
    console.warn('[uploadProjectPdfDocument] Old PDF cleanup warning:', err.message);
  }

  if (isTestingReport) {
    // Pull any previous certified reports to avoid orphaned document history
    await UniversityProject.updateOne(
      { $or: [{ projectId }, { challengeId: projectId }] },
      { $pull: { documents: { type: 'Certified Industry Testing Report (PDF)' } } }
    );

    const projectDoc = await UniversityProject.findOneAndUpdate(
      { $or: [{ projectId }, { challengeId: projectId }] },
      {
        $set: {
          testingReportPdfUrl: pdfUrl,
          testingReportPdfName: fileName,
          testingReportPdfUploadedAt: new Date()
        },
        $push: {
          documents: {
            title: fileName,
            url: pdfUrl,
            type: 'Certified Industry Testing Report (PDF)',
            uploadedAt: new Date(),
            size: fileSize
          }
        }
      },
      { new: true }
    );

    const { UniversityIndustryRequest } = await import('../model.js');
    await UniversityIndustryRequest.updateMany(
      { $or: [{ projectId }, { requestId: projectId }] },
      {
        $set: {
          testingReportPdfUrl: pdfUrl,
          testingReportPdfName: fileName
        }
      }
    );

    await UniversityActivity.create({
      universityCode: code,
      text: `Certified Laboratory Testing Report PDF "${fileName}" uploaded to Cloudinary for "${projectDoc?.title || projectId}".`,
      type: 'TESTING_REPORT_PDF_UPLOADED',
      timestamp: new Date()
    });

    return {
      success: true,
      url: pdfUrl,
      fileName,
      fileSize,
      projectId,
      uploadedAt: new Date()
    };
  }

  // Pull any previous prototype reports to avoid orphaned document history
  await UniversityProject.updateOne(
    { $or: [{ projectId }, { challengeId: projectId }] },
    { $pull: { documents: { type: 'Prototype Documentation (PDF)' } } }
  );

  const projectDoc = await UniversityProject.findOneAndUpdate(
    { $or: [{ projectId }, { challengeId: projectId }] },
    {
      $set: {
        'prototypeData.pdfUrl': pdfUrl,
        'prototypeData.pdfName': fileName,
        'prototypeData.pdfUploadedAt': new Date(),
        pdfUrl,
        pdfName: fileName
      },
      $push: {
        documents: {
          title: fileName,
          url: pdfUrl,
          type: 'Prototype Documentation (PDF)',
          uploadedAt: new Date(),
          size: fileSize
        }
      }
    },
    { new: true }
  );

  await UniversityTeam.updateMany(
    { $or: [{ projectId }, { challengeId: projectId }, { teamCode: projectId }] },
    {
      $set: {
        pdfUrl,
        pdfName: fileName,
        pdfUploadedAt: new Date()
      }
    }
  );

  await UniversityApproval.updateMany(
    { $or: [{ projectId }, { challengeId: projectId }] },
    {
      $set: {
        'metadata.pdfUrl': pdfUrl,
        'metadata.pdfName': fileName,
        pdfUrl,
        pdfName: fileName
      }
    }
  );

  await UniversityActivity.create({
    universityCode: code,
    text: `Prototype technical report PDF uploaded for project "${projectDoc?.title || projectId}" to Cloudinary.`,
    type: 'PROTOTYPE_PDF_UPLOADED',
    timestamp: new Date()
  });

  return {
    success: true,
    url: pdfUrl,
    fileName,
    fileSize,
    projectId,
    uploadedAt: new Date()
  };
}

/**
 * Permanently destroys a project PDF document from Cloudinary and cleans up DB references.
 */
export async function deleteProjectPdfDocument({ projectId, universityCode = 'RU001', type = 'prototype' }) {
  const storageProvider = getStorageProvider();
  const code = (universityCode || 'RU001').toUpperCase();
  const isTestingReport = type === 'testing-report';

  const projectDoc = await UniversityProject.findOne({
    $or: [{ projectId }, { challengeId: projectId }]
  });

  if (!projectDoc) {
    return { success: false, message: `Project ${projectId} not found` };
  }

  const targetPdfUrl = isTestingReport
    ? projectDoc.testingReportPdfUrl
    : (projectDoc.pdfUrl || projectDoc.prototypeData?.pdfUrl);

  // 1. Destroy from Cloudinary
  if (targetPdfUrl) {
    try {
      await storageProvider.delete({ providerPublicId: targetPdfUrl, resourceType: 'raw' });
    } catch (err) {
      console.warn('[deleteProjectPdfDocument] Storage delete warning:', err.message);
    }
  }

  // 2. Clear from MongoDB collections
  if (isTestingReport) {
    await UniversityProject.updateOne(
      { _id: projectDoc._id },
      {
        $unset: {
          testingReportPdfUrl: 1,
          testingReportPdfName: 1,
          testingReportPdfUploadedAt: 1
        },
        $pull: {
          documents: { type: 'Certified Industry Testing Report (PDF)' }
        }
      }
    );

    const { UniversityIndustryRequest } = await import('../model.js');
    await UniversityIndustryRequest.updateMany(
      { $or: [{ projectId }, { requestId: projectId }] },
      {
        $unset: {
          testingReportPdfUrl: 1,
          testingReportPdfName: 1
        }
      }
    );
  } else {
    await UniversityProject.updateOne(
      { _id: projectDoc._id },
      {
        $unset: {
          pdfUrl: 1,
          pdfName: 1,
          'prototypeData.pdfUrl': 1,
          'prototypeData.pdfName': 1,
          'prototypeData.pdfUploadedAt': 1
        },
        $pull: {
          documents: { type: 'Prototype Documentation (PDF)' }
        }
      }
    );

    await UniversityTeam.updateMany(
      { $or: [{ projectId }, { challengeId: projectId }, { teamCode: projectId }] },
      {
        $unset: {
          pdfUrl: 1,
          pdfName: 1,
          pdfUploadedAt: 1
        }
      }
    );

    await UniversityApproval.updateMany(
      { $or: [{ projectId }, { challengeId: projectId }] },
      {
        $unset: {
          pdfUrl: 1,
          pdfName: 1,
          'metadata.pdfUrl': 1,
          'metadata.pdfName': 1
        }
      }
    );
  }

  await UniversityActivity.create({
    universityCode: code,
    text: `PDF document removed from project "${projectDoc.title || projectId}" and permanently deleted from Cloudinary.`,
    type: isTestingReport ? 'TESTING_REPORT_PDF_DELETED' : 'PROTOTYPE_PDF_DELETED',
    timestamp: new Date()
  });

  return { success: true, message: 'PDF successfully deleted from Cloudinary and project', projectId };
}

export default {
  uploadProjectPdfDocument,
  deleteProjectPdfDocument
};
