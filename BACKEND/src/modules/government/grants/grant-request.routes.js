import { Router } from 'express';
import { grantRequestController } from './grant-request.controller.js';

const router = Router();

router.post('/', (req, res, next) => grantRequestController.createRequest(req, res, next));
router.get('/', (req, res, next) => grantRequestController.getRequests(req, res, next));
router.get('/:id', (req, res, next) => grantRequestController.getById(req, res, next));
router.patch('/:id/grant', (req, res, next) => grantRequestController.grantRequest(req, res, next));
router.patch('/:id/reject', (req, res, next) => grantRequestController.rejectRequest(req, res, next));

export default router;
