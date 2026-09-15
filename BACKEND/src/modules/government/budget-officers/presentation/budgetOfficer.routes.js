import { Router } from 'express';
import budgetOfficerController from './budgetOfficer.controller.js';

const router = Router();

router.get('/', budgetOfficerController.getOfficers);
router.post('/', budgetOfficerController.createOfficer);
router.get('/:id', budgetOfficerController.getOfficerById);
router.put('/:id', budgetOfficerController.updateOfficer);
router.delete('/:id', budgetOfficerController.deleteOfficer);

export default router;
