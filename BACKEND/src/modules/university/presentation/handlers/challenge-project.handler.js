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

  return {
    getChallenges,
    updateChallengeStatus,
    assignFaculty,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    assignFacultyToProject,
    submitPrototype,
    forwardPrototypeToGovernment,
    updateGovernmentPrototypeStatus
  };
};

export default createChallengeProjectHandler;
