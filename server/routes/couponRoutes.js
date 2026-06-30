import express from 'express';
const router = express.Router();
import { getAllCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import authMiddleware from '../middleware/auth.js';

router.get('/', authMiddleware, getAllCoupons);
router.post('/validate', validateCoupon);
router.post('/', authMiddleware, createCoupon);
router.put('/:id', authMiddleware, updateCoupon);
router.delete('/:id', authMiddleware, deleteCoupon);

export default router;