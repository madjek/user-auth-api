import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User } from '../types';
import { UserModel } from '../models/user.model';
import { Role, ROLES } from '../constants/roles';
import {
  loginSchema,
  registerSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema';
import { ApiError } from '../utils/apiError';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1D';
const RESET_TOKEN_EXPIRES_MINUTES = parseInt(process.env.RESET_TOKEN_EXPIRES_MINUTES || '10');

export const AuthService = {
  async register(username: string, password: string, role: Role = ROLES.USER): Promise<User> {
    const existingUser = await UserModel.findByUsername(username);
    if (existingUser) {
      throw new ApiError(400, 'Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return UserModel.create({ username, password: hashedPassword, role });
  },

  async login(
    username: string,
    password: string
  ): Promise<{ token: string; user: Omit<User, 'password'> }> {
    const user = await UserModel.findByUsername(username);
    if (!user) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
    });

    const { password: _, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  },

  async requestPasswordReset(username: string): Promise<{ resetToken: string }> {
    const user = await UserModel.findByUsername(username);
    if (!user) {
      // Don't reveal if user exists or not
      return { resetToken: 'dummy-token' };
    }

    const resetToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: `${RESET_TOKEN_EXPIRES_MINUTES}m`,
    });

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + RESET_TOKEN_EXPIRES_MINUTES);

    await UserModel.setResetToken(user.id, resetToken, expires);
    return { resetToken };
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch (err) {
      throw new ApiError(400, 'Invalid or expired token');
    }

    const user = await UserModel.findById(decoded.userId);
    if (!user || user.resetToken !== token || !user.resetTokenExpires) {
      throw new ApiError(400, 'Invalid or expired token');
    }

    if (new Date(user.resetTokenExpires) < new Date()) {
      throw new ApiError(400, 'Token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserModel.update(user.id, { password: hashedPassword });
    await UserModel.clearResetToken(user.id);
  },

  validateRegisterInput(data: unknown) {
    return registerSchema.parse(data);
  },

  validateLoginInput(data: unknown) {
    return loginSchema.parse(data);
  },

  validateResetPasswordRequest(data: unknown) {
    return resetPasswordRequestSchema.parse(data);
  },

  validateResetPassword(data: unknown) {
    return resetPasswordSchema.parse(data);
  },
};
