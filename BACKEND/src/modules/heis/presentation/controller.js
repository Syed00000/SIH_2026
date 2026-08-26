import { universityService } from '../application/service.js';

export class UniversityController {
  async getUniversities(req, res, next) {
    try {
      const { search, district, status, accessStatus, page, limit } = req.query;
      const data = await universityService.getUniversities({
        search,
        district,
        status,
        accessStatus,
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

  async getUniversityById(req, res, next) {
    try {
      const { id } = req.params;
      const university = await universityService.getUniversityById(id);

      res.status(200).json({
        status: 'SUCCESS',
        data: { university }
      });
    } catch (error) {
      next(error);
    }
  }

  async createUniversity(req, res, next) {
    try {
      const result = await universityService.createUniversity(req.body);

      res.status(201).json({
        status: 'SUCCESS',
        message: 'University created and HEI credentials generated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUniversity(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await universityService.updateUniversity(id, req.body);

      res.status(200).json({
        status: 'SUCCESS',
        message: 'University updated successfully',
        data: { university: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  async toggleAccessStatus(req, res, next) {
    try {
      const { id } = req.params;
      const updated = await universityService.toggleAccessStatus(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: `University access status changed to ${updated.accessStatus}`,
        data: { university: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;
      const updated = await universityService.updateStatus(id, status, remarks);

      res.status(200).json({
        status: 'SUCCESS',
        message: `University review status updated to ${updated.status}`,
        data: { university: updated }
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUniversity(req, res, next) {
    try {
      const { id } = req.params;
      const result = await universityService.deleteUniversity(id);

      res.status(200).json({
        status: 'SUCCESS',
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export const universityController = new UniversityController();
export default universityController;
