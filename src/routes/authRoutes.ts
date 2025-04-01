import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/authController';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', isAuthenticated, getCurrentUser);

export default router; 