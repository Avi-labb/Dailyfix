import express from 'express';
const router = express.Router();
import { 
  createOrder, 
  getOrderById, 
  getAllOrders, 
  updateOrderStatus, 
  createRazorpayOrder, 
  verifyPayment,
  createDelhiveryShipment,
  trackDelhiveryOrder,
  getShippingRate
} from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

router.post('/', createOrder);
router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.get('/:id', getOrderById);
router.get('/', authMiddleware, getAllOrders);
router.put('/:id/status', authMiddleware, updateOrderStatus);

// Delhivery Routes
router.post('/:orderId/create-shipment', authMiddleware, createDelhiveryShipment);
router.get('/:orderId/track', trackDelhiveryOrder);
router.get('/shipping/rate', getShippingRate);

export default router;