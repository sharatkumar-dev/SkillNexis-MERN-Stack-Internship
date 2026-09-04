const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with id of ${err.value}`;
    errors = [`Invalid parameter format for ${err.path}`];
  }

  // Mongoose Duplicate Key Error (e.g. email already exists)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with this ${field} already exists.`;
    errors = [`Duplicate value entered for ${field}`];
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
    errors = ['Token verification failed'];
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
    errors = ['Token expired'];
  }

  if (errors.length === 0 && err.message) {
    errors.push(err.message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = errorHandler;
