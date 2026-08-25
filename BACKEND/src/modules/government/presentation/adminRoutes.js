import { Router } from 'express';
import {
  getAdmins,
  getAdminStats,
  getAdminById,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin
} from './adminController.js';
import { rateLimiter } from '../../../shared/security/rate-limiter.js';

const router = Router();

const adminLimiter = rateLimiter({
  windowMs: 60000,
  max: 100,
  keyPrefix: 'rl:admins'
});

// Admin Management Endpoints
router.get('/', adminLimiter, getAdmins);
router.get('/stats', adminLimiter, getAdminStats);
router.get('/:id', adminLimiter, getAdminById);
router.post('/', adminLimiter, createAdmin);
router.put('/:id', adminLimiter, updateAdmin);
router.patch('/:id/status', adminLimiter, updateAdminStatus);
router.delete('/:id', adminLimiter, deleteAdmin);

export default router;
