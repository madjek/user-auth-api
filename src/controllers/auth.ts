import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */
export const AuthController = {
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: john_doe
   *               password:
   *                 type: string
   *                 example: securePassword123
   *     responses:
   *       201:
   *         description: User registered successfully
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
  async register(req: Request, res: Response) {
    const { username, password } = AuthService.validateRegisterInput(req.body);
    const user = await AuthService.register(username, password);
    new ApiResponse(res).created({ user });
  },

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login a user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *                 example: john_doe
   *               password:
   *                 type: string
   *                 example: securePassword123
   *     responses:
   *       200:
   *         description: User logged in successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   */
  async login(req: Request, res: Response) {
    const { username, password } = AuthService.validateLoginInput(req.body);
    const { token, user } = await AuthService.login(username, password);
    new ApiResponse(res).success({ token, user });
  },

  /**
   * @swagger
   * /api/auth/reset-password/request:
   *   post:
   *     summary: Request password reset
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *             properties:
   *               username:
   *                 type: string
   *                 example: john_doe
   *     responses:
   *       200:
   *         description: If user exists, reset token has been generated
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 resetToken:
   *                   type: string
   *                   description: Normally you wouldn't return this in production
   */
  async requestPasswordReset(req: Request, res: Response) {
    const { username } = AuthService.validateResetPasswordRequest(req.body);
    const { resetToken } = await AuthService.requestPasswordReset(username);
    new ApiResponse(res).success({
      message: 'If the user exists, a reset token has been generated',
      resetToken,
    });
  },

  /**
   * @swagger
   * /api/auth/reset-password:
   *   post:
   *     summary: Reset password
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - token
   *               - newPassword
   *             properties:
   *               token:
   *                 type: string
   *                 description: Reset token received from request
   *               newPassword:
   *                 type: string
   *                 example: newSecurePassword123
   *     responses:
   *       200:
   *         description: Password has been reset successfully
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
  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = AuthService.validateResetPassword(req.body);
    await AuthService.resetPassword(token, newPassword);
    new ApiResponse(res).success({ message: 'Password has been reset successfully' });
  },
};
