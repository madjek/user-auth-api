import { z } from 'zod';
import { ROLES } from '../constants/roles';

export const userUpdateSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum([ROLES.USER, ROLES.ADMIN]).optional(),
});
