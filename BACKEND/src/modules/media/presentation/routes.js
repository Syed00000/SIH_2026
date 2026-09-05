import { Router } from 'express';
import { streamPdf } from './controller.js';

const router = Router();

// Stream PDF inline for native browser viewing
router.get('/pdf', streamPdf);
router.get('/view-pdf', streamPdf);

export default router;
