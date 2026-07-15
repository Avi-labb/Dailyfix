import express from 'express';
const router = express.Router();
import { 
  createOrder, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus,
  trackDelhiveryOrder,
  getShippingRate
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

router.post('/', createOrder);
router.get('/:id', getOrderById);
router.get('/', authMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);

// Delhivery Routes
router.get('/:orderId/track', trackDelhiveryOrder);
router.get('/shipping/rate', getShippingRate);

export default router;