const multer = require('multer');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode || 500);
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Multer Errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    switch (err.code) {
      case 'LIMIT_FILE_SIZE': {
        const maxMb = process.env.MAX_FILE_SIZE_MB || 5;
        message = `File too large. Maximum allowed file size is ${maxMb}MB.`;
        errors = [`File exceeded size limit of ${maxMb}MB`];
        break;
      }
      case 'LIMIT_UNEXPECTED_FILE':
        message = `Unexpected upload field '${err.field}'. Use 'image' for single upload or 'images' for multiple.`;
        errors = [`Unexpected field: ${err.field}`];
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded at once. Maximum allowed is 5 images.';
        errors = ['Exceeded max file count limit of 5'];
        break;
      default:
        message = `Upload error: ${err.message}`;
        errors = [err.message];
    }
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Image not found with ID: ${err.value}`;
    errors = [`Invalid parameter format for ${err.path}`];
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((val) => val.message);
  }

  // Default error message into errors array if empty
  if (errors.length === 0 && message) {
    errors.push(message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = errorHandler;
