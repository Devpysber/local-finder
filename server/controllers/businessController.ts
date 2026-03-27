import { Request, Response, NextFunction } from 'express';
import * as businessService from '../services/businessService.js';
import { AppError } from '../utils/AppError.js';

export const getBusinessesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Parse query parameters for pagination
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    // Validate pagination inputs
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Page and limit must be positive integers.'
      });
    }

    // Fetch businesses using the service layer
    const result = await businessService.fetchBusinesses(page, limit);

    // Return clean JSON response
    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error); // Pass to centralized error handler
  }
};

export const searchBusinessesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    
    const searchQuery = req.query.q as string | undefined;
    const city = req.query.city as string | undefined;
    const category = req.query.category as string | undefined;

    if (page < 1 || limit < 1) {
      return res.status(400).json({
        status: 'error',
        message: 'Page and limit must be positive integers.'
      });
    }

    const result = await businessService.searchBusinesses(searchQuery, city, category, page, limit);

    res.status(200).json({
      status: 'success',
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getBusinessByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new AppError('Business ID is required', 400));
    }

    const business = await businessService.fetchBusinessById(id);

    if (!business) {
      return next(new AppError('Business not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: business
    });
  } catch (error) {
    // If the error is a UUID syntax error from Postgres, return a 400 instead of 500
    if (error instanceof Error && error.message.includes('invalid input syntax for type uuid')) {
      return next(new AppError('Invalid Business ID format', 400));
    }
    next(error);
  }
};
