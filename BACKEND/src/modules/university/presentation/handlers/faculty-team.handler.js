import { extractUniversityCode } from '../helpers/code-extractor.helper.js';

export const createFacultyTeamHandler = (service) => {
  const getFaculty = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.getFaculty(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const createFaculty = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.createFaculty(code, req.body);
      res.status(201).json({ status: 'SUCCESS', message: 'Faculty registered successfully', data });
    } catch (error) { next(error); }
  };

  const updateFaculty = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.updateFaculty(code, id, req.body);
      res.status(200).json({ status: 'SUCCESS', message: 'Faculty updated successfully', data });
    } catch (error) { next(error); }
  };

  const deleteFaculty = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.deleteFaculty(code, id);
      res.status(200).json({ status: 'SUCCESS', message: 'Faculty removed successfully', data });
    } catch (error) { next(error); }
  };

  const getTeams = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.getTeams(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const createTeam = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.createTeam(code, req.body);
      res.status(201).json({ status: 'SUCCESS', message: 'Team created successfully', data });
    } catch (error) { next(error); }
  };

  const updateTeam = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.updateTeam(code, id, req.body);
      res.status(200).json({ status: 'SUCCESS', message: 'Team updated successfully', data });
    } catch (error) { next(error); }
  };

  const deleteTeam = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.deleteTeam(code, id);
      res.status(200).json({ status: 'SUCCESS', message: 'Team deleted successfully', data });
    } catch (error) { next(error); }
  };

  return {
    getFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getTeams,
    createTeam,
    updateTeam,
    deleteTeam
  };
};

export default createFacultyTeamHandler;
