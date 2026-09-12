import { Router } from 'express';
import {
  getFunds,
  createFund,
  updateFund,
  deleteFund,
  getLedger,
  createPayment,
  authorizePayment,
  clearLedger,
  getUtilization,
  getGateways,
  pingGateway
} from './controller.js';
import grantRequestRoutes from './grant-request.routes.js';

const router = Router();

router.use('/requests', grantRequestRoutes);
router.get('/', getFunds);
router.post('/', createFund);
router.get('/ledger', getLedger);
router.post('/ledger', createPayment);
router.put('/ledger/:id/authorize', authorizePayment);
router.delete('/ledger', clearLedger);
router.get('/utilization', getUtilization);
router.get('/gateways', getGateways);
router.post('/gateways/:id/ping', pingGateway);
router.put('/:id', updateFund);
router.delete('/:id', deleteFund);

export default router;
