import { getStorageProvider } from '../../../../infrastructure/storage/index.js';
import { UniversityProject, UniversityTeam, UniversityApproval, UniversityActivity } from '../model.js';

export async function uploadProjectPdfDocument({ projectId, universityCode = 'RU001', file }) {
  if (!file || !file.buffer) {
    throw new Error('No PDF file provided');
  }

  const storageProvider = getStorageProvider();
  const code = (universityCode || 'RU001').toUpperCase();
  const safeBaseName = (file.originalname || 'document.pdf').replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueId = `proto_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const uploadResult = await storageProvider.upload({
    buffer: file.buffer,
    originalFileName: safeBaseName,
    mimeType: 'application/pdf',
    folder: 'university/prototypes',
    uniqueId,
    isPrivate: false
  });

  const pdfUrl = uploadResult.accessUrl;
  const fileName = file.originalname;
  const fileSize = file.size;

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
