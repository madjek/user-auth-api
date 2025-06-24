import { Request } from 'express';
import { Role } from '../constants/roles';

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
  resetToken?: string | null;
  resetTokenExpires?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserResponse = Omit<User, 'password' | 'resetToken' | 'resetTokenExpires'>;

export interface TokenPayload {
  userId: number;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}
