import { Router } from 'express';
import {
  getExperts,
  createExpert,
  assignProblem,
  unassignProblem
} from './controller.js';

const router = Router();

router.get('/', getExperts);
router.post('/', createExpert);
router.post('/:id/assign', assignProblem);
router.post('/:id/unassign', unassignProblem);

export default router;
