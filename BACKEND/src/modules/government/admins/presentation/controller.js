import { adminService } from '../application/service.js';
import { calculateStats } from '../infrastructure/helpers/admin-stats.helper.js';

export { calculateStats };

export const getAdmins = async (req, res, next) => {
  try {
    const result = await adminService.getAdmins(req.query);
    res.json({
      success: true,
      stats: result.stats,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const stats = await calculateStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const getAdminById = async (req, res, next) => {
  try {
    const data = await adminService.getAdminById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const data = await adminService.createAdmin(req.body);
    res.status(201).json({
      success: true,
      message: 'Administrator created successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const data = await adminService.updateAdmin(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Administrator updated successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminStatus = async (req, res, next) => {
  try {
    const data = await adminService.updateAdminStatus(req.params.id, req.body.status);
    res.json({
      success: true,
      message: `Administrator status changed to ${req.body.status}`,
      data
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdmin = async (req, res, next) => {
  try {
    await adminService.deleteAdmin(req.params.id);
    res.json({ success: true, message: 'Administrator permanently removed from database' });
  } catch (error) {
    next(error);
  }
};

export default {
  calculateStats,
  getAdmins,
  getAdminStats,
  getAdminById,
  createAdmin,
  updateAdmin,
  updateAdminStatus,
  deleteAdmin
};
