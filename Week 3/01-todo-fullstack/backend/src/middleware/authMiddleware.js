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
      message: 'Access denied. No authentication token provided.',
      errors: ['Authorization token required']
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_skillnexis_week3_assignment1');
    const user = await UserStore.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session. User belonging to this token no longer exists.',
        errors: ['User not found']
      });
    }

    req.user = user;
    next();
  } catch (error) {
    let message = 'Not authorized to access this resource.';
    if (error.name === 'TokenExpiredError') {
      message = 'Session expired. Please log in again.';
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
