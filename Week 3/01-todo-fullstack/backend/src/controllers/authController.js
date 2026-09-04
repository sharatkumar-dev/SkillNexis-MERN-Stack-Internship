const jwt = require('jsonwebtoken');
const { UserStore } = require('../models/storeAdapter');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_skillnexis_week3_assignment1',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Name, email, and password are required fields']
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Password must be at least 6 characters long']
      });
    }

    // Check if user already exists
    const existingUser = await UserStore.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
        errors: ['An account with this email already exists']
      });
    }

    const user = await UserStore.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing credentials',
        errors: ['Please provide both email and password']
      });
    }

    // Look up user and explicitly include password field
    const user = await UserStore.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Incorrect email or password']
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: ['Incorrect email or password']
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Please provide at least a name or email to update']
      });
    }

    const updates = {};
    if (name && name.trim()) updates.name = name.trim();

    if (email && email.trim()) {
      const cleanEmail = email.toLowerCase().trim();
      // Check if another user already has this email
      const existingUser = await UserStore.findOne({ email: cleanEmail });
      if (existingUser && String(existingUser._id) !== String(req.user._id)) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
          errors: ['This email address is already registered to another account']
        });
      }
      updates.email = cleanEmail;
    }

    const updatedUser = await UserStore.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          createdAt: updatedUser.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Both current password and new password are required']
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['New password must be at least 6 characters long']
      });
    }

    // Retrieve user with password
    const user = await UserStore.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        errors: ['User session invalid']
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid current password',
        errors: ['The current password you entered is incorrect']
      });
    }

    await UserStore.findByIdAndUpdate(req.user._id, { password: newPassword });

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all tasks
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const { TodoStore } = require('../models/storeAdapter');
    await TodoStore.deleteMany({ user: req.user._id });
    await UserStore.findByIdAndDelete(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Account and all associated tasks permanently deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  deleteAccount
};
