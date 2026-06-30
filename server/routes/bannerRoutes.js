import express from 'express';
const router = express.Router();
import { getAllBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner } from '../controllers/bannerController.js';
import authMiddleware from '../middleware/auth.js';

router.get('/', getAllBanners);
router.get('/admin', authMiddleware, getAllBannersAdmin);
router.post('/', authMiddleware, createBanner);
router.put('/:id', authMiddleware, updateBanner);
router.delete('/:id', authMiddleware, deleteBanner);

export default router;