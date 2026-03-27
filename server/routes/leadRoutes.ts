import { Router } from 'express';
import { createLeadHandler } from '../controllers/leadController.js';

const router = Router();

// POST /api/leads
router.post('/', createLeadHandler);

export default router;
