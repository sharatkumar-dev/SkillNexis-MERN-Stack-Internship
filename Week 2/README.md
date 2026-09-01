# 🚀 SkillNexis MERN Stack Internship — Week 2: Backend Development

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![REST API](https://img.shields.io/badge/API-RESTful-02569B?style=for-the-badge&logo=rest&logoColor=white)](https://restfulapi.net/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

Welcome to the **Week 2** workspace of the **SkillNexis Full Stack Web Development (MERN) Internship**. This repository contains production-ready, modular REST APIs developed with Node.js, Express.js, and MongoDB / Mongoose following industry-standard MVC architecture, security best practices, and automated error handling.

---

## 📚 Curriculum & Learning Objectives

- **Node.js Core & NPM Ecosystem**: Module systems, runtime environment configurations, and dependency lifecycle management.
- **Express.js Web Framework**: Middleware pipeline orchestration, request lifecycle handling, and clean RESTful routing.
- **MongoDB & Mongoose ODM**: Schema modeling, indexing strategies, field validations, and database connection reliability.
- **RESTful API Design**: Predictable JSON response envelopes, standard HTTP status codes, pagination, query filtering, and search.
- **Security & Authentication**: Bcrypt password hashing, JWT stateless session authentication, and protected route middlewares.
- **API Testing & Tooling**: Comprehensive Postman Collection v2.1 exports and VS Code REST Client (`.http`) test suites.

---

## 📂 Projects & Workspace Breakdown

| Project Folder | Level | Description | Status |
| :--- | :--- | :--- | :---: |
| [**`01-todo-list-api/`**](./01-todo-list-api/) | **Assignment 1** | Full CRUD REST API for To-Do tasks with MongoDB, status toggling, search & filtering | ✅ **Completed** |
| [**`02-user-auth-api/`**](./02-user-auth-api/) | **Assignment 2** | User Authentication API with Bcrypt password hashing & JWT token issuance | ✅ **Completed** |
| [**`03-notes-app-backend/`**](./03-notes-app-backend/) | **Mini Project** | Secure Notes API with user-authenticated CRUD, pin/archive, search, tags & metrics | ✅ **Completed** |

---

## 📋 Assignment 1: To-Do List REST API Highlights

The **`01-todo-list-api`** project implements a full-featured task management backend:

```text
01-todo-list-api/
├── src/
│   ├── config/
│   │   └── db.js                 # Resilient Mongoose connection with event listeners
│   ├── controllers/
│   │   └── task.controller.js    # CRUD handlers, pagination, text search & stats aggregation
│   ├── middleware/
│   │   └── error.middleware.js   # 404 handler and global error interceptor
│   ├── models/
│   │   └── task.model.js         # Mongoose schema with validations & compound indexes
│   ├── routes/
│   │   └── task.routes.js        # Express REST routing
│   ├── app.js                    # Express app configuration & middleware pipeline
│   └── server.js                 # Server bootstrap & graceful shutdown handling
├── .env.example                  # Environment configuration template
├── package.json                  # Dependencies & scripts
├── postman_collection.json       # Postman Collection v2.1 importable schema
├── requests.http                 # 16 executable test cases for VS Code REST Client
└── README.md                     # Dedicated assignment documentation
```

### ⚡ Quick Start for Assignment 1

1. **Navigate to the project directory:**
   ```bash
   cd 01-todo-list-api
   ```

2. **Install dependencies & run:**
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **API Endpoints Summary:**
   - `GET /api/health` — Health check endpoint
   - `POST /api/tasks` — Create new task (validates title, priority, due date)
   - `GET /api/tasks` — List tasks with search, pagination (`page`, `limit`), and filter (`completed`, `priority`, `sort`)
   - `GET /api/tasks/stats` — Aggregate metrics summary
   - `GET /api/tasks/:id` — Retrieve task by MongoDB ObjectId
   - `PUT /api/tasks/:id` — Update task details
   - `PATCH /api/tasks/:id/toggle` — Quick completion status toggle
   - `DELETE /api/tasks/:id` — Remove task from database

---

## 🔐 Assignment 2: User Authentication API Highlights

The **`02-user-auth-api`** project implements secure user registration, password hashing with bcrypt, JWT token generation, role-based access control, and user profile management:

```text
02-user-auth-api/
├── src/
│   ├── config/
│   │   └── db.js                 # Resilient Mongoose connection
│   ├── controllers/
│   │   └── auth.controller.js    # Register, login, profile, and user handlers
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT Bearer verification & RBAC authorization
│   │   └── error.middleware.js   # 404 router and centralized error interceptor
│   ├── models/
│   │   └── user.model.js         # User model with pre-save bcrypt hashing & methods
│   ├── routes/
│   │   └── auth.routes.js        # Express REST routing for auth endpoints
│   ├── utils/
│   │   └── generateToken.js      # JWT signing utility
│   ├── app.js                    # Express app configuration & middleware pipeline
│   └── server.js                 # Server initialization & graceful shutdown
├── .env.example                  # Environment configuration template
├── package.json                  # Dependencies & scripts
├── postman_collection.json       # Postman Collection v2.1 importable schema
├── requests.http                 # 19 executable test cases for VS Code REST Client
└── README.md                     # Dedicated assignment documentation
```

### ⚡ Quick Start for Assignment 2

1. **Navigate to the project directory:**
   ```bash
   cd 02-user-auth-api
   ```

2. **Install dependencies & run:**
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **API Endpoints Summary:**
   - `GET /api/health` — Health check endpoint
   - `POST /api/auth/register` — Register a new user and issue JWT
   - `POST /api/auth/login` — Authenticate user and return JWT
   - `GET /api/auth/profile` — Get authenticated user's profile (Protected)
   - `PUT /api/auth/profile` — Update user details or password (Protected)
   - `GET /api/auth/users` — List all registered users (Admin only)

---

## 📝 Mini Project: Notes App Backend Highlights

The **`03-notes-app-backend`** project implements a full-featured, secure, multi-tenant notes management backend:

```text
03-notes-app-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Resilient Mongoose connection
│   ├── controllers/
│   │   ├── auth.controller.js    # User registration, login, and profile handlers
│   │   └── note.controller.js    # User-scoped CRUD, pin/archive, search, and stats handlers
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT Bearer verification & user injection
│   │   └── error.middleware.js   # 404 router and centralized error interceptor
│   ├── models/
│   │   ├── user.model.js         # User model with bcrypt hashing
│   │   └── note.model.js         # Note model with tags, compound indexes & text search
│   ├── routes/
│   │   ├── auth.routes.js        # Express REST routing for auth endpoints
│   │   └── note.routes.js        # Express REST routing for protected notes endpoints
│   ├── utils/
│   │   └── generateToken.js      # JWT signing utility
│   ├── app.js                    # Express app configuration & middleware pipeline
│   └── server.js                 # Server initialization & graceful shutdown
├── .env.example                  # Environment configuration template
├── package.json                  # Dependencies & scripts
├── postman_collection.json       # Postman Collection v2.1 importable schema
├── requests.http                 # 20+ executable test cases for VS Code REST Client
└── README.md                     # Dedicated assignment documentation
```

### ⚡ Quick Start for Mini Project (Assignment 3)

1. **Navigate to the project directory:**
   ```bash
   cd 03-notes-app-backend
   ```

2. **Install dependencies & run:**
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **API Endpoints Summary:**
   - `GET /api/health` — Health check endpoint
   - `POST /api/auth/register` — Register user & return JWT
   - `POST /api/auth/login` — Login user & return JWT
   - `GET /api/auth/profile` — Get user profile (Protected)
   - `PUT /api/auth/profile` — Update user profile (Protected)
   - `POST /api/notes` — Create user-scoped note (Protected)
   - `GET /api/notes` — List notes with search, pagination (`page`, `limit`), and filter (`category`, `tag`, `isPinned`, `isArchived`, `sort`)
   - `GET /api/notes/stats` — Aggregate metrics summary (Protected)
   - `GET /api/notes/:id` — Retrieve note by ID (Protected, ownership enforced)
   - `PUT /api/notes/:id` — Update note by ID (Protected, ownership enforced)
   - `PATCH /api/notes/:id/pin` — Toggle pin status (Protected)
   - `PATCH /api/notes/:id/archive` — Toggle archive status (Protected)
   - `DELETE /api/notes/:id` — Remove note from database (Protected, ownership enforced)

---

## 🛡️ Best Practices & Quality Standards

- **Uniform Response Schema**:
  ```json
  // Success Response
  {
    "success": true,
    "message": "Resource processed successfully",
    "data": { ... }
  }

  // Error Response
  {
    "success": false,
    "message": "Detailed error description"
  }
  ```
- **Error Interception**: Automatic handling for `ValidationError`, `CastError` (invalid MongoDB ObjectIds), JSON parse errors, and 404 route catches.
- **Graceful Lifecycle Management**: Server handles unhandled promise rejections and `SIGTERM` signals for zero-downtime container readiness.

---

## 👨‍💻 Author

**SkillNexis MERN Stack Internship Participant**  
- **Week 2**: Backend Development (Node.js, Express.js, MongoDB)
