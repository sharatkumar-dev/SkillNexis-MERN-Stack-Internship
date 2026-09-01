const Note = require('../models/note.model');

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Private
 */
const createNote = async (req, res, next) => {
  try {
    const { title, content, category, tags, color, isPinned, isArchived } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a note title'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide note content'
      });
    }

    const note = await Note.create({
      user: req.user._id,
      title: title.trim(),
      content: content.trim(),
      category: category ? category.trim() : 'General',
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
      color: color || '#ffffff',
      isPinned: Boolean(isPinned),
      isArchived: Boolean(isArchived)
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all notes for current user with filtering, search, and pagination
 * @route   GET /api/notes
 * @access  Private
 */
const getNotes = async (req, res, next) => {
  try {
    const {
      q,
      search,
      category,
      tag,
      isPinned,
      isArchived,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const queryObj = { user: req.user._id };

    // Search filter across title and content
    const searchTerm = q || search;
    if (searchTerm && searchTerm.trim() !== '') {
      queryObj.$or = [
        { title: { $regex: searchTerm.trim(), $options: 'i' } },
        { content: { $regex: searchTerm.trim(), $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category.trim() !== '') {
      queryObj.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
    }

    // Tag filter
    if (tag && tag.trim() !== '') {
      queryObj.tags = tag.trim().toLowerCase();
    }

    // Pinned filter
    if (isPinned !== undefined && isPinned !== '') {
      queryObj.isPinned = isPinned === 'true' || isPinned === true;
    }

    // Archived filter (defaults to active notes if not specified)
    if (isArchived !== undefined && isArchived !== '') {
      if (isArchived === 'all') {
        // do not filter by isArchived
      } else {
        queryObj.isArchived = isArchived === 'true' || isArchived === true;
      }
    } else {
      queryObj.isArchived = false;
    }

    // Pagination calculations
    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const limitNumber = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * limitNumber;

    // Sorting logic
    let sortOptions = { isPinned: -1, createdAt: -1 };
    if (sort) {
      switch (sort.toLowerCase()) {
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'newest':
          sortOptions = { createdAt: -1 };
          break;
        case 'updated':
          sortOptions = { updatedAt: -1 };
          break;
        case 'title-asc':
          sortOptions = { title: 1 };
          break;
        case 'title-desc':
          sortOptions = { title: -1 };
          break;
        default:
          sortOptions = { isPinned: -1, createdAt: -1 };
      }
    }

    const [notes, total] = await Promise.all([
      Note.find(queryObj)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber),
      Note.countDocuments(queryObj)
    ]);

    const totalPages = Math.ceil(total / limitNumber) || 1;

    res.status(200).json({
      success: true,
      count: notes.length,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
      },
      data: notes
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single note by ID
 * @route   GET /api/notes/:id
 * @access  Private
 */
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update note by ID
 * @route   PUT /api/notes/:id
 * @access  Private
 */
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    const { title, content, category, tags, color, isPinned, isArchived } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        });
      }
      note.title = title.trim();
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Content cannot be empty'
        });
      }
      note.content = content.trim();
    }

    if (category !== undefined) {
      note.category = category.trim() || 'General';
    }

    if (tags !== undefined) {
      note.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []);
    }

    if (color !== undefined) {
      note.color = color;
    }

    if (isPinned !== undefined) {
      note.isPinned = Boolean(isPinned);
    }

    if (isArchived !== undefined) {
      note.isArchived = Boolean(isArchived);
      if (note.isArchived) {
        note.isPinned = false;
      }
    }

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle pin status for a note
 * @route   PATCH /api/notes/:id/pin
 * @access  Private
 */
const togglePinNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.isPinned = !note.isPinned;
    if (note.isPinned) {
      note.isArchived = false;
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: note.isPinned ? 'Note pinned successfully' : 'Note unpinned successfully',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle archive status for a note
 * @route   PATCH /api/notes/:id/archive
 * @access  Private
 */
const toggleArchiveNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.isArchived = !note.isArchived;
    if (note.isArchived) {
      note.isPinned = false;
    }

    await note.save();

    res.status(200).json({
      success: true,
      message: note.isArchived ? 'Note archived successfully' : 'Note restored from archive',
      data: note
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a note by ID
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated notes statistics for current user
 * @route   GET /api/notes/stats
 * @access  Private
 */
const getNoteStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [totalNotes, pinnedNotes, archivedNotes, activeNotes, categoryCounts] = await Promise.all([
      Note.countDocuments({ user: userId }),
      Note.countDocuments({ user: userId, isPinned: true }),
      Note.countDocuments({ user: userId, isArchived: true }),
      Note.countDocuments({ user: userId, isArchived: false }),
      Note.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const formattedCategories = categoryCounts.map(item => ({
      category: item._id || 'Uncategorized',
      count: item.count
    }));

    res.status(200).json({
      success: true,
      data: {
        totalNotes,
        activeNotes,
        pinnedNotes,
        archivedNotes,
        categories: formattedCategories
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  togglePinNote,
  toggleArchiveNote,
  deleteNote,
  getNoteStats
};
