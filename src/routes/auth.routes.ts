import { Router } from 'express';
import { AuthController } from '../controllers/auth';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/reset-password/request', AuthController.requestPasswordReset);
router.post('/reset-password', AuthController.resetPassword);

export default router;
