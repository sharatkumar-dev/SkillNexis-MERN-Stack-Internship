const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserMongoose = require('./User');
const TodoMongoose = require('./Todo');

// In-Memory fallback collections when MongoDB is not connected
const memoryUsers = [];
const memoryTodos = [];

// Helper to generate mongo-compatible hex IDs
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
          comparePassword: async function (candidatePassword) {
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
          comparePassword: async function (candidatePassword) {
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

  async create({ name, email, password }) {
    if (isDbConnected()) {
      return UserMongoose.create({ name, email, password });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryUsers.push(newUser);

    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      comparePassword: async function (candidatePassword) {
        return await bcrypt.compare(candidatePassword, newUser.password);
      }
    };
  }
};

const TodoStore = {
  find(query) {
    if (isDbConnected()) {
      return TodoMongoose.find(query);
    }

    let results = memoryTodos.filter((t) => {
      if (String(t.user) !== String(query.user)) return false;
      if (query.isCompleted !== undefined && t.isCompleted !== query.isCompleted) return false;
      if (query.priority && t.priority !== query.priority) return false;
      if (query.$or) {
        const searchRegex = query.$or[0].title;
        const matchesTitle = searchRegex.test(t.title);
        const matchesDesc = searchRegex.test(t.description || '');
        if (!matchesTitle && !matchesDesc) return false;
      }
      return true;
    });

    return {
      sort(sortOption) {
        if (sortOption.createdAt === 1) {
          results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortOption.dueDate === 1) {
          results.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          });
        } else {
          results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Return clones with .save() method attached
        return Promise.resolve(
          results.map((todo) => ({
            ...todo,
            save: async function () {
              const idx = memoryTodos.findIndex((item) => String(item._id) === String(todo._id));
              if (idx !== -1) {
                memoryTodos[idx] = { ...this, updatedAt: new Date().toISOString() };
              }
              return this;
            }
          }))
        );
      }
    };
  },

  async countDocuments(query) {
    if (isDbConnected()) {
      return TodoMongoose.countDocuments(query);
    }
    return memoryTodos.filter((t) => {
      if (String(t.user) !== String(query.user)) return false;
      if (query.isCompleted !== undefined && t.isCompleted !== query.isCompleted) return false;
      return true;
    }).length;
  },

  async findOne(query) {
    if (isDbConnected()) {
      return TodoMongoose.findOne(query);
    }
    const todo = memoryTodos.find(
      (t) => String(t._id) === String(query._id) && String(t.user) === String(query.user)
    );
    if (!todo) return null;

    return {
      ...todo,
      save: async function () {
        const idx = memoryTodos.findIndex((item) => String(item._id) === String(todo._id));
        if (idx !== -1) {
          memoryTodos[idx] = {
            ...memoryTodos[idx],
            title: this.title,
            description: this.description,
            isCompleted: this.isCompleted,
            priority: this.priority,
            dueDate: this.dueDate,
            updatedAt: new Date().toISOString()
          };
          return memoryTodos[idx];
        }
        return this;
      }
    };
  },

  async create({ title, description, priority, dueDate, user }) {
    if (isDbConnected()) {
      return TodoMongoose.create({ title, description, priority, dueDate, user });
    }
    const newTodo = {
      _id: generateId(),
      title: title.trim(),
      description: description ? description.trim() : '',
      isCompleted: false,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      user: String(user),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryTodos.push(newTodo);
    return newTodo;
  },

  async findOneAndDelete(query) {
    if (isDbConnected()) {
      return TodoMongoose.findOneAndDelete(query);
    }
    const idx = memoryTodos.findIndex(
      (t) => String(t._id) === String(query._id) && String(t.user) === String(query.user)
    );
    if (idx === -1) return null;
    const deleted = memoryTodos.splice(idx, 1)[0];
    return deleted;
  }
};

module.exports = {
  UserStore,
  TodoStore,
  isDbConnected
};
