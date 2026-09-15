import { budgetOfficerService } from '../application/budgetOfficer.service.js';

class BudgetOfficerController {
  async createOfficer(req, res, next) {
    try {
      const data = req.body;
      const officer = await budgetOfficerService.createOfficer(data);
      res.status(201).json({
        success: true,
        message: 'Budget Officer created successfully',
        data: officer
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ success: false, message: 'Budget Officer with this ID or Email already exists' });
      }
      next(err);
    }
  }

  async getOfficers(req, res, next) {
    try {
      const { departmentId, departmentName, district, block, panchayat, status, limit, skip } = req.query;
      const query = {};
      if (departmentId) query.departmentId = departmentId;
      if (departmentName) query.departmentName = departmentName;
      if (district) query.district = district;
      if (block) query.block = block;
      if (panchayat) query.panchayat = panchayat;
      if (status) query.status = status;

      const options = {
        limit: limit ? parseInt(limit, 10) : 100,
        skip: skip ? parseInt(skip, 10) : 0
      };

      const result = await budgetOfficerService.getOfficers(query, options);
      res.status(200).json({
        success: true,
        data: result.data,
        total: result.total
      });
    } catch (err) {
      next(err);
    }
  }

  async getOfficerById(req, res, next) {
    try {
      const officer = await budgetOfficerService.getOfficerById(req.params.id);
      res.status(200).json({
        success: true,
        data: officer
      });
    } catch (err) {
      if (err.message === 'Budget Officer not found') {
        return res.status(404).json({ success: false, message: err.message });
      }
      next(err);
    }
  }

  async updateOfficer(req, res, next) {
    try {
      const officer = await budgetOfficerService.updateOfficer(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Budget Officer updated successfully',
        data: officer
      });
    } catch (err) {
      if (err.message === 'Budget Officer not found') {
        return res.status(404).json({ success: false, message: err.message });
      }
      next(err);
    }
  }

  async deleteOfficer(req, res, next) {
    try {
      const result = await budgetOfficerService.deleteOfficer(req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (err) {
      if (err.message === 'Budget Officer not found') {
        return res.status(404).json({ success: false, message: err.message });
      }
      next(err);
    }
  }
}

export const budgetOfficerController = new BudgetOfficerController();
export default budgetOfficerController;
