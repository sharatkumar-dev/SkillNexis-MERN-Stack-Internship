# 🚀 Week 4 — Capstone Project & Cloud Deployment

Welcome to **Week 4** of the SkillNexis MERN Stack Internship! This week represents the culmination of the internship program, focusing on building a production-grade MERN Capstone application and deploying it to the cloud.

---

## 🏆 Selected Capstone Project

### **E-Commerce Web Application (`capstone-ecommerce-app`)**
A complete full-stack e-commerce platform with customer shopping flows, persistent cart, order management, role-based access control, and an administrative back-office dashboard.

> **Note:** Building the comprehensive E-Commerce Web Application fulfills both the **Week 4 Practice Set** (Mini E-Commerce, Auth, Full-Stack Integration, Deployment) and the **Week 4 Major Capstone Project** requirements.

---

## 📋 Curriculum & Learning Outcomes

| Topic | Focus Areas |
|:---|:---|
| **Advanced React & API Integration** | Context API (`AuthContext`, `CartContext`), Axios interceptors, responsive catalog, debounced search, category filtering |
| **Authentication & RBAC** | JWT tokens, bcryptjs hashing, stateless `protect` middleware, `adminOnly` route guarding |
| **E-Commerce Operations** | Shopping cart persistence, stock ceilings, order placement, status tracking (Pending → Processing → Shipped → Delivered) |
| **Admin Controls & Multer** | Product CRUD with file upload via Multer, stock updates, order status management, business metrics |
| **Cloud Deployment** | Frontend on **Vercel**, Backend on **Render**, Database on **MongoDB Atlas**, CORS & SPA rewrite configurations |
| **Testing & Documentation** | Automated VS Code REST Client scenarios (`requests.http`) and Postman Collection v2.1 |

---

## 📁 Week 4 Directory Structure

```text
Week 4/
├── .agents/
│   ├── rules/
│   │   └── capstone_ecommerce_standards.md   # Architectural & coding standards for Week 4
│   └── skills/
│       ├── ecommerce-fullstack/              # E-Commerce schemas, endpoints & state guide
│       └── mern-deployment/                  # Step-by-step Render, Vercel & Atlas deployment
│
├── capstone-ecommerce-app/                   # 🛒 Full-Stack Capstone Application
│   ├── backend/                              # Express + Mongoose REST API & Multer uploads
│   │   ├── src/
│   │   │   ├── config/                       # DB connection & constants
│   │   │   ├── controllers/                  # Auth, Product, Order, Admin controllers
│   │   │   ├── middleware/                   # JWT auth, RBAC, Multer, Error handlers
│   │   │   ├── models/                       # User, Product, Order schemas
│   │   │   ├── routes/                       # Express routers
│   │   │   ├── utils/                        # Token generator & helpers
│   │   │   ├── seeder.js                     # Seed script for initial admin, users & products
│   │   │   └── server.js                     # Express app & listener
│   │   ├── uploads/                          # Multer uploaded images
│   │   ├── .env.example                      # Template for backend environment variables
│   │   ├── requests.http                     # Automated REST Client testing suite
│   │   ├── postman_collection.json           # Postman Collection v2.1
│   │   └── package.json
│   │
│   ├── frontend/                             # Vite + React 19 SPA
│   │   ├── src/
│   │   │   ├── api/                          # Axios instance with Bearer interceptor
│   │   │   ├── components/                   # Navbar, Footer, ProductCard, CartDrawer, etc.
│   │   │   ├── context/                      # AuthContext, CartContext
│   │   │   ├── pages/                        # Home, ProductDetail, Cart, Checkout, Orders, Admin
│   │   │   ├── App.jsx                       # Route tree with ProtectedRoute & AdminRoute
│   │   │   └── main.jsx
│   │   ├── vercel.json                       # Vercel SPA routing rewrite rule
│   │   ├── .env.example                      # Frontend environment template
│   │   └── package.json
│   │
│   └── README.md                             # Comprehensive project documentation & guide
│
├── practice set.pdf                          # Practice set instructions
├── week 4.pdf                                # Capstone project guidelines & slides
└── README.md                                 # Week 4 overview
```

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, React Router DOM v6+, Lucide React, Axios, Modern CSS
- **Backend:** Node.js, Express.js, Mongoose, JSONWebToken, Bcrypt.js, Multer, Cors, Dotenv, Morgan
- **Database:** MongoDB (Local / Atlas Cloud)
- **Deployment Targets:** Vercel (Frontend), Render (Backend), MongoDB Atlas (Database)
- **API Testing:** VS Code REST Client (`.http`), Postman Collection v2.1
