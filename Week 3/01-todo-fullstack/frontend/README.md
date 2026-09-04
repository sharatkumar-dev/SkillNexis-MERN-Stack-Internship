# 🎨 TaskFlow Frontend — React + Vite SPA
> **Modern Responsive Client with React Router v6 & Context API**

---

## 📖 Overview
The **TaskFlow Frontend** is a single-page application built with React 18 and Vite. It provides an intuitive, responsive user interface featuring glassmorphic aesthetic styling, real-time analytics KPIs, live search, status and priority filters, accessible creation modals, and instant status toggles.

---

## 🏛️ Component Architecture
```text
frontend/
├── package.json
├── vite.config.js
├── index.html
├── .env.example
└── src/
    ├── main.jsx                   # React root mount with BrowserRouter
    ├── App.jsx                    # Routing configuration & AuthProvider
    ├── index.css                  # Custom CSS design system (tokens, themes)
    ├── api/
    │   └── axiosInstance.js       # Axios client with Bearer interceptor
    ├── context/
    │   └── AuthContext.jsx        # Authentication state & localStorage sync
    ├── components/
    │   ├── ProtectedRoute.jsx     # Route authentication guard
    │   ├── Navbar.jsx             # App bar with user session management
    │   ├── StatsBar.jsx           # Task summary analytics cards
    │   ├── TodoFilter.jsx         # Search and filter controls
    │   ├── TodoCard.jsx           # Interactive task item card
    │   └── TodoFormModal.jsx      # Task creation & editing modal
    └── pages/
        ├── LoginPage.jsx          # Login view with input validation
        ├── RegisterPage.jsx       # Registration view with password matching
        ├── DashboardPage.jsx      # Main task management workspace
        └── NotFoundPage.jsx       # 404 page
```

---

## 🔑 Environment Variables
Create a `.env` file in the `frontend/` root:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your web browser.

### 3. Build for Production
```bash
npm run build
```
Generates optimized static assets inside the `dist/` directory.

---

## 🌟 Key Features
- 🛡️ **Protected Routing:** Prevents unauthenticated access to the dashboard using `<ProtectedRoute>`.
- 🔄 **Axios Interceptors:** Automatically attaches JWT tokens to request headers and manages 401 unauthenticated session expirations.
- 📊 **Real-time Analytics:** Visual KPIs dynamically reflect task completion rates.
- 🏷️ **Priority Categorization:** Color-coded badges for High, Medium, and Low priorities.
- ⚡ **Optimistic Updates:** Instant UI response when toggling task completion.
