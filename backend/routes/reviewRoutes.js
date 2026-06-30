import express from 'express';
import {
  createProductReview,
  updateProductReview,
  deleteProductReview,
  getProductReviews,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);

router.use(protect); // Editing and writing reviews require auth

router.post('/', createProductReview);
router.route('/:id')
  .put(updateProductReview)
  .delete(deleteProductReview);

export default router;
