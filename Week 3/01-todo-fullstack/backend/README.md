# ⚙️ TaskFlow Backend — REST API Service
> **Express.js + MongoDB + JWT Authentication**

---

## 📖 Overview
The **TaskFlow Backend** is a modular RESTful API built with Express.js and Mongoose, enforcing strict MVC architectural separation. It provides stateless authentication via JSON Web Tokens (JWT) and user-scoped CRUD endpoints for tasks, with dynamic filtering, live search, and analytical aggregation.

---

## 🏛️ Architecture & Folder Structure
```text
backend/
├── package.json
├── .env.example
├── requests.http              # Automated VS Code REST Client test script
├── postman_collection.json    # Postman Collection Schema v2.1
└── src/
    ├── server.js              # App initialization, middleware, routes, listener
    ├── config/
    │   └── db.js              # Mongoose database connection
    ├── models/
    │   ├── User.js            # User schema with bcrypt password hashing
    │   ├── Todo.js            # Todo schema with priority, dueDate, user ref
    │   └── storeAdapter.js    # Data adapter with resilient in-memory fallback
    ├── controllers/
    │   ├── authController.js  # Registration, Login, and Profile endpoints
    │   └── todoController.js  # CRUD, filtering, search, and toggle endpoints
    ├── routes/
    │   ├── authRoutes.js      # /api/auth routes
    │   └── todoRoutes.js      # /api/todos routes
    └── middleware/
        ├── authMiddleware.js  # Bearer token verification
        └── errorHandler.js    # Centralized unified error formatter
```

---

## 🔑 Environment Variables
Create a `.env` file in the `backend/` root directory:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/todo_fullstack
JWT_SECRET=super_secret_jwt_key_skillnexis_week3_assignment1
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```
The server runs on `http://localhost:5000`.

---

## 📡 API Specification

### Unified Response Format
- **Success:**
  ```json
  {
    "success": true,
    "message": "Operation description",
    "data": { ... }
  }
  ```
- **Error:**
  ```json
  {
    "success": false,
    "message": "Error description",
    "errors": [ "Detailed validation or system error" ]
  }
  ```

### Endpoints
| Method | Route | Auth | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | No | Server status & healthcheck |
| `POST` | `/api/auth/register` | No | Register new user account |
| `POST` | `/api/auth/login` | No | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Yes | Get authenticated user profile |
| `PUT` | `/api/auth/profile` | Yes | Update user profile details (name, email) |
| `PUT` | `/api/auth/update-password` | Yes | Update user password with current password verification |
| `DELETE` | `/api/auth/account` | Yes | Permanently delete user account and associated tasks |
| `GET` | `/api/todos` | Yes | Get user's todos (`?search=`, `?status=`, `?priority=`) |
| `POST` | `/api/todos` | Yes | Create a new todo |
| `GET` | `/api/todos/:id` | Yes | Get single todo by ID |
| `PUT` | `/api/todos/:id` | Yes | Update todo title, description, priority, dueDate |
| `PATCH`| `/api/todos/:id/toggle` | Yes | Toggle todo completion state |
| `DELETE`| `/api/todos/:id` | Yes | Permanently delete a single todo |
| `DELETE`| `/api/todos/completed/clear` | Yes | Bulk clear all completed tasks for user |

---

## 🧪 Testing the API
1. **VS Code REST Client:** Open `requests.http` and click **Send Request**.
2. **Postman:** Import `postman_collection.json` and run the request scenarios.
