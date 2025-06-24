import { Response } from 'express';

export class ApiResponse {
  constructor(private res: Response) {}

  success(data: any, statusCode = 200) {
    this.res.status(statusCode).json({
      success: true,
      ...data,
    });
  }

  created(data: any) {
    this.success(data, 201);
  }

  error(error: Error, statusCode = 500) {
    this.res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  validationError(errors: any[], statusCode = 400) {
    this.res.status(statusCode).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }
}
