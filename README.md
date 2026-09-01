<div align="center">

# 🌐 SkillNexis MERN Stack Internship

[![Internship Track](https://img.shields.io/badge/Track-Full--Stack%20MERN-blue?style=for-the-badge&logo=react)](https://github.com/sharatkumar-dev/SkillNexis-MERN-Stack-Internship)
[![Status](https://img.shields.io/badge/Status-Week%202%20Completed-success?style=for-the-badge)](https://github.com/sharatkumar-dev/SkillNexis-MERN-Stack-Internship)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.19-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Central repository for weekly assignments, milestones, and full-stack projects built during the SkillNexis Full Stack Web Development (MERN) Internship.</b>
</p>

</div>

---

## 👨‍💻 Intern Profile

- **Developer:** Sharatkumar Naik
- **GitHub:** [@sharatkumar-dev](https://github.com/sharatkumar-dev)
- **Internship Track:** Full-Stack Web Development (MERN Stack)
- **Organization:** SkillNexis

---

## 📁 Repository Structure

```text
SkillNexis-MERN-Stack-Internship/
│
├── .gitignore                          # Ignored build artifacts and dependencies
├── README.md                           # Central repository documentation
│
├── Week 1/                             # Week 1: Frontend Foundations & React Intro
│   ├── README.md                       # Week 1 Overview & Run Guide
│   ├── 01-portfolio/                   # Assignment 1: Personal Developer Portfolio (HTML5/CSS3)
│   ├── 02-react-components/            # Assignment 2: React Core Components & State
│   └── 03-react-blog-ui/               # Assignment 3: React Tech Blog SPA UI
│
├── Week 2/                             # Week 2: Backend Development (Node.js, Express, MongoDB)
│   ├── README.md                       # Dedicated Week 2 Documentation & Architecture Guide
│   ├── 01-todo-list-api/               # Assignment 1: Full CRUD Task Management REST API
│   │   ├── src/                        # MVC Controllers, Models, Routes, Middlewares
│   │   ├── postman_collection.json     # Postman Collection v2.1 import schema
│   │   ├── requests.http               # 16 automated test scenarios for REST Client
│   │   └── README.md                   # Assignment 1 Documentation
│   ├── 02-user-auth-api/               # Assignment 2: User Authentication API (Bcrypt & JWT)
│   │   ├── src/                        # Controllers, Auth Middlewares, User Model
│   │   ├── postman_collection.json     # Postman Collection v2.1 with auto-token script
│   │   ├── requests.http               # 19 automated test scenarios for REST Client
│   │   └── README.md                   # Assignment 2 Documentation
│   └── 03-notes-app-backend/           # Mini Project: Notes App Backend API with User Scoped CRUD
│       ├── src/                        # Complete MVC Architecture (Auth + Notes)
│       ├── postman_collection.json     # Postman Collection v2.1 with variable presets
│       ├── requests.http               # 20+ automated test scenarios with dynamic JWT chaining
│       └── README.md                   # Mini Project Documentation
│
├── Week 3/                             # Week 3: Full-Stack Integration & Advanced Workflows
│   └── .gitkeep
└── Week 4/                             # Week 4: Cloud Deployment & Capstone Project
    └── .gitkeep
```

---

## 🗓️ Weekly Milestones & Submission Index

| Week | Focus Area | Submissions & Projects | Status | Link |
| :---: | :--- | :--- | :---: | :---: |
| **01** | **Frontend Foundations & React Intro** | • **Assignment 1:** Personal Developer Portfolio (HTML5/CSS3)<br>• **Assignment 2:** React Components & Dynamic State<br>• **Assignment 3:** React Tech Blog SPA UI | ✅ **Completed** | [View Week 1](./Week%201) |
| **02** | **Backend Development (Node, Express, MongoDB)** | • **Assignment 1:** To-Do List CRUD REST API with MongoDB<br>• **Assignment 2:** User Authentication API (Bcrypt & JWT)<br>• **Mini Project:** Notes App Backend API (User Scoped CRUD) | ✅ **Completed** | [View Week 2](./Week%202) |
| **03** | **Full-Stack MERN Integration** | *Scheduled for Week 3* | ⏳ Upcoming | [View Week 3](./Week%203) |
| **04** | **Capstone Deployment & Performance** | *Scheduled for Week 4* | ⏳ Upcoming | [View Week 4](./Week%204) |

---

## 🛠️ Technology Stack

| Category | Technologies & Tools |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+), React.js, Vite |
| **Styling** | Modern Vanilla CSS3, CSS Grid, Flexbox, Custom Properties (Theming) |
| **Backend** | Node.js (v18+), Express.js (v4.19), RESTful Architecture, MVC Pattern |
| **Database & ODM** | MongoDB (v7+), Mongoose (v8+), Compound & Text Indexing, Data Aggregations |
| **Authentication & Security** | JSON Web Tokens (JWT), Bcrypt.js (10 salt rounds), Stateless Bearer Middleware |
| **Testing & API Tooling** | Postman Collections (v2.1), VS Code REST Client (`.http`), Morgan |
| **DevOps & VCS** | Git, GitHub, Nodemon, Dotenv |

---

## 🚀 Quick Start Guide

### 1. Clone Repository
```bash
git clone https://github.com/sharatkumar-dev/SkillNexis-MERN-Stack-Internship.git
cd SkillNexis-MERN-Stack-Internship
```

### 2. Exploring Week 2 Backend Projects

#### Assignment 1: To-Do List REST API
```bash
cd "Week 2/01-todo-list-api"
npm install
cp .env.example .env
npm run dev
```

#### Assignment 2: User Authentication API
```bash
cd "Week 2/02-user-auth-api"
npm install
cp .env.example .env
npm run dev
```

#### Mini Project: Notes App Backend API
```bash
cd "Week 2/03-notes-app-backend"
npm install
cp .env.example .env
npm run dev
```

---

## 📜 Submission & Verification

All assignments follow strict architectural guidelines, modular separation of concerns, standardized JSON error envelopes, and automated test cases. Each project folder contains dedicated `README.md`, `requests.http`, and `postman_collection.json` artifacts for evaluator review.
