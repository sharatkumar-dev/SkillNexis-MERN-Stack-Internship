const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers
} = require('../controllers/auth.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (Any authenticated user)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin-only route (Role-Based Access Control)
router.get('/users', protect, authorize('admin'), getAllUsers);

module.exports = router;
