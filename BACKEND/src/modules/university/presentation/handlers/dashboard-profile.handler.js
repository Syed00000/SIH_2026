import { extractUniversityCode } from '../helpers/code-extractor.helper.js';

export const createDashboardProfileHandler = (service) => {
  const getDashboard = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.getDashboard(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const getActivities = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.getActivities(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const clearActivities = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.clearActivities(code);
      res.status(200).json({ status: 'SUCCESS', message: 'All activities cleared successfully', data });
    } catch (error) { next(error); }
  };

  const getReports = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.getReports ? await service.getReports(code) : { reports: [] };
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const getProfile = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.getProfile(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const updateProfile = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.updateProfile(code, req.body, req.user);
      res.status(200).json({ status: 'SUCCESS', message: 'University profile updated successfully', data });
    } catch (error) { next(error); }
  };

  return {
    getDashboard,
    getActivities,
    clearActivities,
    getReports,
    getProfile,
    updateProfile
  };
};

export default createDashboardProfileHandler;
