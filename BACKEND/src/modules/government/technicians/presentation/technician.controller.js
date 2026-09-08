import technicianService from '../application/technician.service.js';

export const technicianController = {
  getTechnicians: async (req, res, next) => {
    try {
      const { departmentId, departmentName, block, district, status, limit } = req.query;
      const technicians = await technicianService.getTechnicians(
        { departmentId, departmentName, block, district, status },
        { limit }
      );
      res.status(200).json({
        success: true,
        data: technicians
      });
    } catch (err) {
      next(err);
    }
  },

  getTechnicianById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const technician = await technicianService.getTechnicianById(id);
      if (!technician) {
        return res.status(404).json({ success: false, message: 'Technician not found' });
      }
      res.status(200).json({ success: true, data: technician });
    } catch (err) {
      next(err);
    }
  },

  createTechnician: async (req, res, next) => {
    try {
      const technician = await technicianService.createTechnician(req.body);
      res.status(201).json({
        success: true,
        message: 'Technician registered successfully',
        data: technician
      });
    } catch (err) {
      next(err);
    }
  },

  updateTechnician: async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await technicianService.updateTechnician(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Technician not found' });
      }
      res.status(200).json({
        success: true,
        message: 'Technician updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  deleteTechnician: async (req, res, next) => {
    try {
      const { id } = req.params;
      await technicianService.deleteTechnician(id);
      res.status(200).json({
        success: true,
        message: 'Technician deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};

export default technicianController;
