import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { ZodError } from 'zod';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    // Handle Zod validation errors
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return new ApiResponse(res).validationError(errors);
  } else if (err instanceof ApiError) {
    // Handle custom API errors
    new ApiResponse(res).error(err, err.statusCode);
  } else {
    // Handle unexpected errors
    console.error(err);
    new ApiResponse(res).error(new ApiError(500, 'Internal Server Error'), 500);
  }
};
