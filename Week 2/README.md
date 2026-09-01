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
| [**`02-user-auth-api/`**](./02-user-auth-api/) | **Assignment 2** | User Authentication API with Bcrypt password hashing & JWT token issuance | ⏳ *Upcoming* |
| [**`03-notes-app-backend/`**](./03-notes-app-backend/) | **Mini Project** | Secure Notes API with user-authenticated CRUD operations | ⏳ *Upcoming* |

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

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```

4. **Run in Development Mode:**
   ```bash
   npm run dev
   ```

5. **API Endpoints Summary:**
   - `GET /api/health` — Health check endpoint
   - `POST /api/tasks` — Create new task (validates title, priority, due date)
   - `GET /api/tasks` — List tasks with search, pagination (`page`, `limit`), and filter (`completed`, `priority`, `sort`)
   - `GET /api/tasks/stats` — Aggregate metrics summary
   - `GET /api/tasks/:id` — Retrieve task by MongoDB ObjectId
   - `PUT /api/tasks/:id` — Update task details
   - `PATCH /api/tasks/:id/toggle` — Quick completion status toggle
   - `DELETE /api/tasks/:id` — Remove task from database

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
