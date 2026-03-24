import { Request, Response, NextFunction } from 'express';
import { checkHealth } from '../services/healthService.js';

export const getHealth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = await checkHealth();
    res.status(200).json(status);
  } catch (error) {
    next(error);
  }
};
