# 🔐 User Authentication REST API (`02-user-auth-api`)

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Tokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Bcrypt](https://img.shields.io/badge/Bcrypt.js-Security-yellowgreen?style=for-the-badge)](https://www.npmjs.com/package/bcryptjs)

A production-grade, modular User Authentication and Authorization RESTful API developed with **Node.js**, **Express.js**, **MongoDB / Mongoose**, **Bcrypt.js**, and **JSON Web Tokens (JWT)** for **Week 2 (Assignment 2)** of the SkillNexis MERN Stack Internship.

---

## 🌟 Key Features

- 🛡️ **Bcrypt Password Hashing**: Salted hashes (10 rounds) generated automatically via Mongoose pre-save hooks.
- 🔑 **Stateless JWT Authentication**: Signed JWT tokens issued on registration and login, validated via custom `protect` Bearer middleware.
- 👥 **Role-Based Access Control (RBAC)**: Fine-grained access management (`user` vs `admin`) with dedicated `authorize()` guard middleware.
- 🔒 **Data Sanitization**: Passwords marked with `select: false` and explicitly stripped from JSON serialization outputs.
- 🛑 **Centralized Error Handling**: Seamless interception of validation failures, duplicate email errors (`11000`), and expired/malformed tokens.
- 🧪 **Complete Test Suites**: 19 automated test scenarios in `requests.http` and an importable Postman Collection v2.1.

---

## 🏗️ Modular Architecture

```text
02-user-auth-api/
├── src/
│   ├── config/
│   │   └── db.js                 # Resilient MongoDB Mongoose connection handler
│   ├── controllers/
│   │   └── auth.controller.js    # Register, login, profile, update, and admin handlers
│   ├── middleware/
│   │   ├── auth.middleware.js    # JWT verification (protect) and RBAC (authorize)
│   │   └── error.middleware.js   # 404 router and centralized error interceptor
│   ├── models/
│   │   └── user.model.js         # Mongoose User schema with pre-save hashing & methods
│   ├── routes/
│   │   └── auth.routes.js        # Auth endpoint routing definitions
│   ├── utils/
│   │   └── generateToken.js      # JWT signing utility
│   ├── app.js                    # Express app configuration & middleware pipeline
│   └── server.js                 # Server initialization & graceful shutdown listeners
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore file
├── package.json                  # Project metadata and dependencies
├── postman_collection.json       # Postman Collection v2.1 with auto-token script
├── requests.http                 # 19 executable HTTP test cases for REST Client
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)

### 2. Installation & Setup
```bash
# Navigate to project directory
cd 02-user-auth-api

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
```

### 3. Environment Variables (`.env`)
```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/user_auth_db
JWT_SECRET=skillnexis_mern_jwt_secret_key_super_secure_2026
JWT_EXPIRE=30d
```

### 4. Running the Server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

---

## 📡 API Endpoints Reference

### Base URL: `http://localhost:5001/api`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | **Public** | Check server operational health |
| `POST` | `/auth/register` | **Public** | Register new user and return JWT token |
| `POST` | `/auth/login` | **Public** | Authenticate user credentials and return JWT |
| `GET` | `/auth/profile` | **Private** | Retrieve profile of the authenticated user |
| `PUT` | `/auth/profile` | **Private** | Update name, email, or password for current user |
| `GET` | `/auth/users` | **Private (Admin)** | Retrieve all registered users (RBAC protected) |

---

## 💡 Example Request & Response Payloads

### 1. Register User (`POST /api/auth/register`)
**Request Body:**
```json
{
  "name": "Sarah Connor",
  "email": "sarah@skynet.com",
  "password": "Password@123"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "664b38fa1c2e0b518c50e201",
      "name": "Sarah Connor",
      "email": "sarah@skynet.com",
      "role": "user",
      "createdAt": "2026-09-01T13:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Login User (`POST /api/auth/login`)
**Request Body:**
```json
{
  "email": "sarah@skynet.com",
  "password": "Password@123"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "664b38fa1c2e0b518c50e201",
      "name": "Sarah Connor",
      "email": "sarah@skynet.com",
      "role": "user",
      "createdAt": "2026-09-01T13:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. Get User Profile (`GET /api/auth/profile`)
**Header:**
```http
Authorization: Bearer <your_jwt_token>
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "664b38fa1c2e0b518c50e201",
      "name": "Sarah Connor",
      "email": "sarah@skynet.com",
      "role": "user",
      "createdAt": "2026-09-01T13:00:00.000Z",
      "updatedAt": "2026-09-01T13:00:00.000Z"
    }
  }
}
```

---

## 🧪 Testing with REST Client & Postman

### Using `requests.http` (VS Code / Antigravity IDE)
Open [`requests.http`](./requests.http) and click **Send Request** directly above any endpoint. Variable chaining automatically captures tokens from registration and login requests for subsequent protected calls.

### Using Postman
1. Open Postman and click **Import**.
2. Select [`postman_collection.json`](./postman_collection.json).
3. Execute **Register** or **Login** requests; the collection test scripts will automatically set the `{{authToken}}` and `{{adminToken}}` collection variables.

---

## 🛡️ Security Best Practices Applied

- **Bcrypt Salt Rounds**: Uses 10 rounds of cryptographic salting for password hashing.
- **JWT Expiration**: Tokens carry standard expiration periods to reduce replay attack vectors.
- **Password Exposure Prevention**: Passwords are saved hashed, excluded by default (`select: false`), and omitted during JSON serialization.
- **Strict Role Authorization**: Non-admin users are strictly blocked with `403 Forbidden` on privileged endpoints.
