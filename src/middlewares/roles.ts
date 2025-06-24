import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { Role } from '../constants/roles';
import { ApiError } from '../utils/apiError';

export const roleMiddleware = (allowedRoles: Role) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden - Insufficient permissions');
    }
    next();
  };
};
