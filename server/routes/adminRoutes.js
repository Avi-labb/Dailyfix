import express from 'express';
const router = express.Router();
import { login, logout, getDashboardStats } from '../controllers/adminController.js';
import authMiddleware from '../middleware/auth.js';

router.post('/login', login);
router.post('/logout', authMiddleware, logout);
router.get('/dashboard', authMiddleware, getDashboardStats);

export default router;