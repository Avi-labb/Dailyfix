import express from 'express';
const router = express.Router();
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllSubcategories,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
} from '../controllers/categoryController.js';
import authMiddleware from '../middleware/auth.js';

router.get('/', getAllCategories);
router.get('/subcategories', getAllSubcategories);
router.get('/:id', getCategoryById);
router.post('/', authMiddleware, createCategory);
router.put('/:id', authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);
router.post('/subcategories', authMiddleware, createSubcategory);
router.put('/subcategories/:id', authMiddleware, updateSubcategory);
router.delete('/subcategories/:id', authMiddleware, deleteSubcategory);

export default router;