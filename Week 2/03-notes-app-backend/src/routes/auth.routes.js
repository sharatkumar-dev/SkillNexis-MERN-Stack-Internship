const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;
