import { Request, Response, NextFunction } from 'express';
import * as leadService from '../services/leadService.js';
import { AppError } from '../utils/AppError.js';

export const createLeadHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { business_id, user_name, user_phone, message } = req.body;

    // 1. Validate required fields
    if (!business_id || !user_name || !user_phone) {
      return next(new AppError('business_id, user_name, and user_phone are required fields.', 400));
    }

    // 2. Validate phone number format (basic regex: allows +, numbers, spaces, dashes, parens)
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (!phoneRegex.test(user_phone)) {
      return next(new AppError('Invalid phone number format.', 400));
    }

    // 3. Validate message length (optional but good practice)
    if (message && message.length > 1000) {
      return next(new AppError('Message is too long. Maximum 1000 characters allowed.', 400));
    }

    // 4. Submit the lead
    const newLead = await leadService.submitLead(business_id, user_name, user_phone, message || '');

    // 5. Return success response
    res.status(201).json({
      status: 'success',
      message: 'Lead submitted successfully',
      data: newLead
    });

  } catch (error) {
    // Handle specific PostgreSQL errors
    if (error instanceof Error) {
      // Foreign key violation (business_id doesn't exist in businesses table)
      if (error.message.includes('foreign key constraint')) {
        return next(new AppError('Invalid business_id. The specified business does not exist.', 404));
      }
      // Invalid UUID format for business_id
      if (error.message.includes('invalid input syntax for type uuid')) {
        return next(new AppError('Invalid business_id format. Must be a valid UUID.', 400));
      }
    }
    
    next(error);
  }
};
