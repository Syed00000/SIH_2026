import express from 'express';
import {
  getPublicUpdates,
  getAllUpdates,
  getUpdateById,
  createUpdate,
  updateUpdate,
  deleteUpdate,
  triggerSync
} from './updates.controller.js';

export const publicUpdatesRouter = express.Router();
publicUpdatesRouter.get('/', getPublicUpdates);

export const adminUpdatesRouter = express.Router();
adminUpdatesRouter.post('/sync', triggerSync);
adminUpdatesRouter.get('/', getAllUpdates);
adminUpdatesRouter.get('/:id', getUpdateById);
adminUpdatesRouter.post('/', createUpdate);
adminUpdatesRouter.put('/:id', updateUpdate);
adminUpdatesRouter.delete('/:id', deleteUpdate);
