# 📋 Assignment 1: To-Do List REST API

A modular, scalable, and production-ready **CRUD REST API** for task management built with **Node.js**, **Express.js**, and **MongoDB / Mongoose**.

---

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, Toggle, and Delete tasks.
- **Filtering & Search**: Filter tasks by `completed` status, `priority`, or keyword text search in `title`/`description`.
- **Pagination & Sorting**: Paginated results (`page`, `limit`) and flexible sorting (`newest`, `oldest`, `priority`, `dueDate`, `title`).
- **Data Validation & Sanitization**: Strict Mongoose schema validations, enum checks, and trimming.
- **Error Handling**: Centralized error middleware handling 404 routes, Mongoose `ValidationError`, `CastError` (invalid ObjectId), and unhandled server errors.
- **Testing**: Pre-configured `requests.http` test suite compatible with VS Code / Antigravity REST Client.

---

## 📁 Architecture & Folder Structure

```text
01-todo-list-api/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & reconnection events
│   ├── controllers/
│   │   └── task.controller.js    # Business logic & request handlers
│   ├── middleware/
│   │   └── error.middleware.js   # 404 & centralized error handlers
│   ├── models/
│   │   └── task.model.js         # Task Mongoose schema & indexing
│   ├── routes/
│   │   └── task.routes.js        # Express REST route definitions
│   ├── app.js                    # Express app configuration & middleware
│   └── server.js                 # Server entry point & graceful shutdown
├── .env                          # Local environment variables (git-ignored)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore file
├── package.json                  # NPM dependencies & scripts
├── requests.http                 # Ready-to-run REST Client test requests
└── README.md                     # Documentation
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### 2. Install Dependencies
```bash
cd 01-todo-list-api
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` or edit existing `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/todo_list_db
```

### 4. Run the Server
- **Development Mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

---

## 📡 API Endpoints Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Query Parameters / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server Health Status | None |
| `POST` | `/tasks` | Create a new task | Body: `{ title, description?, priority?, dueDate? }` |
| `GET` | `/tasks` | Get all tasks | Query: `completed`, `priority`, `search`, `sort`, `page`, `limit` |
| `GET` | `/tasks/stats` | Get aggregate task metrics | None |
| `GET` | `/tasks/:id` | Get single task by ID | Path: `:id` |
| `PUT` | `/tasks/:id` | Update full/partial task details | Body: `{ title?, description?, completed?, priority?, dueDate? }` |
| `PATCH` | `/tasks/:id/toggle` | Toggle task completion status | Path: `:id` |
| `DELETE` | `/tasks/:id` | Delete task by ID | Path: `:id` |

---

## 🧪 Testing with REST Client / cURL

### Sample Request: Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete MERN Week 2 Assignment",
    "description": "Build CRUD REST API with Express & Mongoose",
    "priority": "high"
  }'
```

### Sample Response:
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "6650a123456789abcdef0123",
    "title": "Complete MERN Week 2 Assignment",
    "description": "Build CRUD REST API with Express & Mongoose",
    "completed": false,
    "priority": "high",
    "dueDate": null,
    "createdAt": "2026-09-01T12:30:00.000Z",
    "updatedAt": "2026-09-01T12:30:00.000Z"
  }
}
```
