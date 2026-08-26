import { Router } from 'express';
import { universityController } from './controller.js';

const router = Router();

// Public / Protected Routes for HEI Management
router.get('/', (req, res, next) => universityController.getUniversities(req, res, next));
router.post('/', (req, res, next) => universityController.createUniversity(req, res, next));
router.get('/:id', (req, res, next) => universityController.getUniversityById(req, res, next));
router.put('/:id', (req, res, next) => universityController.updateUniversity(req, res, next));
router.patch('/:id/toggle-access', (req, res, next) => universityController.toggleAccessStatus(req, res, next));
router.patch('/:id/status', (req, res, next) => universityController.updateStatus(req, res, next));
router.delete('/:id', (req, res, next) => universityController.deleteUniversity(req, res, next));

export default router;
