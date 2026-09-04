<h1 align="center">
  <img src="https://img.shields.io/badge/TaskFlow-Task%20Manager-6366F1?style=for-the-badge&logo=checkmarx&logoColor=white" alt="TaskFlow" />
</h1>

<p align="center">
  <strong>A production-grade, full-stack Task Manager Application built with the MERN Stack</strong><br/>
  JWT Authentication · Kanban Board · Advanced Filtering · Real-time Analytics
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-Auth-FB7185?style=flat-square&logo=jsonwebtokens&logoColor=white" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Environment Variables](#-environment-variables)

---

## 🌟 Overview

**TaskFlow** is a full-featured task management application designed as the Week 3 Mini Project for the SkillNexis MERN Stack Internship. It demonstrates a complete, production-ready integration of a React frontend with an Express + MongoDB REST API, covering stateless JWT authentication, advanced task management, and a premium glassmorphism UI.

The backend implements a **dual-mode data layer** — it connects to MongoDB when available and automatically falls back to an in-memory store, keeping the entire application fully functional without requiring a local MongoDB instance.

---

## ✨ Features

### 🔒 Authentication
- User registration and login with **bcryptjs** password hashing (10 rounds)
- **Stateless JWT** authentication (`Authorization: Bearer <token>`)
- Protected routes on both frontend (React Router) and backend (Express middleware)
- **One-click Demo Login** for instant evaluation and grading

### ✅ Task Management
| Feature | Details |
|---|---|
| **CRUD** | Create, Read, Update, and Delete tasks |
| **Status Workflow** | `To Do` → `In Progress` → `Completed` |
| **Priority Levels** | `Low`, `Medium`, `High`, `Urgent` |
| **Categories** | `Work`, `Personal`, `Study`, `Finance`, `Health`, `Other` |
| **Due Dates** | Date picker with overdue detection and visual alerts |
| **Quick Status** | Status dropdown on each card for rapid updates |

### 🔍 Filtering & Search
- **Live keyword search** across task title and description
- **Status filter pills** (All / To Do / In Progress / Completed)
- **Priority dropdown** filter
- **Category dropdown** filter
- **Multi-field sorting**: Newest, Oldest, Due Date, Title (A-Z)
- One-click **Reset Filters** button

### 📊 Dashboard Analytics
- **Total Tasks**, **In Progress**, **Completed**, **Urgent + Overdue** KPI cards
- **Completion Rate** percentage displayed in the navbar
- Real-time metric refresh on every task action

### 🎨 UI / UX
- **Dark glassmorphism** design with indigo/violet accent palette
- **Kanban Board View** — 3 columns (To Do · In Progress · Completed)
- **Grid Card View** — responsive card layout with toggle
- Priority-colored accent bars on task cards
- Smooth modal animations with `cubic-bezier` transitions
- **Inter** + **Outfit** typography from Google Fonts

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, React Router DOM v6, Axios, Lucide React |
| **Backend** | Node.js, Express.js, Morgan, CORS, Dotenv |
| **Database** | MongoDB, Mongoose ODM (with in-memory fallback) |
| **Auth** | JSON Web Token (`jsonwebtoken`), `bcryptjs` |
| **Styling** | Vanilla CSS — custom glassmorphism design system |
| **Testing** | VS Code REST Client (`.http`), Postman Collection v2.1 |

---

## 📁 Project Structure

```text
03-task-manager-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                   # Mongoose connection with graceful fallback
│   │   ├── controllers/
│   │   │   ├── authController.js        # Register, Login, Get Profile
│   │   │   └── taskController.js        # Task CRUD, Search, Filter, Stats
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js        # JWT Bearer token validation
│   │   │   └── errorHandler.js          # Centralized error handler (404 + Mongoose)
│   │   ├── models/
│   │   │   ├── User.js                  # User Mongoose schema + bcrypt pre-save
│   │   │   ├── Task.js                  # Task schema with indexes & enum validation
│   │   │   └── storeAdapter.js          # Dual-mode store (MongoDB ↔ In-Memory)
│   │   ├── routes/
│   │   │   ├── authRoutes.js            # /api/auth routes
│   │   │   └── taskRoutes.js            # /api/tasks routes
│   │   └── server.js                    # Express app bootstrap
│   ├── .env.example                     # Environment variable template
│   ├── package.json
│   ├── requests.http                    # VS Code REST Client test suite (20 scenarios)
│   └── postman_collection.json          # Postman Collection v2.1
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axiosClient.js           # Axios instance + token interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx               # Top bar with user pill, completion rate, logout
    │   │   ├── StatsOverview.jsx        # KPI metric cards
    │   │   ├── FilterBar.jsx            # Search, status pills, dropdowns, view toggle
    │   │   ├── TaskCard.jsx             # Task card with priority badge + actions
    │   │   ├── TaskKanban.jsx           # 3-column Kanban board
    │   │   ├── TaskModal.jsx            # Create / Edit modal
    │   │   ├── DeleteConfirmModal.jsx   # Delete confirmation dialog
    │   │   └── ProtectedRoute.jsx       # React Router auth guard
    │   ├── context/
    │   │   ├── AuthContext.jsx          # Global auth state (user, token, login, register, logout)
    │   │   └── TaskContext.jsx          # Global task state, filters, CRUD, modals
    │   ├── pages/
    │   │   ├── DashboardPage.jsx        # Main workspace
    │   │   ├── LoginPage.jsx            # Sign-in screen with one-click demo login
    │   │   ├── RegisterPage.jsx         # Registration screen
    │   │   └── NotFoundPage.jsx         # 404 screen
    │   ├── styles/
    │   │   └── index.css                # Full design system (variables, components, layouts)
    │   ├── App.jsx                      # Route configuration
    │   └── main.jsx                     # React DOM entry point
    ├── index.html
    ├── package.json
    └── vite.config.js                   # Vite dev server (port 5175)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** running locally at `mongodb://127.0.0.1:27017` *(optional — app works without it using in-memory fallback)*

### 1. Clone the Repository

```bash
git clone https://github.com/sharatkumar-dev/SkillNexis-MERN-Stack-Internship.git
cd SkillNexis-MERN-Stack-Internship/Week\ 3/03-task-manager-app
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if needed (default values work out of the box)
npm run dev
```

> ✅ API will start at **`http://localhost:5002`**

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

> ✅ App will open at **`http://localhost:5175`**

### 4. Quick Start (Demo Login)

Once the app is running, click **"Demo Login"** on the sign-in screen for instant access. No manual registration required.

---

## 📡 API Reference

**Base URL:** `http://localhost:5002/api`

All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

### Response Schema

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "...",
  "errors": [ "..." ]
}
```

---

### 🔓 Authentication Endpoints

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/health` | Public | Server health & uptime check |
| `POST` | `/auth/register` | Public | Register new user (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Public | Login and receive JWT token |
| `GET` | `/auth/me` | 🔒 Private | Get current user profile |

**Register payload:**
```json
{
  "name": "Alex Mercer",
  "email": "alex@example.com",
  "password": "password123"
}
```

**Login payload:**
```json
{
  "email": "alex@example.com",
  "password": "password123"
}
```

---

### ✅ Task Endpoints

| Method | Endpoint | Access | Description |
|:---:|:---|:---:|:---|
| `GET` | `/tasks` | 🔒 Private | List tasks (supports query filters) |
| `GET` | `/tasks/stats` | 🔒 Private | Task analytics & aggregate metrics |
| `POST` | `/tasks` | 🔒 Private | Create a new task |
| `GET` | `/tasks/:id` | 🔒 Private | Get single task by ID |
| `PUT` | `/tasks/:id` | 🔒 Private | Update task details |
| `PATCH` | `/tasks/:id/status` | 🔒 Private | Quick status update |
| `DELETE` | `/tasks/:id` | 🔒 Private | Delete task permanently |

**GET /tasks — Query Parameters:**

| Parameter | Values | Description |
|---|---|---|
| `search` | any string | Search title and description (regex) |
| `status` | `todo` · `in_progress` · `completed` | Filter by status |
| `priority` | `low` · `medium` · `high` · `urgent` | Filter by priority |
| `category` | `Work` · `Personal` · `Study` · `Finance` · `Health` · `Other` | Filter by category |
| `sortBy` | `createdAt` · `dueDate` · `priority` · `title` | Sort field |
| `order` | `asc` · `desc` | Sort direction (default: `desc`) |

**Create Task payload:**
```json
{
  "title": "Implement JWT Protected Routes",
  "description": "Configure authMiddleware and Axios interceptors.",
  "status": "in_progress",
  "priority": "urgent",
  "category": "Work",
  "dueDate": "2026-09-10T18:00:00.000Z"
}
```

**GET /tasks/stats — Response:**
```json
{
  "success": true,
  "message": "Task statistics retrieved successfully",
  "data": {
    "total": 12,
    "byStatus": { "todo": 4, "in_progress": 5, "completed": 3 },
    "byPriority": { "low": 1, "medium": 4, "high": 5, "urgent": 2 },
    "overdue": 2,
    "completionRate": 25
  }
}
```

---

## 🧪 Testing

### Option A: VS Code REST Client

Open [`backend/requests.http`](./backend/requests.http) and click **"Send Request"** above each numbered scenario. The file includes **20 test scenarios** covering:
- Health check, registration, login, duplicate registration (expect 400)
- Profile fetch with and without token (expect 401)
- Task creation (multiple priorities and statuses)
- Filtered task listing (status, priority, category, sort)
- Stats endpoint
- Single task retrieval, full update (`PUT`), status patch (`PATCH`)
- Task deletion and verification (expect 404)

Dynamic `@authToken` and `@task1Id` variables are automatically captured from responses.

### Option B: Postman

Import [`backend/postman_collection.json`](./backend/postman_collection.json) into Postman.

The collection includes **automated test scripts** that:
- Capture and store `authToken` after Register or Login
- Capture and store `taskId` after task creation
- Automatically inject tokens for all subsequent requests

### Option C: Demo UI

1. Navigate to `http://localhost:5175`
2. Click **"Demo Login"** for instant access
3. Use **Kanban Board** and **Grid View** toggles
4. Test real-time search, multi-criteria filters, and modal CRUD

---

## ⚙️ Environment Variables

### Backend `backend/.env`

```env
# Server Configuration
PORT=5002
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/task_manager_app

# Security & JWT
JWT_SECRET=skillnexis_task_manager_jwt_secret_2026_super_secure_key
JWT_EXPIRES_IN=7d

# Allowed Frontend Client
CLIENT_URL=http://localhost:5175
```

> **Note:** If `MONGO_URI` is unreachable, the app automatically switches to an in-memory store. All features remain fully operational.

---

## 🏛️ Architecture Decisions

| Decision | Rationale |
|---|---|
| **Dual-mode store adapter** | Guarantees full functionality even without a local MongoDB install — critical for demo & grading environments |
| **Optimistic UI updates** | Status changes reflect instantly in the UI before API confirmation, then roll back on error |
| **React Context API** | Chosen over Redux for appropriate complexity level — two contexts (`AuthContext`, `TaskContext`) cover all global state |
| **Server-side filtering** | All search/filter/sort operations hit the API rather than filtering client-side arrays, demonstrating real-world patterns |
| **Unified API schema** | Every response uses `{ success, message, data }` / `{ success, message, errors }` for consistent client handling |

---

<p align="center">
  Built with ❤️ for the <strong>SkillNexis MERN Stack Internship — Week 3</strong>
</p>
