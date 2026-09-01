const express = require('express');
const router = express.Router();
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  togglePinNote,
  toggleArchiveNote,
  deleteNote,
  getNoteStats
} = require('../controllers/note.controller');
const { protect } = require('../middleware/auth.middleware');

// All note routes require JWT authentication
router.use(protect);

// Specific routes
router.get('/stats', getNoteStats);

// Collection routes
router.route('/')
  .post(createNote)
  .get(getNotes);

// Single item routes
router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

// Toggle state routes
router.patch('/:id/pin', togglePinNote);
router.patch('/:id/archive', toggleArchiveNote);

module.exports = router;
