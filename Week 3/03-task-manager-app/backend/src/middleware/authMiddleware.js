const jwt = require('jsonwebtoken');
const { UserStore } = require('../models/storeAdapter');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
      errors: ['Authorization token is required to access this resource']
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'skillnexis_task_manager_jwt_secret_2026_super_secure_key'
    );
    const user = await UserStore.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User not found.',
        errors: ['User associated with this token no longer exists']
      });
    }

    req.user = user;
    next();
  } catch (error) {
    let message = 'Not authorized to access this route';
    if (error.name === 'TokenExpiredError') {
      message = 'Token has expired. Please login again.';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid authentication token.';
    }

    return res.status(401).json({
      success: false,
      message,
      errors: [error.message]
    });
  }
};

module.exports = { protect };
