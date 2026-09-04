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

  const getNotifications = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.getActivities(code);
      // Map activities to notification shape
      const notifications = (data || []).map((a) => ({
        id: a._id,
        title: a.type === 'INDUSTRY_APPROVED'
          ? 'Industry Collaboration Approved'
          : a.type === 'INDUSTRY_REQUEST'
          ? 'Industry Request Update'
          : a.type === 'directive' || a.type === 'REVISION_REQUESTED'
          ? 'University Revision Request'
          : a.type === 'CHALLENGE_ASSIGNED'
          ? 'Challenge Allocated'
          : a.type === 'PROPOSAL_SUBMITTED'
          ? 'Proposal Submitted'
          : a.type === 'submission' ? 'New Submission' : a.type === 'achievement' ? 'Achievement' : a.type === 'alert' ? 'Alert' : 'Directive & Feedback',
        description: a.text,
        type: a.type || 'directive',
        time: a.timestamp,
        read: false,
      }));
      res.status(200).json({ status: 'SUCCESS', data: notifications });
    } catch (error) { next(error); }
  };

  const clearNotifications = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RU001');
      await service.clearActivities(code);
      res.status(200).json({ status: 'SUCCESS', message: 'All notifications cleared' });
    } catch (error) { next(error); }
  };

  return {
    getDashboard,
    getActivities,
    clearActivities,
    getNotifications,
    clearNotifications,
    getReports,
    getProfile,
    updateProfile
  };
};

export default createDashboardProfileHandler;
