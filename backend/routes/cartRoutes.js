import express from 'express';
import {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All cart endpoints require user authentication

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/:id')
  .put(updateCartQuantity)
  .delete(removeFromCart);

export default router;
