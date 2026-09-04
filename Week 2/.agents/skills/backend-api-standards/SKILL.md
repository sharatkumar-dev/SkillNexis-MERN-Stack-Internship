---
name: backend-api-standards
description: >-
  Provides architectural standards, boilerplate code patterns, and validation checklists
  for building Express.js REST APIs with MongoDB, Mongoose, bcrypt, and JWT authentication.
---

# Backend API Standards & Best Practices

Use this skill when designing, building, or refactoring Express.js REST APIs with MongoDB.

## Standard Modular Structure

```text
src/
├── config/
│   └── db.js              # Mongoose DB connection logic
├── controllers/
│   └── <resource>.controller.js
├── middleware/
│   ├── auth.middleware.js # JWT verification
│   └── error.middleware.js# Global error handling
├── models/
│   └── <resource>.model.js # Mongoose schema
├── routes/
│   └── <resource>.routes.js
├── utils/
│   └── generateToken.js
└── server.js              # App bootstrap and port listener
```

## Essential Best Practices Checklist
- [ ] CORS enabled with `cors` middleware.
- [ ] Body parsing with `express.json()` and `express.urlencoded({ extended: true })`.
- [ ] Environment variables managed via `dotenv`.
- [ ] Custom `errorHandler` middleware catching 404s and 500s.
- [ ] Mongoose connection with error handling and disconnection logging.
- [ ] Sensitive fields (`password`) marked with `select: false` or sanitized before responding.
- [ ] JWT tokens issued with expiry (e.g., `30d` or `7d`) and decoded via Bearer header.
- [ ] Route testing enabled via `.http` or Postman requests.
