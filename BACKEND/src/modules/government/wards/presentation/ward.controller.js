import { wardService } from '../application/ward.service.js';

export class WardController {
  constructor(service = wardService) {
    this.service = service;
  }

  async getWards(req, res, next) {
    try {
      const { district, blockId, search } = req.query;
      const wards = await this.service.getAllWards({ district, blockId, search });
      res.json({ success: true, count: wards.length, data: wards });
    } catch (err) {
      next(err);
    }
  }

  async getWardById(req, res, next) {
    try {
      const ward = await this.service.getWardById(req.params.id);
      res.json({ success: true, data: ward });
    } catch (err) {
      next(err);
    }
  }

  async createWard(req, res, next) {
    try {
      const ward = await this.service.createWard(req.body);
      res.status(201).json({ success: true, message: 'Ward registered successfully', data: ward });
    } catch (err) {
      next(err);
    }
  }

  async updateWard(req, res, next) {
    try {
      const ward = await this.service.updateWard(req.params.id, req.body);
      res.json({ success: true, message: 'Ward updated successfully', data: ward });
    } catch (err) {
      next(err);
    }
  }

  async deleteWard(req, res, next) {
    try {
      const result = await this.service.deleteWard(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export const wardController = new WardController();
export default wardController;
