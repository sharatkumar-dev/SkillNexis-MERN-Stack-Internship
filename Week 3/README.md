# 🌐 Week 3 — Full Stack Integration (Connecting Frontend & Backend)

Welcome to **Week 3** of the SkillNexis MERN Stack Internship! This week is focused on connecting React frontends with Express/Node.js backends and MongoDB databases.

---

## ✅ Week 3 Assignments — Status

| # | Project | Description | Status |
|:---:|:---|:---|:---:|
| 1 | [`01-todo-fullstack`](./01-todo-fullstack/) | Full Stack To-Do App — JWT Auth, CRUD, Protected Routes | ✅ Complete |
| 2 | [`02-image-upload-app`](./02-image-upload-app/) | Image Upload with Multer, gallery rendering, file preview | ✅ Complete |
| 🏆 | [`03-task-manager-app`](./03-task-manager-app/) | **Mini Project** — Task Manager with Kanban, filters & analytics | ✅ Complete |

---

## 📚 Syllabus & Core Topics

- **Full-Stack Communication:** Connecting React (Vite) frontend with Express REST APIs using Axios / Fetch API.
- **Client-Side Routing & Security:** React Router v6+ with protected/private routes and JWT authorization header management.
- **State Management:** React Context API for global user authentication state and task management.
- **Multipart Form Data & File Uploads:** Image upload pipelines using **Multer** on the backend with client-side preview & gallery rendering.

---

## 📁 Week 3 Projects & Modules

```text
Week 3/
├── 01-todo-fullstack/         # Assignment 1: Full Stack To-Do Application (Auth + CRUD + Routing)
│   ├── backend/               # Express + MongoDB API (JWT Auth + Tasks CRUD)
│   └── frontend/              # Vite + React (Context API + Protected Routes)
│
├── 02-image-upload-app/       # Assignment 2: Image Upload Feature (Express + Multer + React)
│   ├── backend/               # Multer upload endpoint, MIME filtering, static file serving
│   └── frontend/              # File picker, live image preview, multipart upload, gallery
│
├── 03-task-manager-app/       # Mini Project: Task Manager Application
│   ├── backend/               # Full REST API (Auth, Task filtering, categories, priority, search)
│   └── frontend/              # Rich dashboard, filtering controls, stats, task CRUD modal
│
└── practice-set/              # Practice Set: REST API for Users, Mongoose, JWT Auth & Testing
    ├── src/                   # User CRUD & Auth API
    ├── requests.http          # Automated REST Client testing scenarios
    └── postman_collection.json# Postman Collection v2.1
```

---

## 🛠️ Tech Stack & Dependencies

- **Frontend:** React 18 / 19, Vite, React Router DOM v6+, Axios, Lucide React, Modern CSS
- **Backend:** Node.js, Express.js, Mongoose, JSONWebToken, Bcrypt.js, Multer, Cors, Dotenv, Morgan
- **Database:** MongoDB
- **Testing & API Tooling:** VS Code REST Client (`.http`), Postman Collection v2.1
