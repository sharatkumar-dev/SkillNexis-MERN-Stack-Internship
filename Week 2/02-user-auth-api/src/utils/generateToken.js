const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT token for user
 * @param {string} id - User MongoDB ObjectId
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillnexis_mern_jwt_secret_key_super_secure_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = generateToken;
