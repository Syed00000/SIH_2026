import { Router } from 'express';
import industryTechController from './controller.js';

const router = Router();

router.get('/', (req, res, next) => industryTechController.getTechTools(req, res, next));
router.post('/', (req, res, next) => industryTechController.createTechTool(req, res, next));
router.post('/:id/grant', (req, res, next) => industryTechController.grantTechHelp(req, res, next));
router.delete('/:id/grant/:projectId', (req, res, next) => industryTechController.revokeTechHelp(req, res, next));

export default router;
