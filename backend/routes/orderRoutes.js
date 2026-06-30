import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // Orders routes require authentication

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);

export default router;
