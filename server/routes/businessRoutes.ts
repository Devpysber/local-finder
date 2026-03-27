import { Router } from 'express';
import { getBusinessesHandler, searchBusinessesHandler, getBusinessByIdHandler } from '../controllers/businessController.js';

const router = Router();

// GET /api/businesses/search
router.get('/search', searchBusinessesHandler);

// GET /api/businesses/:id
router.get('/:id', getBusinessByIdHandler);

// GET /api/businesses
router.get('/', getBusinessesHandler);

export default router;
