import industryTechService from './service.js';

export class IndustryTechController {
  async getTechTools(req, res, next) {
    try {
      const industryName = req.query.industryName || req.user?.organizationName || '';
      const result = await industryTechService.getTechTools({ industryName });
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async createTechTool(req, res, next) {
    try {
      const tool = await industryTechService.createTechTool(req.body);
      return res.status(201).json({ success: true, data: tool });
    } catch (error) {
      next(error);
    }
  }

  async grantTechHelp(req, res, next) {
    try {
      const { id } = req.params;
      const result = await industryTechService.grantTechHelp(id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Technical tools and assistance successfully granted to University project.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async revokeTechHelp(req, res, next) {
    try {
      const { id, projectId } = req.params;
      const result = await industryTechService.revokeTechHelp(id, projectId);
      return res.status(200).json({
        success: true,
        message: 'Tech tool access successfully revoked.',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new IndustryTechController();
