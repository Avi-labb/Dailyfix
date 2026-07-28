import express from 'express';
const router = express.Router();
import { login, logout, getDashboardStats, sendOtp, verifyOtp, resetPassword, getAllCustomers } from '../controllers/adminController.js';
import authMiddleware from '../middleware/auth.js';

router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/logout', authMiddleware, logout);
router.get('/dashboard', authMiddleware, getDashboardStats);
router.get('/users', authMiddleware, getAllCustomers);

export default router;