# 📸 PixelVault — Image Upload Backend (Multer + Express + MongoDB)

Production-ready backend API service for **Assignment 2: "Image Upload Feature"** of the **SkillNexis MERN Stack Internship (Week 3)**.

---

## 🚀 Key Features

- **Multipart Form Data Handling:** Configured with **Multer** diskStorage.
- **Strict Security & MIME Validation:** Enforces whitelist filtering (`image/jpeg`, `image/png`, `image/webp`, `image/gif`, `image/svg+xml`) and rejects executable/script uploads.
- **Collision-Resistant Filenaming:** Names files with a high-entropy format `img-<timestamp>-<random-hash>.<ext>`.
- **File Size Restrictions:** Enforces maximum size limit (5MB configurable via `MAX_FILE_SIZE_MB`).
- **Disk File & Database Synchronization:** Removing an image deletes both its MongoDB record and unlinks its physical file from `uploads/` folder.
- **Unified API Response Schema:** All responses strictly follow the standardized envelope:
  - Success: `{ "success": true, "message": "...", "data": { ... } }`
  - Error: `{ "success": false, "message": "...", "errors": [ ... ] }`
- **Centralized Error Handling:** Formats Multer errors (`LIMIT_FILE_SIZE`, `LIMIT_UNEXPECTED_FILE`, etc.) into user-friendly JSON payloads.
- **Resilient Dual Storage Adapter:** Automatically connects to MongoDB when available and includes an in-memory fallback store when MongoDB local daemon is inactive.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js (v4.21+)
- **File Upload Engine:** Multer (v1.4.5)
- **Database / ODM:** MongoDB + Mongoose (v8.9+)
- **Middleware & Utilities:** CORS, Dotenv, Morgan

---

## 📋 API Endpoints Specification

| Method | Endpoint | Description | Content-Type | Access |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and upload directory status | `application/json` | Public |
| `POST` | `/api/images/upload` | Upload single image with title, category, tags | `multipart/form-data` | Public |
| `POST` | `/api/images/upload-multiple` | Batch upload up to 5 images simultaneously | `multipart/form-data` | Public |
| `GET` | `/api/images` | List all images (supports `category`, `search`, `sortBy`) | `application/json` | Public |
| `GET` | `/api/images/stats` | Storage analytics (total files, bytes, categories) | `application/json` | Public |
| `GET` | `/api/images/:id` | Get details and metadata of an image by ID | `application/json` | Public |
| `GET` | `/api/images/:id/download` | Download physical file with original filename | Binary Stream | Public |
| `DELETE`| `/api/images/:id` | Delete database record and unlink file from disk | `application/json` | Public |
| `GET` | `/uploads/:filename` | Direct static image file access with CORS headers | Image MIME | Public |

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/image_upload_app
MAX_FILE_SIZE_MB=5
UPLOAD_DIRECTORY=uploads
CLIENT_ORIGIN=http://localhost:5173
```

---

## 🧪 Testing the API

### 1. VS Code REST Client (`requests.http`)
Open [requests.http](file:///c:/Users/kingo/Documents/SkillNexis%20Internship/MERN%20Stack/Week%203/02-image-upload-app/backend/requests.http) in VS Code with the REST Client extension installed and click **Send Request** above any test case.

### 2. Postman Collection (`postman_collection.json`)
Import [postman_collection.json](file:///c:/Users/kingo/Documents/SkillNexis%20Internship/MERN%20Stack/Week%203/02-image-upload-app/backend/postman_collection.json) into Postman to run automated request suites.
