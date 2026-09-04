# 🖼️ PixelVault — React Image Upload & Gallery Frontend

Modern, high-performance user interface for **Assignment 2: "Image Upload Feature"** built with **React 18** and **Vite**.

---

## ✨ Features & User Experience

- **Drag-and-Drop Dropzone:** Intuitive dropzone allowing users to drag images directly from desktop or click to browse.
- **Immediate Client-Side Preview:** Uses `URL.createObjectURL()` to instantly render thumbnails and metadata (size, resolution, format) before sending to server.
- **Single & Batch Upload Support:** Toggle between single image upload with rich metadata (Title, Description, Category, Tags) and multi-file batch upload (up to 5 files).
- **Client-Side Validation & Safeguards:** Checks file formats and warns users if files exceed the 5MB size limit prior to network requests.
- **Visual Upload Progress:** Real-time upload percentage bar and state management.
- **Responsive Dynamic Gallery:** Masonry/grid layout displaying all uploaded photos with category pills and search filtering.
- **Fullscreen Lightbox Modal:** Click any image to view in high resolution, inspect detailed storage metadata, copy direct URLs, download original attachments, or delete with confirmation.
- **Modern Aesthetic Design:** Dark glassmorphism, gradient accents, micro-animations, and responsive layout.

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 6
- **HTTP Client:** Axios (with upload progress tracking)
- **Icons:** Lucide React
- **Typography:** Google Fonts (Outfit & Plus Jakarta Sans)

---

## ⚙️ Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_SERVER_URL=http://localhost:5001
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
The application will launch on `http://localhost:5173`.
