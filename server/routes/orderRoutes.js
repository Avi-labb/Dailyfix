import express from 'express';
const router = express.Router();
import { createOrder, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/', authMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);

export default router;