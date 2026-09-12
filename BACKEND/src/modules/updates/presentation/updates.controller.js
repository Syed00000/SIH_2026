import { updatesService } from '../application/updates.service.js';

// --- PUBLIC ---

export const getPublicUpdates = async (req, res, next) => {
  try {
    const updates = await updatesService.getPublicUpdates(req.query);
    res.status(200).json({
      status: 'success',
      data: {
        updates
      }
    });
  } catch (error) {
    next(error);
  }
};

// --- ADMIN ---

export const getAllUpdates = async (req, res, next) => {
  try {
    const updates = await updatesService.getAllUpdates(req.query);
    res.status(200).json({
      status: 'success',
      data: {
        updates
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getUpdateById = async (req, res, next) => {
  try {
    const update = await updatesService.getUpdateById(req.params.id);
    if (!update) return res.status(404).json({ status: 'fail', message: 'Update not found' });
    res.status(200).json({ status: 'success', data: { update } });
  } catch (error) {
    next(error);
  }
};

export const createUpdate = async (req, res, next) => {
  try {
    const newUpdate = await updatesService.createUpdate(req.body);
    res.status(201).json({ status: 'success', data: { update: newUpdate } });
  } catch (error) {
    next(error);
  }
};

export const updateUpdate = async (req, res, next) => {
  try {
    const updated = await updatesService.updateUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ status: 'fail', message: 'Update not found' });
    res.status(200).json({ status: 'success', data: { update: updated } });
  } catch (error) {
    next(error);
  }
};

export const deleteUpdate = async (req, res, next) => {
  try {
    await updatesService.deleteUpdate(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

export const triggerSync = async (req, res, next) => {
  try {
    const result = await updatesService.triggerAutoSync();
    res.status(200).json({ status: 'success', message: result.message });
  } catch (error) {
    next(error);
  }
};
