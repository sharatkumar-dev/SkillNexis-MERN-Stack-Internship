# 📝 TaskFlow — Full Stack MERN To-Do Application
> **SkillNexis MERN Stack Internship — Week 3: Assignment 1**  
> *Full-Stack Integration: Connecting React Frontend with Express & MongoDB Backend*

---

## 🌟 Overview

**TaskFlow** is a modern, responsive, full-stack task management application engineered using the MERN stack (MongoDB, Express.js, React, Node.js). It demonstrates robust decoupled client-server architecture, JSON Web Token (JWT) stateless authentication, role/user-scoped data isolation, and comprehensive CRUD operations with dynamic filtering, live search, and analytical insights.

---

## 🏗️ Architecture & Decoupled Design

```text
01-todo-fullstack/
├── README.md                      # Comprehensive project documentation
├── backend/                       # Express + Node.js REST API
│   ├── .env.example               # Backend environment variable template
│   ├── requests.http              # Automated VS Code REST Client test suite
│   ├── postman_collection.json    # Postman Collection Schema v2.1
│   └── src/
│       ├── config/db.js           # Mongoose MongoDB connection
│       ├── controllers/           # Auth and To-Do business logic
│       │   ├── authController.js
│       │   └── todoController.js
│       ├── middleware/            # JWT auth guard & centralized error handling
│       │   ├── authMiddleware.js
│       │   └── errorHandler.js
│       ├── models/                # Mongoose data schemas
│       │   ├── User.js            # User model with bcryptjs password hashing
│       │   └── Todo.js            # Todo model with user ownership references
│       ├── routes/                # Express routing endpoints
│       │   ├── authRoutes.js
│       │   └── todoRoutes.js
│       └── server.js              # Server entrypoint & middleware setup
│
└── frontend/                      # React 18 + Vite SPA
    ├── .env.example               # Frontend environment template
    ├── vite.config.js             # Vite bundler configuration
    ├── index.html                 # HTML shell with Google Fonts
    └── src/
        ├── api/axiosInstance.js   # Centralized Axios client with Bearer interceptor
        ├── context/AuthContext.jsx# React Context API global auth provider
        ├── components/            # Reusable UI components
        │   ├── ProtectedRoute.jsx # Route authentication guard
        │   ├── Navbar.jsx         # Navigation header & session controls
        │   ├── StatsBar.jsx       # Analytics dashboard cards
        │   ├── TodoFilter.jsx     # Search bar, status tabs, and priority filters
        │   ├── TodoCard.jsx       # Interactive task item with badge indicators
        │   └── TodoFormModal.jsx  # Accessible modal for task creation & editing
        ├── pages/                 # Route-level views
        │   ├── LoginPage.jsx      # Login view with error handling
        │   ├── RegisterPage.jsx   # Registration view with client validation
        │   ├── DashboardPage.jsx  # Main interactive task management workspace
        │   └── NotFoundPage.jsx   # 404 page
        ├── styles/index.css       # Custom design system (glassmorphism & dark palette)
        ├── App.jsx                # React Router v6+ declarative routing
        └── main.jsx               # Application root mounting
```

---

## 🚀 Features

- 🔐 **Stateless JWT Authentication:**
  - Secure user registration and login with 10 salt rounds `bcryptjs` hashing.
  - JWT token verification protecting all task management endpoints.
  - Automatic token attachment via Axios request interceptors.
- 📋 **Complete CRUD Operations:**
  - **Create:** Add tasks with title, description, priority (`low`, `medium`, `high`), and due date.
  - **Read:** Retrieve tasks scoped exclusively to the authenticated user.
  - **Update:** Edit task details and toggle completion status with optimistic UI updates.
  - **Delete:** Remove tasks with confirmation safeguards.
- 🔍 **Live Search & Filtering:**
  - Instant text search across task titles and descriptions.
  - Status filter tabs: `All`, `Pending`, and `Completed`.
  - Priority dropdown filtering: `All Priorities`, `High`, `Medium`, and `Low`.
- 📊 **Real-time Analytics Stats Bar:**
  - Total tasks, Pending count, Completed count, and percentage completion rate.
- 🎨 **Modern User Experience:**
  - Dark slate & indigo aesthetic with glassmorphism panels.
  - Responsive layouts optimized for desktop and mobile devices.
  - Visual toast alerts for user feedback.

---

## 📡 API Reference

All backend responses conform to the unified JSON schema:
- **Success:** `{ "success": true, "message": "...", "data": { ... } }`
- **Error:** `{ "success": false, "message": "...", "errors": [ "..." ] }`

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve authenticated user profile |

### To-Do Endpoints (`/api/todos`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/todos` | Private | List todos (supports `?search=`, `?status=`, `?priority=`) |
| `GET` | `/api/todos/:id` | Private | Retrieve a specific todo by ID |
| `POST` | `/api/todos` | Private | Create a new task |
| `PUT` | `/api/todos/:id` | Private | Update an existing task |
| `PATCH`| `/api/todos/:id/toggle`| Private | Toggle task completion status |
| `DELETE`| `/api/todos/:id` | Private | Permanently delete a task |

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string.

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Copy template and update MONGO_URI and JWT_SECRET if needed
cp .env.example .env

# Start backend development server
npm run dev
# or
npm start
```
The backend API server will start on `http://localhost:5000`.

### 2. Frontend Setup
```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Configure environment variables (defaults to http://localhost:5000/api)
cp .env.example .env

# Start Vite development server
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Testing

### Automated REST Client (`requests.http`)
Open `backend/requests.http` in VS Code with the **REST Client** extension installed. You can execute requests in sequence; the login request automatically extracts and stores the JWT token for subsequent protected endpoints.

### Postman Collection v2.1
Import `backend/postman_collection.json` into Postman:
1. Click **Import** in Postman and select `postman_collection.json`.
2. Run the `Auth > Register User` or `Auth > Login User` request.
3. The embedded test script automatically updates the `authToken` collection variable.
4. Execute any of the `Todos` requests seamlessly.

---

## 📜 Standards & Compliance
- **Backend Architecture:** Pure MVC separation (`config`, `models`, `controllers`, `routes`, `middleware`).
- **Frontend Architecture:** Declarative routing with React Router v6+, Context API, and Axios interceptors.
- **Security:** Passwords securely hashed with `bcryptjs`, JWT verification on private endpoints, and strict CORS configuration.
