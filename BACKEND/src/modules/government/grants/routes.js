import { Router } from 'express';
import { getFunds, createFund, updateFund, deleteFund } from './controller.js';

const router = Router();

router.get('/', getFunds);
router.post('/', createFund);
router.put('/:id', updateFund);
router.delete('/:id', deleteFund);

export default router;
