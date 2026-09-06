import { industryExpertService } from './service.js';

export const getExperts = async (req, res, next) => {
  try {
    const { industryName } = req.query;
    const data = await industryExpertService.getExperts({ industryName });
    res.status(200).json({ status: 'SUCCESS', data });
  } catch (err) {
    next(err);
  }
};

export const createExpert = async (req, res, next) => {
  try {
    const { name, designation, specialization, email, phone } = req.body;
    if (!name || !designation || !specialization || !email || !phone) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Name, designation, specialization, email, and phone are required fields.'
      });
    }
    const data = await industryExpertService.createExpert(req.body);
    res.status(201).json({ status: 'SUCCESS', message: 'Expert registered successfully', data });
  } catch (err) {
    next(err);
  }
};

export const assignProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { requestId, problemTitle } = req.body;
    if (!requestId || !problemTitle) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'requestId and problemTitle are required to assign mentorship.'
      });
    }
    const data = await industryExpertService.assignProblemToExpert(id, req.body);
    res.status(200).json({ status: 'SUCCESS', message: 'Mentorship assigned successfully', data });
  } catch (err) {
    next(err);
  }
};

export const unassignProblem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'requestId is required to unassign problem.'
      });
    }
    const data = await industryExpertService.unassignProblemFromExpert(id, requestId);
    res.status(200).json({ status: 'SUCCESS', message: 'Mentorship unassigned successfully', data });
  } catch (err) {
    next(err);
  }
};

export default {
  getExperts,
  createExpert,
  assignProblem,
  unassignProblem
};
