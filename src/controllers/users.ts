import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';
import { AuthRequest } from '../types';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */
export const UserController = {
  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Get all users (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all users
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 users:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/User'
   */
  async getAllUsers(req: Request, res: Response) {
    const users = await UserService.getAllUsers();
    new ApiResponse(res).success({ users });
  },

  /**
   * @swagger
   * /api/users/{id}:
   *   get:
   *     summary: Get a user by ID
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 user:
   *                   $ref: '#/components/schemas/User'
   */
  async getUser(req: Request, res: Response) {
    const user = await UserService.getUserById(parseInt(req.params.id));
    new ApiResponse(res).success({ user });
  },

  /**
   * @swagger
   * /api/users/{id}:
   *   put:
   *     summary: Update a user
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               username:
   *                 type: string
   *                 example: new_username
   *               password:
   *                 type: string
   *                 example: newPassword123
   *               role:
   *                 type: string
   *                 enum: [user, admin]
   *     responses:
   *       200:
   *         description: User updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 user:
   *                   $ref: '#/components/schemas/User'
   */
  async updateUser(req: AuthRequest, res: Response) {
    const updates = UserService.validateUpdateInput(req.body);
    if (req.user?.role !== 'admin' && updates.role) {
      delete updates.role;
    }
    const user = await UserService.updateUser(parseInt(req.params.id), updates);
    new ApiResponse(res).success({ user });
  },

  /**
   * @swagger
   * /api/users/{id}:
   *   delete:
   *     summary: Delete a user (Admin only)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: User ID
   *     responses:
   *       200:
   *         description: User deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   */
  async deleteUser(req: Request, res: Response) {
    await UserService.deleteUser(parseInt(req.params.id));
    new ApiResponse(res).success({ message: 'User deleted successfully' });
  },
};
