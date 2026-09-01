const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Note must belong to a user'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide note content']
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
      maxlength: [50, 'Category cannot exceed 50 characters']
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => {
        if (!Array.isArray(tags)) return [];
        return tags
          .map((tag) => tag.trim().toLowerCase())
          .filter((tag) => tag.length > 0);
      }
    },
    color: {
      type: String,
      trim: true,
      default: '#ffffff'
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    isArchived: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for high performance querying
noteSchema.index({ user: 1, isPinned: -1, createdAt: -1 });
noteSchema.index({ user: 1, category: 1 });
noteSchema.index({ user: 1, isArchived: 1 });
noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
