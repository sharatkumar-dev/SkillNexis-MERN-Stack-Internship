const express = require('express');
const router = express.Router();
const {
  uploadSingle,
  uploadMultiple
} = require('../middleware/uploadMiddleware');
const {
  uploadSingleImage,
  uploadMultipleImages,
  getAllImages,
  getImageById,
  deleteImage,
  downloadImage,
  getStorageStats
} = require('../controllers/imageController');

// Image Upload Routes
router.post('/upload', uploadSingle, uploadSingleImage);
router.post('/upload-multiple', uploadMultiple, uploadMultipleImages);

// Storage Analytics Route (must be before /:id)
router.get('/stats', getStorageStats);

// List & Query Route
router.get('/', getAllImages);

// Single Resource Operations
router.get('/:id', getImageById);
router.get('/:id/download', downloadImage);
router.delete('/:id', deleteImage);

module.exports = router;
