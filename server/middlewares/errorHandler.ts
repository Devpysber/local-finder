import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message && err.message.includes('ECONNREFUSED')) {
    statusCode = 503;
    message = 'Database connection failed. Please ensure your database is running and credentials are correct.';
  } else if (err.message && err.message.includes('password authentication failed')) {
    statusCode = 401;
    message = 'Database authentication failed. Please check your database credentials.';
  } else if (err.message && err.message.includes('does not exist')) {
    statusCode = 404;
    message = `Database error: ${err.message}. Did you run the initialization script?`;
  } else if (err.message && err.message.includes('No valid DATABASE_URL')) {
    statusCode = 500;
    message = 'Database connection failed. Please set a valid DATABASE_URL in the Secrets panel.';
  } else if (process.env.NODE_ENV === 'development') {
    message = err.message; // Show actual error in development
  }

  console.error(`[Error] ${statusCode} - ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
  });
};
