import { Router } from 'express';
import { UserController } from '../controllers/users';
import { authMiddleware } from '../middlewares/auth';
import { roleMiddleware } from '../middlewares/roles';
import { ROLES } from '../constants/roles';

const router = Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(ROLES.ADMIN), UserController.getAllUsers);
router.get('/:id', UserController.getUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', roleMiddleware(ROLES.ADMIN), UserController.deleteUser);

export default router;
