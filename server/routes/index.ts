import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import businessRoutes from './businessRoutes.js';
import leadRoutes from './leadRoutes.js';
import { searchBusinessesHandler } from '../controllers/businessController.js';

const router = Router();

// Health check route
router.get('/health', getHealth);

// Global search route (GET /api/search)
router.get('/search', searchBusinessesHandler);

// Business routes
router.use('/businesses', businessRoutes);

// Lead routes
router.use('/leads', leadRoutes);

export default router;
