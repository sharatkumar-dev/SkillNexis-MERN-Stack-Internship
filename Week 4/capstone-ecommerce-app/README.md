# 🛒 NexisStore — Full-Stack MERN Capstone E-Commerce Application

A production-grade, full-stack MERN (MongoDB, Express, React, Node.js) E-Commerce web application featuring customer shopping workflows, shopping cart persistence, role-based access control (RBAC), administrative back-office management, multipart image uploads via Multer, automated REST Client testing suites, and one-click cloud deployment configurations.

Developed for the **SkillNexis MERN Stack Internship — Week 4 Capstone Project**.

---

## 🌟 Key Features

### 🛍️ Customer Experience
- **Dynamic Product Catalog**: Browse products with live debounced search, category filter pills, multi-criteria sorting (price, newest, rating), and paginated browsing.
- **Detailed Product Views**: High-resolution imagery, real-time inventory counts, customer star reviews, stock ceilings, and immediate cart addition.
- **Persistent Shopping Cart**: State synchronized with `localStorage` across user sessions with inventory validation preventing over-purchasing.
- **Multi-Step Checkout**: Comprehensive destination address capture, instant payment method selection (Cash on Delivery / Simulated Card Authorization), and transparent tax/shipping fee calculation.
- **Order Tracking & Receipts**: Dedicated order confirmation views, order history dashboard (`/my-orders`), and color-coded status badges (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).
- **User Profile Management**: Update full name, email, avatar image, and password securely.

### 🛡️ Administrative Back-Office (`/admin`)
- **Executive Analytics Dashboard**: Real-time overview of gross revenue, total orders, catalog SKU counts, registered customer accounts, category distribution, and low-stock alerts.
- **Catalog Management (CRUD)**: Create new products with local file uploads via **Multer** or remote image URLs, edit stock quantities and prices, and retire products.
- **Order Fulfillment & Lifecycle Control**: Inspect customer shipping details and advance order tracking states (`Pending` → `Processing` → `Shipped` → `Delivered`) with automated delivery date stamping.

### 🔒 Security & Architecture
- **Stateless JWT Authentication**: Bearer tokens with 7-day expiration and automatic injection via Axios interceptors.
- **Password Security**: Passwords salted and hashed with `bcryptjs` (10 rounds) via Mongoose schema pre-save hooks.
- **Role-Based Access Control**: Dual-tier middleware (`protect` and `adminOnly`) securing backend endpoints, matched with declarative `ProtectedRoute` and `AdminRoute` wrappers in React.
- **Safe Inventory Deductions**: Atomically validates stock sufficiency and decrements quantity on order creation; automatically restores stock upon cancellation.

---

## 🛠️ Tech Stack & Tooling

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router DOM v6, Lucide React, Axios, Modern Vanilla CSS |
| **Backend** | Node.js (v24+), Express.js (v4.21+), Mongoose (v8.9+), Multer, Bcrypt.js, JSONWebToken, Cors, Morgan, Dotenv |
| **Database** | MongoDB (Local Community Server / MongoDB Atlas Cloud) |
| **API Testing** | VS Code REST Client (`requests.http`), Postman Collection v2.1 (`postman_collection.json`) |
| **Deployment Targets** | **Vercel** (Frontend SPA), **Render** (Backend REST API), **MongoDB Atlas** (Cloud DB) |

---

## 📁 Directory Structure

```text
capstone-ecommerce-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                  # Mongoose connection & retry logic
│   │   ├── controllers/
│   │   │   ├── adminController.js     # Analytics & dashboard telemetry
│   │   │   ├── authController.js      # Register, login, profile management
│   │   │   ├── orderController.js     # Checkout, inventory deductions, status updates
│   │   │   └── productController.js   # Catalog queries, search, filter, admin CRUD
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js      # JWT protect & adminOnly RBAC
│   │   │   ├── errorHandler.js        # Centralized JSON error formatting
│   │   │   └── uploadMiddleware.js    # Multer multipart file upload handler
│   │   ├── models/
│   │   │   ├── Order.js               # Order schema & items sub-schema
│   │   │   ├── Product.js             # Catalog item schema with validations
│   │   │   └── User.js                # User schema with bcrypt password hashing
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── productRoutes.js
│   │   ├── utils/
│   │   │   └── generateToken.js       # JWT signing helper
│   │   ├── seeder.js                  # Sample data populator script
│   │   └── server.js                  # Express initialization & listener
│   ├── uploads/                       # Multer local image storage
│   ├── .env.example                   # Backend environment template
│   ├── package.json
│   ├── postman_collection.json        # Postman Schema v2.1 collection
│   └── requests.http                  # Automated VS Code REST Client test suite
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js               # Axios instance with Bearer interceptor
│   │   ├── components/
│   │   │   ├── AdminRoute.jsx         # Guard for administrator views
│   │   │   ├── Footer.jsx             # Value propositions & footer links
│   │   │   ├── Navbar.jsx             # Brand logo, search, cart counter, user menu
│   │   │   ├── ProductCard.jsx        # Catalog card with quick-add & stock badge
│   │   │   ├── ProtectedRoute.jsx     # Guard for authenticated customer views
│   │   │   └── Rating.jsx             # Star review visualizer
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Auth state & user persistence
│   │   │   └── CartContext.jsx        # Shopping cart state & stock limit validation
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx     # Telemetry & revenue stats
│   │   │   ├── AdminOrders.jsx        # Order list & status progression
│   │   │   ├── AdminProducts.jsx      # Product inventory CRUD & Multer upload
│   │   │   ├── Cart.jsx               # Line-item management & calculations
│   │   │   ├── Checkout.jsx           # Shipping form & order placement
│   │   │   ├── Home.jsx               # Hero banner, search, category pills & grid
│   │   │   ├── Login.jsx              # Sign in with 1-click demo accounts
│   │   │   ├── OrderHistory.jsx       # Customer order list & receipt links
│   │   │   ├── OrderSuccess.jsx       # Celebration & receipt view
│   │   │   ├── Profile.jsx            # Account details update
│   │   │   └── Register.jsx           # Customer registration
│   │   ├── styles/
│   │   │   └── index.css              # Custom modern design system
│   │   ├── App.jsx                    # Route hierarchy
│   │   └── main.jsx                   # React 18 bootstrap
│   ├── .env.example                   # Frontend environment template
│   ├── index.html
│   ├── package.json
│   ├── vercel.json                    # Vercel SPA routing rewrite configuration
│   └── vite.config.js
└── README.md
```

---

## 📡 REST API Endpoint Documentation

All responses follow the unified standard:
- **Success**: `{ "success": true, "message": "...", "data": { ... } }`
- **Error**: `{ "success": false, "message": "...", "errors": [ ... ] }`

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account (returns JWT) |
| `POST` | `/api/auth/login` | Public | Authenticate user or admin (returns JWT) |
| `GET` | `/api/auth/profile` | Protected | Fetch current logged-in user profile |
| `PUT` | `/api/auth/profile` | Protected | Update profile name, email, avatar, or password |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Paginated catalog with `search`, `category`, and `sort` |
| `GET` | `/api/products/categories` | Public | Get list of distinct product categories |
| `GET` | `/api/products/:id` | Public | Retrieve single product details |
| `POST` | `/api/products` | Admin Only | Create product with Multer image upload |
| `PUT` | `/api/products/:id` | Admin Only | Update product details, image, or stock |
| `DELETE` | `/api/products/:id` | Admin Only | Permanently delete product from catalog |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Protected | Create order from cart items & decrement stock |
| `GET` | `/api/orders/my-orders` | Protected | Get order history for current logged-in customer |
| `GET` | `/api/orders/:id` | Protected (Owner/Admin) | Retrieve single order receipt |
| `GET` | `/api/orders` | Admin Only | Retrieve all orders placed across system |
| `PUT` | `/api/orders/:id/status` | Admin Only | Advance status (`Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`) |

### Admin Analytics (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin Only | Gross revenue, order volume, SKU counts, low-stock metrics |

### System Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Ping health check for Render / UptimeRobot monitors |

---

## ⚡ Quick Start & Local Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local Community Server on `localhost:27017` or MongoDB Atlas URI)

### 2. Backend Setup
```bash
# Navigate to backend directory
cd capstone-ecommerce-app/backend

# Install dependencies
npm install

# Configure environment variables
# Copy .env.example to .env and adjust MONGO_URI if using Atlas:
cp .env.example .env

# Populate database with sample users & catalog items
npm run seed

# Start development server
npm run dev
# -> Server listening on http://localhost:5000
```

### 3. Frontend Setup
```bash
# In a separate terminal, navigate to frontend directory
cd capstone-ecommerce-app/frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Launch Vite development server
npm run dev
# -> Local URL: http://localhost:5173
```

---

## 🔑 Default Seed Credentials

When you run `npm run seed`, the following test accounts are populated:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@skillnexis.com` | `admin123` | Full customer capabilities + Admin back-office (`/admin`) |
| **Customer** | `customer@skillnexis.com` | `customer123` | Catalog browsing, personal cart, checkout, order history |

> *Tip: The Login page includes instant 1-click **"Demo Customer"** and **"Demo Admin"** buttons for effortless testing.*

---

## 🧪 Automated API Testing

### VS Code REST Client (`requests.http`)
Open `backend/requests.http` inside VS Code with the **REST Client** extension installed. Click **"Send Request"** above any scenario to test:
1. Health checks
2. Customer registration & login (auto-storing `@customerToken`)
3. Admin login (auto-storing `@adminToken`)
4. Catalog search and filtering
5. Order checkout & status progression
6. Admin statistics telemetry

### Postman Collection (`postman_collection.json`)
1. Open Postman and click **Import**.
2. Select `backend/postman_collection.json`.
3. Run the **Login Customer** or **Login Admin** requests; test scripts automatically populate the `customerToken` and `adminToken` collection variables for subsequent requests.

---

## ☁️ Cloud Deployment Guide

### A. Database (MongoDB Atlas)
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Under **Database Access**, create a user with read/write privileges.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
4. Copy your connection string (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/capstone_ecommerce?retryWrites=true&w=majority`).

### B. Backend (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/) and click **New → Web Service**.
3. Connect your repository and configure:
   - **Root Directory**: `capstone-ecommerce-app/backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables under **Environment**:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *Your MongoDB Atlas connection URI*
   - `JWT_SECRET`: *A secure random string*
   - `JWT_EXPIRE`: `7d`
   - `CLIENT_URL`: *Your Vercel frontend URL (e.g. `https://your-nexis-store.vercel.app`)*
5. Deploy and verify health check at `https://your-render-app.onrender.com/api/health`.

### C. Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Import your GitHub repository and set:
   - **Root Directory**: `capstone-ecommerce-app/frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: `https://your-render-app.onrender.com/api`
4. Click **Deploy**.
5. The included `vercel.json` ensures all SPA routes (`/cart`, `/checkout`, `/admin/*`) rewrite to `index.html` preventing 404s on refresh.

---

## 📜 Academic Attribution
- **Internship Program**: SkillNexis MERN Stack Internship
- **Curriculum Segment**: Week 4 — Capstone Project & Cloud Deployment
- **Project Designation**: Major Project Option 1 — E-Commerce Web Application
