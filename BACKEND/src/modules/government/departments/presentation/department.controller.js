import { departmentService } from '../application/department.service.js';

export class DepartmentController {
  constructor(service = departmentService) {
    this.service = service;
  }

  async getDepartments(req, res, next) {
    try {
      const { district, block, category, status } = req.query;
      const departments = await this.service.listDepartments({ district, block, category, status });
      return res.status(200).json({
        success: true,
        data: departments,
        count: departments.length
      });
    } catch (err) {
      next(err);
    }
  }

  async getDepartmentById(req, res, next) {
    try {
      const dept = await this.service.getDepartment(req.params.id);
      return res.status(200).json({
        success: true,
        data: dept
      });
    } catch (err) {
      next(err);
    }
  }

  async createDepartment(req, res, next) {
    try {
      const dept = await this.service.createDepartment(req.body);
      return res.status(201).json({
        success: true,
        message: 'Department created successfully in Jharkhand database',
        data: dept
      });
    } catch (err) {
      next(err);
    }
  }

  async updateDepartment(req, res, next) {
    try {
      const dept = await this.service.updateDepartment(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: dept
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteDepartment(req, res, next) {
    try {
      const result = await this.service.deleteDepartment(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Department deleted successfully',
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
}

export const departmentController = new DepartmentController();
export default departmentController;
