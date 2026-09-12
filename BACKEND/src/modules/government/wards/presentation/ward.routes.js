import { Router } from 'express';
import { wardController } from './ward.controller.js';

const router = Router();

router.get('/', (req, res, next) => wardController.getWards(req, res, next));
router.get('/:id', (req, res, next) => wardController.getWardById(req, res, next));
router.post('/', (req, res, next) => wardController.createWard(req, res, next));
router.put('/:id', (req, res, next) => wardController.updateWard(req, res, next));
router.delete('/:id', (req, res, next) => wardController.deleteWard(req, res, next));

export default router;
