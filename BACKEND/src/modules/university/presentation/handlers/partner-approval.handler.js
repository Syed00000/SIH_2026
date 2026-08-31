import { extractUniversityCode } from '../helpers/code-extractor.helper.js';

export const createPartnerApprovalHandler = (service) => {
  const getPartners = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.getPartners(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const getApprovals = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.getApprovals(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const updateApproval = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const { status } = req.body;
      const data = await service.updateApproval(id, code, status);
      res.status(200).json({ status: 'SUCCESS', message: 'Approval status updated', data });
    } catch (error) { next(error); }
  };

  const deleteApproval = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RUNI-JH');
      const data = await service.deleteApproval(id, code);
      res.status(200).json({ status: 'SUCCESS', message: 'Approval deleted', data });
    } catch (error) { next(error); }
  };

  const createIndustryRequest = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.createIndustryRequest(code, req.body);
      res.status(201).json({ status: 'SUCCESS', message: 'Industry collaboration request dispatched', data });
    } catch (error) { next(error); }
  };

  const getIndustryRequests = async (req, res, next) => {
    try {
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.getIndustryRequests(code);
      res.status(200).json({ status: 'SUCCESS', data });
    } catch (error) { next(error); }
  };

  const deleteIndustryRequest = async (req, res, next) => {
    try {
      const { id } = req.params;
      const code = extractUniversityCode(req, 'RU001');
      const data = await service.deleteIndustryRequest(id, code);
      res.status(200).json({ status: 'SUCCESS', message: 'Industry request deleted', data });
    } catch (error) { next(error); }
  };

  return {
    getPartners,
    getApprovals,
    updateApproval,
    deleteApproval,
    createIndustryRequest,
    getIndustryRequests,
    deleteIndustryRequest
  };
};

export default createPartnerApprovalHandler;
