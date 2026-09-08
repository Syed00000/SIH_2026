import { Router } from 'express';
import technicianController from './technician.controller.js';

const router = Router();

router.get('/', technicianController.getTechnicians);
router.post('/', technicianController.createTechnician);
router.get('/:id', technicianController.getTechnicianById);
router.put('/:id', technicianController.updateTechnician);
router.delete('/:id', technicianController.deleteTechnician);

export default router;
