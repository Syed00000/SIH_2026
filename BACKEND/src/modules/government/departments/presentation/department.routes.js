import { Router } from 'express';
import { departmentController } from './department.controller.js';

const router = Router();

// Department Fund Allocation collection endpoints
router.get('/fund-allocations', (req, res, next) => departmentController.getFundAllocations(req, res, next));
router.delete('/fund-allocations/:id', (req, res, next) => departmentController.deleteFundAllocation(req, res, next));

// Department Operations & CRUD
router.post('/allocate-fund', (req, res, next) => departmentController.allocateFund(req, res, next));
router.get('/', (req, res, next) => departmentController.getDepartments(req, res, next));
router.post('/', (req, res, next) => departmentController.createDepartment(req, res, next));
router.get('/:id', (req, res, next) => departmentController.getDepartmentById(req, res, next));
router.put('/:id', (req, res, next) => departmentController.updateDepartment(req, res, next));
router.post('/:id/fund-pool', (req, res, next) => departmentController.addFundPool(req, res, next));
router.delete('/:id', (req, res, next) => departmentController.deleteDepartment(req, res, next));

export default router;
