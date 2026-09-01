# 🚀 Week 1: Frontend Foundations & React Introduction

Welcome to **Week 1** of the **SkillNexis MERN Stack Internship**. This directory contains all weekly assignment submissions focused on advanced semantic HTML5, modern CSS3 responsive styling, and modern React component foundations.

---

## 📑 Assignment Index

| Project Directory | Title | Core Technologies | Status |
| :--- | :--- | :--- | :---: |
| **[01-portfolio](./01-portfolio/)** | **Assignment 1:** Personal Developer Portfolio | Semantic HTML5, CSS3, Flexbox/Grid, Responsive Design | ✅ **Complete** |
| **[02-react-components](./02-react-components/)** | **Assignment 2:** React Components & State | React.js, Vite, Hooks (`useState`), Component Architecture | ✅ **Complete** |
| **[03-react-blog-ui](./03-react-blog-ui/)** | **Assignment 3 (Mini Project):** React Tech Blog UI | React.js, Vite, JSON Feed, Search & Filter, Glassmorphic UI | ✅ **Complete** |

---

## 🌟 Assignment 1: Personal Developer Portfolio

A responsive, high-performance developer portfolio built with semantic **HTML5** and a modern **CSS3** design system.

### Key Highlights:
- **Semantic HTML5 Layout:** Standardized `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` architecture for optimal accessibility and search engine indexing.
- **Glassmorphic Modern UI:** Dark palette, custom CSS variables (`--primary`, `--accent`, `--gradient-card`), and glowing ambient lighting.
- **Hero & Profile:** Photorealistic studio portrait of Alex Morgan, availability status indicator, and social link badges.
- **Skills Matrix:** Categorized cards for Frontend, Backend & Databases, and Tools & Workflow.
- **Education Timeline:** Enhanced milestone cards with category icons, animated status indicator, academic credentials, and skill pills.
- **Featured Projects Grid:** Responsive cards with badges, technology stacks, code repository links, and live preview buttons.
- **Contact Form & Footer:** Form styling with focus rings, direct contact details, and smooth back-to-top navigation.

### 🏃 How to Run Assignment 1:
```bash
# Navigate to the portfolio folder
cd 01-portfolio

# Option A: Open directly in browser
start index.html

# Option B: Run with static local server
npx serve .
```

---

## ⚛️ Assignment 2: React Components Practice

A component-driven React application built strictly according to the **SkillNexis Task PDF** requirements.

### Key Highlights:
- **5 Reusable Components:** Clean implementation of `Header`, `Footer`, `Button`, `Card`, and `Form` with clear prop contracts.
- **Dynamic Props & State:** Reactive `.map()` dynamic card rendering, multi-state `useState` management, category filters, and card interactions (likes, mark done, delete).
- **Controlled Form with Validation:** Real-time field validation, error alerts, and live card creation dispatched directly to state.
- **Modern Theme Switcher:** Instant Dark/Light mode toggle with CSS custom properties.

### 🏃 How to Run Assignment 2:
```bash
# Navigate into Assignment 2 directory
cd 02-react-components

# Install dependencies & run Vite dev server
npm install
npm run dev
```

---

## 📰 Assignment 3 (Mini Project): React Blog UI (DevPulse)

A modern technical publication Single Page Application (SPA) built strictly per the **SkillNexis Task PDF (Page 4)**.

### Key Highlights:
- **JSON Data Feed:** Loads structured blog posts from `posts.json` and renders responsive post cards with cover media, tags, author credentials, and reading times.
- **Real-Time Search & Filters:** Live search query matching across titles, content, authors, and tags, alongside category filter pills and dynamic sorting (Newest, Popularity, Read Time).
- **Interactive Full Reader Modal:** Reading progress bar, syntax-highlighted code blocks with copy triggers, author follow toggle, and discussion comment list with live upvoting.
- **Story Publisher Modal:** Controlled form with live preview mode to create and publish new tech stories dynamically into state.
- **Bookmarks Drawer & Theme System:** Saved article slide-over drawer with navbar badge counter, plus seamless Dark / Light mode switching.

### 🏃 How to Run Assignment 3:
```bash
# Navigate into project directory
cd 03-react-blog-ui

# Install dependencies & run dev server
npm install
npm run dev
```

---

## 📱 Responsiveness & Browser Compatibility
All Week 1 assignments are designed to be mobile-first and fully responsive across:
- 📱 **Mobile** (320px – 480px)
- 💻 **Tablet** (768px – 1024px)
- 🖥️ **Desktop & Ultrawide** (1200px+)