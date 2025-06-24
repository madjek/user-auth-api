import { UserResponse, User as UserType } from '../types';
import { UserModel } from '../models/user.model';
import { userUpdateSchema } from '../schemas/user.schema';
import { ApiError } from '../utils/apiError';

export const UserService = {
  async getAllUsers(): Promise<UserResponse[]> {
    return UserModel.findAll();
  },

  async getUserById(id: number): Promise<UserResponse> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    const { password, resetToken, resetTokenExpires, ...userResponse } = user;
    return userResponse;
  },

  async updateUser(id: number, updates: Partial<UserType>): Promise<UserResponse> {
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }
    const userUpdated = await UserModel.update(id, updates);
    const { password, resetToken, resetTokenExpires, ...userResponse } = userUpdated;
    return userResponse;
  },

  async deleteUser(id: number): Promise<void> {
    await UserModel.delete(id);
  },

  async hashPassword(password: string): Promise<string> {
    const bcrypt = await import('bcryptjs');
    return bcrypt.hash(password, 10);
  },

  validateUpdateInput(data: Partial<UserResponse>) {
    return userUpdateSchema.parse(data);
  },
};
