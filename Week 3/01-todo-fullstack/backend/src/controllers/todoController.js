const { TodoStore } = require('../models/storeAdapter');

// @desc    Get all todos for logged in user with optional filter, search, and sorting
// @route   GET /api/todos
// @access  Private
const getTodos = async (req, res, next) => {
  try {
    const { status, priority, search, sort } = req.query;

    const query = { user: req.user._id };

    // Filter by completion status
    if (status === 'completed') {
      query.isCompleted = true;
    } else if (status === 'active' || status === 'pending') {
      query.isCompleted = false;
    }

    // Filter by priority
    if (priority && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      query.priority = priority.toLowerCase();
    }

    // Search query on title or description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'dueDate') {
      sortOption = { dueDate: 1, createdAt: -1 };
    } else if (sort === 'priority') {
      sortOption = { priority: 1, createdAt: -1 };
    }

    const todos = await TodoStore.find(query).sort(sortOption);

    // Compute stats for current user
    const totalCount = await TodoStore.countDocuments({ user: req.user._id });
    const completedCount = await TodoStore.countDocuments({
      user: req.user._id,
      isCompleted: true
    });
    const pendingCount = totalCount - completedCount;

    res.status(200).json({
      success: true,
      message: 'Todos retrieved successfully',
      data: {
        todos,
        stats: {
          total: totalCount,
          completed: completedCount,
          pending: pendingCount
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Private
const getTodoById = async (req, res, next) => {
  try {
    const todo = await TodoStore.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
        errors: ['No todo found matching the specified ID for this user']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo retrieved successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Private
const createTodo = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: ['Task title is required']
      });
    }

    const todo = await TodoStore.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority ? priority.toLowerCase() : 'medium',
      dueDate: dueDate || null,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing todo
// @route   PUT /api/todos/:id
// @access  Private
const updateTodo = async (req, res, next) => {
  try {
    const { title, description, isCompleted, priority, dueDate } = req.body;

    let todo = await TodoStore.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
        errors: ['Cannot update todo: item does not exist or unauthorized']
      });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (isCompleted !== undefined) todo.isCompleted = Boolean(isCompleted);
    if (priority !== undefined && ['low', 'medium', 'high'].includes(priority.toLowerCase())) {
      todo.priority = priority.toLowerCase();
    }
    if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;

    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle todo completion status
// @route   PATCH /api/todos/:id/toggle
// @access  Private
const toggleTodo = async (req, res, next) => {
  try {
    const todo = await TodoStore.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
        errors: ['Cannot toggle todo: item not found or unauthorized']
      });
    }

    todo.isCompleted = !todo.isCompleted;
    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: `Todo marked as ${updatedTodo.isCompleted ? 'completed' : 'pending'}`,
      data: updatedTodo
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Private
const deleteTodo = async (req, res, next) => {
  try {
    const todo = await TodoStore.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
        errors: ['Cannot delete todo: item does not exist or unauthorized']
      });
    }

    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  toggleTodo,
  deleteTodo
};
