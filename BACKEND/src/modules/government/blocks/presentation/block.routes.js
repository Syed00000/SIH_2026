import { Router } from 'express';
import { blockController } from './block.controller.js';

const router = Router();

router.get('/', (req, res, next) => blockController.getBlocks(req, res, next));
router.get('/:id', (req, res, next) => blockController.getBlockById(req, res, next));
router.post('/', (req, res, next) => blockController.createBlock(req, res, next));
router.put('/:id', (req, res, next) => blockController.updateBlock(req, res, next));
router.delete('/:id', (req, res, next) => blockController.deleteBlock(req, res, next));

export default router;
