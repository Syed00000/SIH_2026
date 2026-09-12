import express from 'express';
import { getNotices } from './notices.controller.js';

const router = express.Router();

router.get('/', getNotices);

export default router;
