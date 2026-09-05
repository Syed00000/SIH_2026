import { extractUniversityCode } from '../helpers/code-extractor.helper.js';

export const createChallengeProjectHandler = (service) => {
  const getChallenges = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.getChallenges(code, req.query);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const updateChallengeStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const { status, actionLabel, remarks, query, declineReason, clarificationQuery } = req.body;
      const updated = await service.updateChallengeStatus(id, code, status, actionLabel, {
        clarificationQuery: clarificationQuery || query || remarks || '',
        query: query || clarificationQuery || remarks || '',
        declineReason: declineReason || '',
        declineRemarks: remarks || '',
        remarks: remarks || query || clarificationQuery || ''
      });
      res.status(200).json({ status: 'SUCCESS', message: 'Challenge status updated', data: updated });
    } catch (error) { next(error); }
  };

  const assignFaculty = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const { facultyInfo } = req.body;
      const updated = await service.assignFaculty(id, code, facultyInfo);
      res.status(200).json({ status: 'SUCCESS', message: 'Faculty assigned successfully', data: updated });
    } catch (error) { next(error); }
  };

  const deleteChallenge = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.deleteChallenge(code, id);
      res.status(200).json({ status: 'SUCCESS', message: 'Challenge removed and purged successfully', data });
    } catch (error) { next(error); }
  };

  const getProjects = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.getProjects(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const createProject = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.createProject(code, req.body);
      res.status(201).json({ status: 'SUCCESS', message: 'Project registered successfully', data });
    } catch (error) { next(error); }
  };

  const updateProject = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.updateProject(code, id, req.body);
      res.status(200).json({ status: 'SUCCESS', message: 'Project updated successfully', data });
    } catch (error) { next(error); }
  };

  const deleteProject = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.deleteProject(code, id);
      res.status(200).json({ status: 'SUCCESS', message: 'Project removed successfully', data });
    } catch (error) { next(error); }
  };

  const assignFacultyToProject = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RU001');
      const facultyInfo = req.body.facultyInfo || req.body;
      const data = await service.assignFacultyToProject(code, id, facultyInfo);
      res.status(200).json({ status: 'SUCCESS', message: 'Faculty mentor assigned to project successfully', data });
    } catch (error) { next(error); }
  };

  const submitPrototype = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.submitPrototype(id, code, req.body);
      res.status(200).json({ status: 'SUCCESS', message: 'Prototype submitted successfully', data });
    } catch (error) { next(error); }
  };

  const forwardPrototypeToGovernment = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RU001');
      const { remarks } = req.body;
      const data = await service.forwardPrototypeToGovernment(id, code, remarks);
      res.status(200).json({ status: 'SUCCESS', message: 'Prototype forwarded to Government successfully', data });
    } catch (error) { next(error); }
  };

  const updateGovernmentPrototypeStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status, trlLevel, remarks } = req.body;
      const data = await service.updateGovernmentPrototypeStatus(id, status, trlLevel, remarks);
      res.status(200).json({ status: 'SUCCESS', message: 'Government prototype evaluation updated', data });
    } catch (error) { next(error); }
  };

  const requestTranche = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RU001');
      const { amount, requestedTranche, reason } = req.body;
      const trancheRequest = {
        status: 'Pending',
        requestedTranche: Number(requestedTranche) || 2,
        amount: Number(amount) || 40000,
        formattedAmount: `₹ ${(Number(amount) || 40000).toLocaleString('en-IN')}`,
        reason: reason || 'Milestone deliverables validated. Requesting release of second EMI.',
        requestedAt: new Date(),
        requestedBy: code === 'RU001' ? 'Ranchi University (RU001)' : `Nodal University (${code})`
      };
      const updated = await service.updateProject(code, id, { trancheRequest });
      
      const { UniversityApproval, UniversityActivity } = await import('../../infrastructure/model.js');
      await UniversityApproval.updateMany(
        { $or: [{ projectId: id }, { challengeId: id }, { approvalId: id }, { approvalId: `APP-${id}` }] },
        { $set: { trancheRequest } }
      ).catch(() => {});
      await UniversityActivity.create({
        universityCode: code,
        text: `🏛️ University requested Second Installment / EMI (${trancheRequest.formattedAmount}) from Government for project.`,
        type: 'directive',
        timestamp: new Date()
      }).catch(() => {});

      res.status(200).json({ status: 'SUCCESS', message: 'Second EMI (Tranche) requested successfully', data: updated });
    } catch (error) { next(error); }
  };

  const uploadProjectPdf = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RU001');
      if (!req.file) {
        return res.status(400).json({ success: false, error: { message: 'No PDF file uploaded' } });
      }
      const uploadType = req.body?.type || req.query?.type || 'prototype';
      const data = await service.uploadProjectPdf(id, code, req.file, uploadType);
      res.status(200).json({ status: 'SUCCESS', message: 'PDF uploaded to Cloudinary successfully', data });
    } catch (error) { next(error); }
  };

  const deployProject = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.deployProject(id, code, req.body);
      res.status(200).json({ status: 'SUCCESS', message: 'Project deployed to public registry', data });
    } catch (error) { next(error); }
  };

  return {
    getChallenges,
    updateChallengeStatus,
    assignFaculty,
    deleteChallenge,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    assignFacultyToProject,
    submitPrototype,
    forwardPrototypeToGovernment,
    updateGovernmentPrototypeStatus,
    requestTranche,
    uploadProjectPdf,
    deployProject
  };
};

export default createChallengeProjectHandler;
