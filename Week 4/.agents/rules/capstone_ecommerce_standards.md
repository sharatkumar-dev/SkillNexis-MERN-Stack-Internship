# Week 4 Capstone E-Commerce & Deployment Standards

## 1. Project Organization
The Capstone E-Commerce application should follow a clean, decoupled full-stack architecture:
- `backend/`: Express server, MongoDB Mongoose models, JWT authentication & RBAC middleware, Multer image upload handling, data seeder (`npm run seed`), `.env.example`, `requests.http`, and `postman_collection.json`.
- `frontend/`: React + Vite SPA, React Router v6+, Axios instance with token interceptor, Context API state management (`AuthContext`, `CartContext`), modern responsive UI, and `vercel.json` SPA rewrite rules.

## 2. Security & Role-Based Access Control (RBAC)
- **Customer vs. Admin Roles**:
  - `customer`: Browse products, search/filter, manage personal cart, place orders, view personal order history.
  - `admin`: Full customer access + Admin Dashboard (`/admin`), product CRUD (create, update, delete, stock adjustment), order status updates, metrics overview.
- **Passwords**: Hashed with `bcryptjs` (salt rounds: 10).
- **JWT**: Bearer tokens verified via stateless `protect` middleware; admin routes guarded by `adminOnly` middleware.
- **Input Validation & Sanitization**: Ensure negative prices, negative stock, or invalid order quantities are rejected at both controller and schema levels.

## 3. Deployment Configurations
- Backend must include dynamic CORS to allow both local development (`http://localhost:5173`) and cloud domains (`CLIENT_URL`).
- Backend must include `/api/health` returning `{ status: "ok" }` for hosting platform ping monitors (Render/UptimeRobot).
- Frontend must contain `vercel.json` with SPA rewrites to prevent 404s on browser reloads.

## 4. Required Submission Artifacts
1. `README.md`:
   - Application Overview & Features
   - Tech Stack & Dependencies
   - Complete REST API Documentation Table (Method, Endpoint, Access, Description)
   - Step-by-step Local Setup & Seeding Instructions
   - Cloud Deployment Guide (Render + Vercel + MongoDB Atlas)
2. `.env.example`: Template for environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
3. `requests.http`: Automated REST Client test script covering auth, products, orders, and admin endpoints.
4. `postman_collection.json`: Valid Postman Collection Schema v2.1 for instant testing.
