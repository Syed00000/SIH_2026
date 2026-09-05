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

  if (isTestingReport) {
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

export default uploadProjectPdfDocument;
