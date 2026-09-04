# Week 2 Backend Development Standards & Rules

## 1. Architecture & Folder Structure
For each backend project, adhere to the standard modular MVC/layered architecture:
```text
project/
├── src/
│   ├── config/          # Database connection (db.js) & env configs
│   ├── controllers/     # Request handlers & response logic
│   ├── middleware/      # Auth (authMiddleware.js), error handlers (errorMiddleware.js)
│   ├── models/          # Mongoose schemas and models
│   ├── routes/          # Express route definitions
│   ├── utils/           # Helper functions & token generators
│   └── app.js (or server.js) # Express app entry point
├── .env.example         # Template for environment variables
├── .gitignore           # Must ignore node_modules, .env, *.log
├── package.json
└── README.md            # Setup instructions, endpoints table, & Postman guide
```

## 2. API Design & HTTP Status Codes
- **RESTful naming conventions**:
  - Use plural nouns for resources (e.g., `/api/tasks`, `/api/auth`, `/api/notes`).
  - Correct HTTP verbs: `GET` (fetch), `POST` (create), `PUT`/`PATCH` (update), `DELETE` (remove).
- **Status Codes**:
  - `200 OK`: Successful fetch / update / general request.
  - `201 Created`: Successful resource creation (new task, new user registered, new note).
  - `400 Bad Request`: Missing required fields, invalid input format, validation failure.
  - `401 Unauthorized`: Missing or invalid JWT token, invalid login credentials.
  - `403 Forbidden`: Authenticated user does not have permission to access the resource.
  - `404 Not Found`: Resource or route does not exist.
  - `500 Internal Server Error`: Unhandled server/database errors.
- **Consistent Response Payload Format**:
  ```json
  // Success
  {
    "success": true,
    "message": "Task created successfully",
    "data": { ... }
  }

  // Error
  {
    "success": false,
    "message": "Error description here"
  }
  ```

## 3. Database & Mongoose Rules
- Always validate required fields with informative error messages in Mongoose schemas.
- Use `{ timestamps: true }` in Mongoose schemas to automatically track `createdAt` and `updatedAt`.
- Use Mongoose connection handlers (`mongoose.connection.on('error', ...)` and `mongoose.connection.once('open', ...)`).
- Provide graceful error handling if MongoDB fails to connect or connection string is missing.

## 4. Security & Authentication Guidelines
- **Password Security**:
  - Never store plain text passwords.
  - Use `bcryptjs` (or `bcrypt`) with a minimum of 10 salt rounds before saving.
  - Exclude password from query responses (`select: false` or delete password in response payload).
- **JWT (JSON Web Token)**:
  - Sign tokens with a secure secret stored in `process.env.JWT_SECRET`.
  - Include minimal payload (e.g. `{ id: user._id, email: user.email }`).
  - Extract tokens from `Authorization: Bearer <token>` header.
- **Environment Isolation**:
  - Always keep sensitive keys (`PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`) in `.env`.
  - Always include a `.env.example` in each project.

## 5. Testing & Verification
- Provide `.http` (REST client) files or Postman collection files alongside every project for immediate testing.
- Implement a health check endpoint `GET /api/health` or `GET /` on all services.
