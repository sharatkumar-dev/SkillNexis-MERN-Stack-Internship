const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'default_jwt_secret_change_me_in_production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '30d';

  return jwt.sign({ id }, secret, {
    expiresIn
  });
};

module.exports = generateToken;
