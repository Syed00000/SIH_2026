import { grantRequestService } from './grant-request.service.js';

export class GrantRequestController {
  constructor(service = grantRequestService) {
    this.service = service;
  }

  async createRequest(req, res, next) {
    try {
      const data = await this.service.createRequest(req.body);
      res.status(201).json({ success: true, message: 'Grant request submitted successfully', data });
    } catch (err) {
      next(err);
    }
  }

  async getRequests(req, res, next) {
    try {
      const { requesterDeptId, targetDeptId, status, tier, district, block, forGovernment } = req.query;
      const filter = {};
      if (requesterDeptId) filter.requesterDeptId = requesterDeptId;
      if (targetDeptId) filter.targetDeptId = targetDeptId;
      if (status) filter.status = status;
      if (tier) filter.tier = tier;
      if (forGovernment === 'true' || forGovernment === true) filter.forGovernment = true;
      if (district) filter.district = new RegExp(district, 'i');
      if (block) filter.block = new RegExp(block, 'i');

      const data = await this.service.getRequests(filter);
      res.status(200).json({ success: true, count: data.length, data });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const data = await this.service.getById(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }

  async grantRequest(req, res, next) {
    try {
      const data = await this.service.grantRequest(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Grant approved and funds disbursed successfully', data });
    } catch (err) {
      next(err);
    }
  }

  async rejectRequest(req, res, next) {
    try {
      const data = await this.service.rejectRequest(req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Grant request rejected', data });
    } catch (err) {
      next(err);
    }
  }
}

export const grantRequestController = new GrantRequestController();
export default grantRequestController;
