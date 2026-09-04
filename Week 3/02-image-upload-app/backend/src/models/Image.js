const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    category: {
      type: String,
      enum: {
        values: ['general', 'wallpaper', 'nature', 'technology', 'architecture', 'art', 'portrait'],
        message: '{VALUE} is not a supported category'
      },
      default: 'general',
      lowercase: true,
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    filename: {
      type: String,
      required: [true, 'Saved filename is required'],
      unique: true
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required']
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required']
    },
    size: {
      type: Number,
      required: [true, 'File size in bytes is required']
    },
    filePath: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for formatted human-readable size
imageSchema.virtual('formattedSize').get(function () {
  if (!this.size) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(this.size) / Math.log(k));
  return parseFloat((this.size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
});

// Indexes for fast searching and filtering
imageSchema.index({ category: 1 });
imageSchema.index({ title: 'text', description: 'text', tags: 'text' });
imageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Image', imageSchema);
