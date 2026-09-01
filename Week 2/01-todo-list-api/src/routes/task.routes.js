const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats
} = require('../controllers/task.controller');

// Task statistics route (must be before /:id)
router.get('/stats', getTaskStats);

// Main collection routes
router.route('/')
  .get(getTasks)
  .post(createTask);

// Individual item routes
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// Status toggle route
router.patch('/:id/toggle', toggleTaskStatus);

module.exports = router;
