import express from 'express';
const router = express.Router();
import {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getFlashSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import authMiddleware from '../middleware/auth.js';

router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/:id', getProductById);
router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;