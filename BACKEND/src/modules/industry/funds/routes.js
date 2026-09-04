import { Router } from 'express';
import {
  getFunds,
  getProfile,
  createFund,
  updateFund,
  deleteFund,
  disburseFund,
  approveAndFundRequest
} from './controller.js';

const router = Router();

router.get('/profile', getProfile);
router.get('/', getFunds);
router.post('/', createFund);
router.post('/disburse', disburseFund);
router.post('/requests/:requestId/approve-fund', approveAndFundRequest);
router.put('/:id', updateFund);
router.delete('/:id', deleteFund);

export default router;
