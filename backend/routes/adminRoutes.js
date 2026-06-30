import express from 'express';
import {
  getDashboardStats,
  getDashboardAnalytics,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authorization check middlewares to all routes under this router
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/analytics', getDashboardAnalytics);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .delete(deleteUser);

router.route('/users/:id/role')
  .put(updateUserRole);

router.route('/orders')
  .get(getAllOrders);

router.route('/orders/:id/status')
  .put(updateOrderStatus);

export default router;
