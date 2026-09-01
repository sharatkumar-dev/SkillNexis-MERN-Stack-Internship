const Task = require('../models/task.model');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Public
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: typeof completed === 'boolean' ? completed : false,
      priority: priority || 'medium',
      dueDate: dueDate || null
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks with optional filters (completed, priority, search, sort, pagination)
 * @route   GET /api/tasks
 * @access  Public
 */
const getTasks = async (req, res, next) => {
  try {
    const { completed, priority, search, sort, page = 1, limit = 20 } = req.query;

    const filter = {};

    // Filter by completion status
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      filter.priority = priority.toLowerCase();
    }

    // Keyword search in title and description
    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Sorting logic (default to newest first)
    let sortOption = { createdAt: -1 };
    if (sort) {
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      if (sort === 'priority') sortOption = { priority: -1, createdAt: -1 };
      if (sort === 'dueDate') sortOption = { dueDate: 1, createdAt: -1 };
      if (sort === 'title') sortOption = { title: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, totalTasks] = await Promise.all([
      Task.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Task.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalTasks / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination: {
        total: totalTasks,
        page: pageNum,
        totalPages,
        limit: limitNum
      },
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Public
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/tasks/:id
 * @access  Public
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID ${req.params.id}`
      });
    }

    // Update fields if provided
    if (title !== undefined) {
      if (!title || title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty'
        });
      }
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description.trim();
    }

    if (completed !== undefined) {
      task.completed = Boolean(completed);
    }

    if (priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(priority.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Priority must be low, medium, or high'
        });
      }
      task.priority = priority.toLowerCase();
    }

    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle task completed status
 * @route   PATCH /api/tasks/:id/toggle
 * @access  Public
 */
const toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID ${req.params.id}`
      });
    }

    task.completed = !task.completed;
    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: `Task marked as ${task.completed ? 'completed' : 'pending'}`,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Public
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with ID ${req.params.id}`
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get summary stats of tasks
 * @route   GET /api/tasks/stats
 * @access  Public
 */
const getTaskStats = async (req, res, next) => {
  try {
    const [total, completed, pending, priorityStats] = await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ completed: true }),
      Task.countDocuments({ completed: false }),
      Task.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const priorities = { low: 0, medium: 0, high: 0 };
    priorityStats.forEach((p) => {
      if (p._id) priorities[p._id] = p.count;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        priorities
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  toggleTaskStatus,
  deleteTask,
  getTaskStats
};
