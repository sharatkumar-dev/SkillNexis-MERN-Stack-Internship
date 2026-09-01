# Week 2 Workspace Rules: MERN Stack Backend Development

Welcome to Week 2 of the SkillNexis MERN Stack Internship.

## Project Scope
This workspace covers backend API development with **Node.js**, **Express.js**, and **MongoDB/Mongoose**:
1. **Assignment 1:** `01-todo-list-api` — CRUD REST API for To-Do tasks with MongoDB.
2. **Assignment 2:** `02-user-auth-api` — User Registration & Login with Bcrypt & JWT.
3. **Mini Project:** `03-notes-app-backend` — Complete Notes API with User-authenticated CRUD operations.

## Core Rules for Code Generation
- **Modular Code**: Separate concerns cleanly into `config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `utils/`.
- **Async Handling**: Wrap async controllers safely or use proper try/catch blocks with next(error) middleware.
- **Consistent Response Schema**: Always respond with `{ success: true, ... }` or `{ success: false, message: ... }`.
- **Security**: Never return plain or hashed passwords in API responses. Hash passwords with bcrypt (>= 10 rounds). Protect JWT secret in `.env`.
- **Documentation & Testing**: Include `.http` REST files and Postman documentation for rapid testing.
