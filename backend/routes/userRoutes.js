import express from 'express';
import {
  updateUserProfile,
  uploadProfileImage,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.put('/profile', protect, updateUserProfile);
router.post(
  '/profile-image',
  protect,
  upload.single('image'),
  uploadProfileImage
);

export default router;
