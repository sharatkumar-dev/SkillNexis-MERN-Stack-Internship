---
name: ecommerce-fullstack
description: >-
  Architectural patterns, database schemas, state management, and business logic
  for building robust, full-stack MERN E-Commerce applications with customer and admin capabilities.
---

# MERN Full-Stack E-Commerce Architecture & Best Practices

This skill outlines domain-specific guidelines, schemas, state management patterns, and REST endpoints for developing a full-featured E-Commerce web application.

---

## 1. Core Domain Models (Mongoose)

### A. User Model (`src/models/User.js`)
- `name`: String, required, trim
- `email`: String, required, unique, lowercase, trim
- `password`: String, required (hashed with bcryptjs, 10 salt rounds)
- `role`: String, enum: `['customer', 'admin']`, default: `'customer'`
- `avatar`: String, default avatar URL or blank
- `timestamps`: true

### B. Product Model (`src/models/Product.js`)
- `name`: String, required, trim, indexed
- `description`: String, required
- `price`: Number, required, min: 0
- `category`: String, required, indexed
- `brand`: String, default: 'Generic'
- `countInStock`: Number, required, min: 0, default: 0
- `imageUrl`: String, required (supports local upload path via Multer or external URL)
- `rating`: Number, default: 0, min: 0, max: 5
- `numReviews`: Number, default: 0
- `isFeatured`: Boolean, default: false
- `timestamps`: true

### C. Order Model (`src/models/Order.js`)
- `user`: ObjectId, ref: 'User', required
- `orderItems`: Array of:
  - `name`: String, required
  - `qty`: Number, required, min: 1
  - `price`: Number, required
  - `imageUrl`: String, required
  - `product`: ObjectId, ref: 'Product', required
- `shippingAddress`:
  - `address`: String, required
  - `city`: String, required
  - `postalCode`: String, required
  - `country`: String, required
- `paymentMethod`: String, required (e.g., `'CashOnDelivery'`, `'CreditCard'`, `'Stripe'`, `'PayPal'`)
- `itemsPrice`: Number, required
- `taxPrice`: Number, required, default: 0.0
- `shippingPrice`: Number, required, default: 0.0
- `totalPrice`: Number, required
- `orderStatus`: String, enum: `['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']`, default: `'Pending'`
- `isPaid`: Boolean, default: false
- `paidAt`: Date
- `isDelivered`: Boolean, default: false
- `deliveredAt`: Date
- `timestamps`: true

---

## 2. API Endpoints Specification

### Authentication & Users (`/api/auth`)
- `POST /api/auth/register` — Register customer account (returns JWT & user info)
- `POST /api/auth/login` — Login user or admin (returns JWT & user info)
- `GET /api/auth/profile` — Get current logged-in user profile (Protected)
- `PUT /api/auth/profile` — Update current user profile/password (Protected)

### Products (`/api/products`)
- `GET /api/products` — List products with search (`?search=`), category filter (`?category=`), sort (`?sort=price_asc`), and pagination (`?page=1&limit=8`)
- `GET /api/products/categories` — Get unique list of product categories
- `GET /api/products/:id` — Get single product details
- `POST /api/products` — Create product with Multer image upload (Protected, Admin Only)
- `PUT /api/products/:id` — Update product details or stock (Protected, Admin Only)
- `DELETE /api/products/:id` — Remove product (Protected, Admin Only)

### Orders (`/api/orders`)
- `POST /api/orders` — Create new order from cart (Protected)
- `GET /api/orders/my-orders` — Get logged-in user's orders (Protected)
- `GET /api/orders/:id` — Get order by ID (Protected: order owner or Admin)
- `GET /api/orders` — List all orders across users (Protected, Admin Only)
- `PUT /api/orders/:id/status` — Update order status / delivery tracking (Protected, Admin Only)

### Dashboard & Analytics (`/api/admin`)
- `GET /api/admin/stats` — Total sales, total orders, total products, total users, recent orders (Protected, Admin Only)

---

## 3. Role-Based Access Control (RBAC)

Use two-tier middleware:
```javascript
// src/middleware/authMiddleware.js
export const protect = async (req, res, next) => {
  // Verifies Bearer JWT, sets req.user
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admin privileges required' });
  }
};
```

---

## 4. Frontend State Architecture (React)

1. **`AuthContext` (`src/context/AuthContext.jsx`)**:
   - `user`, `token`, `isAuthenticated`, `isAdmin`
   - `login(email, password)`, `register(data)`, `logout()`
   - Automatically syncs token with `localStorage` and configures Axios headers.

2. **`CartContext` (`src/context/CartContext.jsx`)**:
   - `cartItems`: Array of items with `{ product, name, price, imageUrl, qty, countInStock }`
   - `addToCart(product, qty)`: Handles stock quantity ceilings
   - `removeFromCart(productId)`
   - `updateQty(productId, qty)`
   - `clearCart()`
   - `cartSubtotal`, `cartTax`, `cartShipping`, `cartTotal`
   - Persisted in `localStorage` for seamless user sessions.

3. **Routing Architecture (`src/App.jsx`)**:
   - Public: `/`, `/product/:id`, `/login`, `/register`, `/cart`
   - Customer Protected: `/checkout`, `/order-success/:id`, `/my-orders`, `/profile`
   - Admin Protected: `/admin/dashboard`, `/admin/products`, `/admin/orders`

---

## 5. Seed Data Routine

Always supply a database seed script (`src/seeder.js` or `npm run seed`) with:
- 1 default admin account (`admin@skillnexis.com` / `admin123`)
- 1 default test customer (`customer@skillnexis.com` / `customer123`)
- 8-12 diverse demo products across 3-4 categories with sample images.
