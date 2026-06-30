import express from 'express';
import { body } from 'express-validator';
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration Validation Rules
const registerRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 or more characters'),
];

// Login Validation Rules
const loginRules = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/register', registerRules, registerUser);
router.post('/login', loginRules, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

export default router;
