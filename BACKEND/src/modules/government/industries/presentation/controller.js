import { industryService } from '../application/service.js';

export class IndustryController {
  async getIndustries(req, res, next) {
    try {
      const { search, category, thematicDomain, status, accessStatus, district, page, limit } = req.query;
      const data = await industryService.getIndustries({
        search,
        category,
        thematicDomain,
        status,
        accessStatus,
        district,
        page: page || 1,
        limit: limit || 10
      });

      res.status(200).json({
        status: 'SUCCESS',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async getIndustryById(req, res, next) {
    try {
      const { id } = req.params;
      const industry = await industryService.getIndustryById(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { industry }
      });
    } catch (error) {
      next(error);
    }
  }

  async createIndustry(req, res, next) {
    try {
      const result = await industryService.createIndustry(req.body);

      res.status(201).json({
        status: 'SUCCESS',
        message: 'Industry organization created and login credentials generated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateIndustry(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await industryService.updateIndustry(id, req.body);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'Industry organization updated successfully',
        data: { industry: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleStatus(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await industryService.toggleStatus(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: `Industry status changed to ${updated.status}`,
        data: { industry: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { id } = req.params;
      const result = await industryService.resetPassword(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'New credentials generated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteIndustry(req, res, next) {
    try {
      const { id } = req.params;
      const result = await industryService.deleteIndustry(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async seedAuthentic(req, res, next) {
    try {
      const result = await industryService.seedAuthenticIndustries();
      res.status(200).json({ status: 'SUCCESS', message: 'Authentic Jharkhand industries seeded successfully', data: result });
    } catch (err) {
      next(err);
    }
  }
}

export const industryController = new IndustryController();
export default industryController;

