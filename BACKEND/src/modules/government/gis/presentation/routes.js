import { Router } from 'express';
import { gisController } from './controller.js';

const router = Router();

// GET /api/v1/admin/gis/problems and /api/v1/government/gis/problems
router.get('/problems', (req, res, next) => gisController.getProblems(req, res, next));
router.get('/stats', (req, res, next) => gisController.getStats(req, res, next));

export default router;
