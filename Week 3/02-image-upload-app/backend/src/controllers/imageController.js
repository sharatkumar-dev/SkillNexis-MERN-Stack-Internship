const fs = require('fs');
const path = require('path');
const { ImageStore } = require('../models/storeAdapter');
const { uploadDir } = require('../middleware/uploadMiddleware');

// Helper to parse tags
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => t.trim()).filter(Boolean);
  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};

/**
 * @desc   Upload a single image
 * @route  POST /api/images/upload
 * @access Public
 */
const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded',
        errors: ['Please select an image file to upload (JPEG, PNG, WEBP, GIF, SVG)']
      });
    }

    const { title, description, category, tags } = req.body;

    // Fallback title to original name if not provided
    const imageTitle = title && title.trim()
      ? title.trim()
      : path.parse(req.file.originalname).name.replace(/[-_]/g, ' ');

    const imageData = {
      title: imageTitle,
      description: description ? description.trim() : '',
      category: category ? category.toLowerCase().trim() : 'general',
      tags: parseTags(tags),
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      filePath: `uploads/${req.file.filename}`,
      url: `/uploads/${req.file.filename}`
    };

    const savedImage = await ImageStore.create(imageData);

    return res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: savedImage
    });
  } catch (error) {
    // If saving fails, remove uploaded file to prevent orphan files
    if (req.file && req.file.filename) {
      const diskPath = path.join(uploadDir, req.file.filename);
      if (fs.existsSync(diskPath)) {
        try {
          fs.unlinkSync(diskPath);
        } catch (unlinkErr) {
          console.error('Failed to cleanup orphan file:', unlinkErr);
        }
      }
    }
    next(error);
  }
};

/**
 * @desc   Upload multiple images (up to 5)
 * @route  POST /api/images/upload-multiple
 * @access Public
 */
const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files uploaded',
        errors: ['Please select at least one image file (max 5)']
      });
    }

    const { category, tags } = req.body;
    const parsedTags = parseTags(tags);
    const selectedCategory = category ? category.toLowerCase().trim() : 'general';

    const imageDocs = req.files.map((file) => ({
      title: path.parse(file.originalname).name.replace(/[-_]/g, ' '),
      description: '',
      category: selectedCategory,
      tags: parsedTags,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      filePath: `uploads/${file.filename}`,
      url: `/uploads/${file.filename}`
    }));

    const savedImages = await ImageStore.insertMany(imageDocs);

    return res.status(201).json({
      success: true,
      message: `${savedImages.length} images uploaded successfully`,
      data: savedImages
    });
  } catch (error) {
    // Cleanup any uploaded files on error
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const diskPath = path.join(uploadDir, file.filename);
        if (fs.existsSync(diskPath)) {
          try {
            fs.unlinkSync(diskPath);
          } catch (e) {
            // ignore
          }
        }
      });
    }
    next(error);
  }
};

/**
 * @desc   Get all images with filtering, search, sorting & pagination
 * @route  GET /api/images
 * @access Public
 */
const getAllImages = async (req, res, next) => {
  try {
    const { category, search, sortBy = 'newest', page = 1, limit = 50 } = req.query;

    const query = {};

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      query.category = category.toLowerCase().trim();
    }

    // Search query across title, description, tags, and originalName
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
        { originalName: searchRegex }
      ];
    }

    // Sorting logic
    let sortOption = { createdAt: -1 }; // default newest
    if (sortBy === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sortBy === 'size_desc') {
      sortOption = { size: -1 };
    } else if (sortBy === 'size_asc') {
      sortOption = { size: 1 };
    } else if (sortBy === 'title_asc') {
      sortOption = { title: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 50);
    const skip = (pageNum - 1) * limitNum;

    const [images, total] = await Promise.all([
      ImageStore.find(query).sort(sortOption).skip(skip).limit(limitNum),
      ImageStore.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      message: 'Images retrieved successfully',
      data: {
        images,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get image by ID
 * @route  GET /api/images/:id
 * @access Public
 */
const getImageById = async (req, res, next) => {
  try {
    const image = await ImageStore.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: `Image with ID ${req.params.id} not found`,
        errors: ['Image not found']
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Image retrieved successfully',
      data: image
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete an image (both DB/store record and disk file)
 * @route  DELETE /api/images/:id
 * @access Public
 */
const deleteImage = async (req, res, next) => {
  try {
    const image = await ImageStore.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: `Image with ID ${req.params.id} not found`,
        errors: ['Image not found']
      });
    }

    // Delete disk file
    const diskPath = path.join(uploadDir, image.filename);
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err) {
        console.error(`Failed to delete disk file ${diskPath}:`, err);
      }
    }

    // Delete store record
    await ImageStore.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Image and associated file deleted successfully',
      data: { id: req.params.id, filename: image.filename }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Download image file with original filename
 * @route  GET /api/images/:id/download
 * @access Public
 */
const downloadImage = async (req, res, next) => {
  try {
    const image = await ImageStore.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
        errors: ['Image not found']
      });
    }

    const diskPath = path.join(uploadDir, image.filename);
    if (!fs.existsSync(diskPath)) {
      return res.status(404).json({
        success: false,
        message: 'Image file does not exist on disk',
        errors: ['Physical file missing']
      });
    }

    return res.download(diskPath, image.originalName);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get storage statistics (total images, total bytes, category breakdown)
 * @route  GET /api/images/stats
 * @access Public
 */
const getStorageStats = async (req, res, next) => {
  try {
    const stats = await ImageStore.getStorageStats();

    return res.status(200).json({
      success: true,
      message: 'Storage stats retrieved successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadSingleImage,
  uploadMultipleImages,
  getAllImages,
  getImageById,
  deleteImage,
  downloadImage,
  getStorageStats
};
