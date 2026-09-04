# 🖼️ Week 3 — Assignment 2: Image Upload Feature (`02-image-upload-app`)

Complete full-stack implementation of the **Image Upload Feature** for **Week 3** of the **SkillNexis MERN Stack Internship**.

---

## 📖 Project Overview

This application fulfills all objectives specified in the **Week 3 Syllabus**:
1. **Create a file upload endpoint using Multer** on Express with MIME filtering, size limits, and collision-resistant storage.
2. **Integrate with React to preview and display uploaded images** with live pre-upload thumbnails, gallery view, filtering, search, and full-resolution lightbox modal inspection.

---

## 🏛️ Architecture & Project Structure

```text
02-image-upload-app/
├── backend/
│   ├── src/
│   │   ├── config/db.js              # Database connection
│   │   ├── models/
│   │   │   ├── Image.js              # Mongoose image metadata schema
│   │   │   └── storeAdapter.js       # Dual storage engine (MongoDB + in-memory fallback)
│   │   ├── middleware/
│   │   │   ├── uploadMiddleware.js   # Multer diskStorage, MIME whitelist, 5MB limit
│   │   │   └── errorHandler.js       # Unified error handler (Multer, Mongoose, 500)
│   │   ├── controllers/
│   │   │   └── imageController.js    # Single/batch upload, CRUD, stats, download
│   │   ├── routes/
│   │   │   └── imageRoutes.js        # Express router endpoints
│   │   └── server.js                 # App configuration & static uploads routing
│   ├── uploads/                      # Local file storage for uploaded images
│   ├── .env.example                  # Environment template
│   ├── requests.http                 # VS Code REST Client test suite
│   ├── postman_collection.json       # Postman Collection Schema v2.1
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/imageApi.js           # Axios multipart upload and REST client
    │   ├── components/
    │   │   ├── Navbar.jsx            # Top navigation & actions
    │   │   ├── Dropzone.jsx          # Drag-and-drop zone with instant preview
    │   │   ├── ImageCard.jsx         # Card with quick actions (view, copy, download, delete)
    │   │   ├── ImageGallery.jsx      # Gallery with category filter & search
    │   │   ├── ImageModal.jsx        # Fullscreen lightbox modal with metadata inspection
    │   │   ├── StorageStats.jsx      # Live storage usage & counts
    │   │   └── Toast.jsx             # User notifications
    │   ├── styles/index.css          # Dark glassmorphic design system & animations
    │   ├── App.jsx                   # Main layout and state integration
    │   └── main.jsx                  # React DOM mount point
    ├── .env.example
    ├── vite.config.js
    └── package.json
```

---

## ⚡ Quick Start Guide

### 1. Start the Backend API

```bash
cd "Week 3/02-image-upload-app/backend"
npm install
npm run dev
```
*Backend runs on `http://localhost:5001` with static uploads served at `http://localhost:5001/uploads/`.*

### 2. Start the Frontend Application

```bash
cd "Week 3/02-image-upload-app/frontend"
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🧪 Testing & Verification

- **Automated REST Client Tests:** Open [`backend/requests.http`](file:///c:/Users/kingo/Documents/SkillNexis%20Internship/MERN%20Stack/Week%203/02-image-upload-app/backend/requests.http) and execute test cases.
- **Postman Collection:** Import [`backend/postman_collection.json`](file:///c:/Users/kingo/Documents/SkillNexis%20Internship/MERN%20Stack/Week%203/02-image-upload-app/backend/postman_collection.json).
- **Frontend Production Build:** Run `npm run build` in `frontend/` to confirm zero compilation errors.
