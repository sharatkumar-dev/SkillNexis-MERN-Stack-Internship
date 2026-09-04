# SkillNexis MERN Stack Internship — Workspace Rules & Guidelines

This document outlines the coding standards, architectural rules, and project workflows for building robust, clean, and production-ready MERN stack applications in this repository.

---

## 🏛️ Architectural Standards

### 1. Backend (Node.js + Express + MongoDB)
- **MVC Architecture**: Strict separation of concerns:
  - `src/models/`: Mongoose schemas with validation, defaults, timestamps, and indexes.
  - `src/controllers/`: Business logic, async handlers, and database interactions.
  - `src/routes/`: Express routers mapping HTTP methods to controller actions with route-level middleware.
  - `src/middleware/`: Reusable middleware (authentication, validation, error handling, file upload).
  - `src/config/`: Database connection (`db.js`), environment configs, and constants.
  - `src/server.js` or `src/app.js`: Express app initialization, middleware mounting, and server listener.
- **Unified API Response Schema**:
  - Success: `{ "success": true, "message": "...", "data": { ... } }`
  - Error: `{ "success": false, "message": "...", "errors": [ ... ] }`
- **Error Handling**: Centralized error-handling middleware (`errorHandler.js`). Always use `try...catch` or async handler wrappers to catch unhandled rejections.
- **Environment Isolation**: Always use `dotenv`. Maintain `.env.example` in every project root with dummy values. Never commit `.env` files.

### 2. Frontend (React + Vite)
- **Tooling**: Built with **Vite** for fast HMR and optimized builds.
- **Project Structure**:
  - `src/components/`: Reusable, modular UI components (Header, Navbar, Button, Modal, Card, etc.).
  - `src/pages/`: Route-level view components (Home, Dashboard, Login, Register, NotFound).
  - `src/context/`: React Context providers for global state (e.g., `AuthContext`, `ThemeContext`).
  - `src/services/` or `src/api/`: Axios instance configured with `baseURL` and interceptors for Bearer token injection.
  - `src/hooks/`: Custom React hooks for shared logic.
  - `src/styles/`: Modular CSS / Tailwind / CSS variables for clean theming.
- **Routing**: React Router DOM (v6+) with declarative routing and `ProtectedRoute` wrappers for authenticated paths.

---

## 🔒 Security & Best Practices

1. **Authentication**:
   - Passwords hashed with `bcryptjs` (salt rounds: 10).
   - JWT tokens generated with `jsonwebtoken` using secure secrets and expiration times (e.g., `7d` or `24h`).
   - Stateless `authMiddleware` verifying `Authorization: Bearer <token>` header.
2. **File Uploads (Multer)**:
   - Restrict uploads to permitted MIME types (e.g., `image/jpeg`, `image/png`, `image/webp`, `image/gif`).
   - Enforce file size limits (e.g., max 5MB).
   - Generate collision-resistant filenames (`Date.now() + '-' + Math.round(Math.random() * 1E9) + ext`).
   - Serve uploads securely via `express.static('uploads')`.
3. **CORS Configuration**: Explicitly allow frontend origin with appropriate methods and headers.

---

## 📦 Required Project Artifacts for Submissions

Every assignment and mini-project directory must include:
1. `README.md`: Project description, tech stack, API documentation table, and clear local setup instructions.
2. `.env.example`: Template for environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, etc.).
3. `requests.http`: Comprehensive automated test scenarios for the VS Code REST Client extension.
4. `postman_collection.json`: Valid Postman Collection Schema v2.1 for one-click API testing.
