import { Router } from 'express';
import { industryController } from './controller.js';

const router = Router();

router.get('/', (req, res, next) => industryController.getIndustries(req, res, next));
router.post('/', (req, res, next) => industryController.createIndustry(req, res, next));
router.post('/seed-authentic', (req, res, next) => industryController.seedAuthentic(req, res, next));
router.get('/:id', (req, res, next) => industryController.getIndustryById(req, res, next));
router.put('/:id', (req, res, next) => industryController.updateIndustry(req, res, next));
router.patch('/:id/status', (req, res, next) => industryController.toggleStatus(req, res, next));
router.post('/:id/reset-password', (req, res, next) => industryController.resetPassword(req, res, next));
router.delete('/:id', (req, res, next) => industryController.deleteIndustry(req, res, next));

export default router;
