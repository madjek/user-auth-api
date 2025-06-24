import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { Role } from '../constants/roles';
import { ApiError } from '../utils/apiError';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Authentication required');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: Role };
    req.user = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};
