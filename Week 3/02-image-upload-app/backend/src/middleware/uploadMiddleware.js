const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Target directory for uploaded files
const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIRECTORY || 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with collision-resistant naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique timestamp + random hash + sanitized extension
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `img-${uniqueSuffix}${ext}`);
  }
});

// Permitted MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

// File filter function
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    const error = new Error(
      `Unsupported file format '${file.mimetype}'. Allowed formats are JPEG, PNG, WEBP, GIF, and SVG.`
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

// Size limit in bytes (5MB default)
const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10);
const limits = {
  fileSize: maxFileSizeMB * 1024 * 1024 // e.g. 5,242,880 bytes
};

// Base multer instance
const upload = multer({
  storage,
  fileFilter,
  limits
});

module.exports = {
  upload,
  uploadSingle: upload.single('image'),
  uploadMultiple: upload.array('images', 5),
  uploadDir
};
