import express from 'express';
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin-only category modifications
router.post('/', protect, admin, upload.single('image'), createCategory);
router.put('/:id', protect, admin, upload.single('image'), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
