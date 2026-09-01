# 📝 Notes App REST API (`03-notes-app-backend`)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Bcrypt](https://img.shields.io/badge/Bcrypt.js-Security-yellowgreen?style=for-the-badge)](https://www.npmjs.com/package/bcryptjs)

A complete, production-grade Notes Application RESTful API built with **Node.js**, **Express.js**, **MongoDB / Mongoose**, **Bcrypt.js**, and **JSON Web Tokens (JWT)** for **Week 2 (Mini Project / Assignment 3)** of the SkillNexis MERN Stack Internship.

---

## 🌟 Key Features

- 🔐 **User Authentication**: Secure user registration, password hashing (10 rounds bcrypt), and stateless JWT Bearer token authentication.
- 👤 **Strict Multi-Tenant Isolation**: Notes are strictly scoped to the authenticated user (`req.user._id`). Cross-user access is impossible.
- 📋 **Complete Notes CRUD**: Create, read, update, and delete notes with rich fields (title, content, category, tags, color, pin status, archive status).
- 📌 **Pin & Archive Management**: Dedicated PATCH endpoints to toggle pin and archive states with automated unpinning on archive.
- 🔍 **Search & Flexible Filtering**: Full-text / regex search (`q`), category filters, tag filters, pin filters, and archive filters.
- 📊 **Aggregated Statistics**: Aggregate summary endpoint (`GET /api/notes/stats`) reporting total, pinned, active, and archived counts along with category breakdown.
- 📄 **Pagination & Custom Sorting**: Configurable `page`, `limit`, and multi-directional sorting (`title-asc`, `title-desc`, `oldest`, `newest`, `updated`).
- 🛑 **Centralized Error Handling**: Intercepts Mongoose `ValidationError`, `CastError` (invalid ObjectId), `11000` duplicate email errors, JWT errors, and 404 routes.
- 🧪 **Complete Test Suites**: Automated `requests.http` test suite with response variable chaining and standard Postman Collection v2.1.

---

## 🏗️ Modular Architecture

```text
03-notes-app-backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── auth.controller.js    # Register, login, and user profile handlers
│   │   └── note.controller.js    # CRUD, pin/archive, filter/search & stats handlers
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification & req.user attachment
│   │   └── error.middleware.js   # 404 handler and centralized error interceptor
│   ├── models/
│   │   ├── user.model.js         # User model with bcrypt hashing & validation
│   │   └── note.model.js         # Note model with user reference, tags & compound indexes
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoint routing definitions
│   │   └── note.routes.js        # Protected notes endpoint routing definitions
│   ├── utils/
│   │   └── generateToken.js      # JWT signing utility
│   ├── app.js                    # Express app configuration & middleware pipeline
│   └── server.js                 # Server initialization & graceful shutdown listeners
├── .env.example                  # Environment configuration template
├── .env                          # Local environment settings
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and npm scripts
├── postman_collection.json       # Postman Collection v2.1 with variable presets
├── requests.http                 # 20+ executable test cases for REST Client
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 2. Installation & Setup
```bash
# Navigate to the project directory
cd 03-notes-app-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### 3. Environment Variables (`.env`)
```env
PORT=5002
MONGODB_URI=mongodb://127.0.0.1:27017/notes_app_db
NODE_ENV=development
JWT_SECRET=supersecretjwtkey_notesapp_2026_skillnexis
JWT_EXPIRES_IN=30d
```

### 4. Running the Server
```bash
# Development mode with auto-reload (nodemon)
npm run dev

# Production mode
npm start
```

---

## 📡 API Endpoints Reference

### Base URL: `http://localhost:5002/api`

### 1. Health & Authentication
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | **Public** | Check server operational health |
| `POST` | `/auth/register` | **Public** | Register new user & return JWT token |
| `POST` | `/auth/login` | **Public** | Authenticate credentials & return JWT |
| `GET` | `/auth/profile` | **Private** | Retrieve current user profile |
| `PUT` | `/auth/profile` | **Private** | Update user profile / password |

### 2. Notes Management (All Protected via JWT)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/notes` | **Private** | Create a new note |
| `GET` | `/notes` | **Private** | List notes (search `q`, filter `category`, `tag`, `isPinned`, `isArchived`, pagination `page`, `limit`) |
| `GET` | `/notes/stats` | **Private** | Aggregate notes metrics and category distribution |
| `GET` | `/notes/:id` | **Private** | Retrieve a specific note by ID |
| `PUT` | `/notes/:id` | **Private** | Update note details |
| `PATCH` | `/notes/:id/pin` | **Private** | Toggle pinned status |
| `PATCH` | `/notes/:id/archive` | **Private** | Toggle archive status (auto-unpins if archived) |
| `DELETE` | `/notes/:id` | **Private** | Delete a specific note |

---

## 💡 Example Payloads

### 1. Create Note (`POST /api/notes`)
**Header:** `Authorization: Bearer <your_jwt_token>`  
**Request Body:**
```json
{
  "title": "MERN Stack Architecture Notes",
  "content": "Ensure separation of concerns with controllers, middleware, models, and routes.",
  "category": "Work",
  "tags": ["mern", "express", "mongodb"],
  "color": "#FEF3C7",
  "isPinned": true
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Note created successfully",
  "data": {
    "_id": "66d48291a1e0b518c50e2011",
    "user": "66d4828fa1e0b518c50e2009",
    "title": "MERN Stack Architecture Notes",
    "content": "Ensure separation of concerns with controllers, middleware, models, and routes.",
    "category": "Work",
    "tags": ["mern", "express", "mongodb"],
    "color": "#FEF3C7",
    "isPinned": true,
    "isArchived": false,
    "createdAt": "2026-09-01T18:50:00.000Z",
    "updatedAt": "2026-09-01T18:50:00.000Z"
  }
}
```

---

### 2. Notes Summary Statistics (`GET /api/notes/stats`)
**Header:** `Authorization: Bearer <your_jwt_token>`  
**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "totalNotes": 8,
    "activeNotes": 6,
    "pinnedNotes": 2,
    "archivedNotes": 2,
    "categories": [
      { "category": "Work", "count": 4 },
      { "category": "Personal", "count": 2 },
      { "category": "Study", "count": 2 }
    ]
  }
}
```

---

## 🧪 Testing with REST Client & Postman

### Using `requests.http`
Open [`requests.http`](./requests.http) in VS Code or Antigravity IDE. Click **Send Request** sequentially to run automated variable-captured scenarios from user registration through notes CRUD, filtering, multi-tenant isolation, and deletion.

### Using Postman
1. Launch Postman and click **Import**.
2. Select [`postman_collection.json`](./postman_collection.json).
3. Run the **Register** or **Login** requests; the post-response test scripts will automatically configure `{{authToken}}` and `{{noteId}}`.

---

## 🛡️ Security & Performance Highlights

- **Pre-save Bcrypt Hashing**: Hashes passwords with 10 salt rounds before storage.
- **Strict User Scoping**: Queries enforce `{ user: req.user._id }` preventing data leakage between users.
- **Compound & Text Indexing**: Indexes on `{ user: 1, isPinned: -1, createdAt: -1 }` and text indexes on `{ title, content }`.
- **Graceful Lifecycle Management**: Listens to `SIGTERM` / `SIGINT` signals and handles uncaught rejections.
