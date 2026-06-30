import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Wishlist routes require auth

router.route('/')
  .get(getWishlist)
  .post(addToWishlist);

router.route('/:productId')
  .delete(removeFromWishlist);

export default router;
