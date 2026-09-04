const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserMongoose = require('./User');
const TaskMongoose = require('./Task');

// In-memory storage collections when MongoDB is offline
const memoryUsers = [];
const memoryTasks = [];

const generateId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return timestamp + random;
};

const isDbConnected = () => mongoose.connection.readyState === 1;

const UserStore = {
  findOne(query) {
    if (isDbConnected()) {
      return UserMongoose.findOne(query);
    }

    const email = query.email ? query.email.toLowerCase().trim() : null;
    const user = memoryUsers.find((u) => u.email === email);
    let selectedFields = '';

    const queryObj = {
      select(fields) {
        selectedFields = fields;
        return this;
      },
      then(resolve, reject) {
        if (!user) {
          return Promise.resolve(null).then(resolve, reject);
        }
        const userObj = {
          ...user,
          matchPassword: async function (candidatePassword) {
            return await bcrypt.compare(candidatePassword, this.password);
          }
        };
        if (selectedFields === '+password') {
          return Promise.resolve(userObj).then(resolve, reject);
        }
        const { password, ...safeUser } = userObj;
        return Promise.resolve(safeUser).then(resolve, reject);
      },
      catch(reject) {
        return this.then(undefined, reject);
      }
    };

    return queryObj;
  },

  findById(id) {
    if (isDbConnected()) {
      return UserMongoose.findById(id);
    }

    const user = memoryUsers.find((u) => String(u._id) === String(id));
    let selectedFields = '';

    const queryObj = {
      select(fields) {
        selectedFields = fields;
        return this;
      },
      then(resolve, reject) {
        if (!user) {
          return Promise.resolve(null).then(resolve, reject);
        }
        const userObj = {
          ...user,
          matchPassword: async function (candidatePassword) {
            return await bcrypt.compare(candidatePassword, this.password);
          }
        };
        if (selectedFields === '+password') {
          return Promise.resolve(userObj).then(resolve, reject);
        }
        const { password, ...safeUser } = userObj;
        return Promise.resolve(safeUser).then(resolve, reject);
      },
      catch(reject) {
        return this.then(undefined, reject);
      }
    };

    return queryObj;
  },

  async create({ name, email, password, avatarColor }) {
    if (isDbConnected()) {
      return UserMongoose.create({ name, email, password, avatarColor });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      avatarColor: avatarColor || '#6366F1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryUsers.push(newUser);

    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatarColor: newUser.avatarColor,
      createdAt: newUser.createdAt,
      matchPassword: async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, newUser.password);
      }
    };
  }
};

const TaskStore = {
  find(query) {
    if (isDbConnected()) {
      return TaskMongoose.find(query);
    }

    let results = memoryTasks.filter((t) => {
      if (String(t.user) !== String(query.user)) return false;
      if (query.status && t.status !== query.status) return false;
      if (query.priority && t.priority !== query.priority) return false;
      if (query.category && t.category !== query.category) return false;

      if (query.$or) {
        const titleRegex = query.$or[0]?.title?.$regex;
        const descRegex = query.$or[1]?.description?.$regex;
        const titleMatches = titleRegex ? titleRegex.test(t.title) : false;
        const descMatches = descRegex ? descRegex.test(t.description || '') : false;
        if (!titleMatches && !descMatches) return false;
      }

      return true;
    });

    return {
      sort(sortOptions) {
        if (sortOptions.dueDate) {
          const dir = sortOptions.dueDate;
          results.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return (new Date(a.dueDate) - new Date(b.dueDate)) * dir;
          });
        } else if (sortOptions.priority) {
          const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };
          const dir = sortOptions.priority;
          results.sort(
            (a, b) =>
              ((priorityWeights[a.priority] || 0) - (priorityWeights[b.priority] || 0)) * dir
          );
        } else if (sortOptions.title) {
          const dir = sortOptions.title;
          results.sort((a, b) => a.title.localeCompare(b.title) * dir);
        } else {
          const dir = sortOptions.createdAt || -1;
          results.sort((a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) * dir);
        }

        return Promise.resolve(
          results.map((task) => ({
            ...task,
            save: async function () {
              const idx = memoryTasks.findIndex((item) => String(item._id) === String(task._id));
              if (idx !== -1) {
                memoryTasks[idx] = { ...this, updatedAt: new Date().toISOString() };
              }
              return this;
            }
          }))
        );
      }
    };
  },

  async findOne(query) {
    if (isDbConnected()) {
      return TaskMongoose.findOne(query);
    }
    const task = memoryTasks.find(
      (t) => String(t._id) === String(query._id) && String(t.user) === String(query.user)
    );
    if (!task) return null;

    return {
      ...task,
      save: async function () {
        const idx = memoryTasks.findIndex((item) => String(item._id) === String(task._id));
        if (idx !== -1) {
          memoryTasks[idx] = {
            ...memoryTasks[idx],
            title: this.title,
            description: this.description,
            status: this.status,
            priority: this.priority,
            category: this.category,
            dueDate: this.dueDate,
            updatedAt: new Date().toISOString()
          };
          return memoryTasks[idx];
        }
        return this;
      }
    };
  },

  async create(data) {
    if (isDbConnected()) {
      return TaskMongoose.create(data);
    }

    const newTask = {
      _id: generateId(),
      user: String(data.user),
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      category: data.category || 'Work',
      dueDate: data.dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryTasks.push(newTask);
    return newTask;
  },

  async findOneAndUpdate(query, updateData, options = {}) {
    if (isDbConnected()) {
      return TaskMongoose.findOneAndUpdate(query, updateData, options);
    }

    const idx = memoryTasks.findIndex(
      (t) => String(t._id) === String(query._id) && String(t.user) === String(query.user)
    );
    if (idx === -1) return null;

    memoryTasks[idx] = {
      ...memoryTasks[idx],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    return memoryTasks[idx];
  },

  async findOneAndDelete(query) {
    if (isDbConnected()) {
      return TaskMongoose.findOneAndDelete(query);
    }

    const idx = memoryTasks.findIndex(
      (t) => String(t._id) === String(query._id) && String(t.user) === String(query.user)
    );
    if (idx === -1) return null;

    const [deleted] = memoryTasks.splice(idx, 1);
    return deleted;
  },

  async getStats(userId) {
    if (isDbConnected()) {
      const now = new Date();
      const [statusStats, priorityStats, totalTasks, overdueTasks] = await Promise.all([
        TaskMongoose.aggregate([
          { $match: { user: userId } },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        TaskMongoose.aggregate([
          { $match: { user: userId } },
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]),
        TaskMongoose.countDocuments({ user: userId }),
        TaskMongoose.countDocuments({
          user: userId,
          status: { $ne: 'completed' },
          dueDate: { $ne: null, $lt: now }
        })
      ]);

      const statusMap = { todo: 0, in_progress: 0, completed: 0 };
      statusStats.forEach((i) => {
        if (statusMap[i._id] !== undefined) statusMap[i._id] = i.count;
      });

      const priorityMap = { low: 0, medium: 0, high: 0, urgent: 0 };
      priorityStats.forEach((i) => {
        if (priorityMap[i._id] !== undefined) priorityMap[i._id] = i.count;
      });

      return {
        total: totalTasks,
        byStatus: statusMap,
        byPriority: priorityMap,
        overdue: overdueTasks,
        completionRate: totalTasks > 0 ? Math.round((statusMap.completed / totalTasks) * 100) : 0
      };
    }

    // In-memory computation
    const userTasks = memoryTasks.filter((t) => String(t.user) === String(userId));
    const now = new Date();

    const statusMap = { todo: 0, in_progress: 0, completed: 0 };
    const priorityMap = { low: 0, medium: 0, high: 0, urgent: 0 };
    let overdue = 0;

    userTasks.forEach((t) => {
      if (statusMap[t.status] !== undefined) statusMap[t.status]++;
      if (priorityMap[t.priority] !== undefined) priorityMap[t.priority]++;
      if (t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now) {
        overdue++;
      }
    });

    const total = userTasks.length;
    const completionRate = total > 0 ? Math.round((statusMap.completed / total) * 100) : 0;

    return {
      total,
      byStatus: statusMap,
      byPriority: priorityMap,
      overdue,
      completionRate
    };
  }
};

module.exports = {
  UserStore,
  TaskStore,
  isDbConnected
};
