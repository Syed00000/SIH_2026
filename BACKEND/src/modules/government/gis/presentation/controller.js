import { gisService } from '../application/gis.service.js';

export class GisController {
  constructor(service = gisService) {
    this.service = service;
  }

  async getProblems(req, res, next) {
    try {
      const { district, category, severity, status, dateFrom, dateTo } = req.query;
      const { problems, stats } = await this.service.getProblems({
        district,
        category,
        severity,
        status,
        dateFrom,
        dateTo
      });

      return res.status(200).json({
        success: true,
        data: problems,
        stats
      });
    } catch (err) {
      next(err);
    }
  }

  async getStats(req, res, next) {
    try {
      const { district } = req.query;
      const { stats } = await this.service.getProblems({ district });
      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  }
}

export const gisController = new GisController();
export default gisController;
