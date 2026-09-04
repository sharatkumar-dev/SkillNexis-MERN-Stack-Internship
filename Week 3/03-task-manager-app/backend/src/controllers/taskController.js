const { TaskStore } = require('../models/storeAdapter');

/**
 * @desc    Get all tasks for authenticated user with search, filtering & sorting
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = { user: req.user._id };

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ];
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    let sortOptions = {};

    if (sortBy === 'dueDate') {
      sortOptions = { dueDate: sortOrder, createdAt: -1 };
    } else if (sortBy === 'priority') {
      sortOptions = { priority: sortOrder, createdAt: -1 };
    } else if (sortBy === 'title') {
      sortOptions = { title: sortOrder };
    } else {
      sortOptions = { createdAt: sortOrder };
    }

    const tasks = await TaskStore.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        total: tasks.length,
        tasks
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get task metrics and analytics for authenticated user
 * @route   GET /api/tasks/stats
 * @access  Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    const stats = await TaskStore.getStats(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Task statistics retrieved successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await TaskStore.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        errors: [`No task found with id ${req.params.id}`]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Task title is required']
      });
    }

    const task = await TaskStore.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'todo',
      priority: priority || 'medium',
      category: category || 'Work',
      dueDate: dueDate ? new Date(dueDate).toISOString() : null
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task details
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate } = req.body;

    const task = await TaskStore.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        errors: [`No task found with id ${req.params.id}`]
      });
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate).toISOString() : null;

    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick update status (e.g. Kanban move / quick cycle)
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['todo', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status provided',
        errors: ["Status must be one of: 'todo', 'in_progress', 'completed'"]
      });
    }

    const task = await TaskStore.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        errors: [`No task found with id ${req.params.id}`]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await TaskStore.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
        errors: [`No task found with id ${req.params.id}`]
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: {
        id: task._id,
        title: task.title
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};
