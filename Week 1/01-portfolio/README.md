# 💼 Assignment 1: Personal Developer Portfolio

A responsive, modern personal portfolio website built with pure semantic **HTML5** and **CSS3** (incorporating Flexbox, CSS Grid, custom properties, and responsive media queries) for **Alex Morgan**, Full-Stack Developer.

---

## ✨ Features & Architecture

- **Semantic HTML5 Architecture**:
  - Implemented with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, and `<footer>` tags for SEO optimization, accessibility, and clean markup hierarchy.
- **Modern CSS3 Design System**:
  - CSS Custom Properties (CSS variables) for consistent theming and colors.
  - Glassmorphism & ambient gradient lighting effects (`backdrop-filter: blur()`).
  - Interactive hover animations, multi-color glowing top borders, and card elevations.
- **Dedicated Sections**:
  1. **Hero & About**: Photorealistic studio portrait of Alex, live availability status indicator, bio, primary CTAs, and social profile links.
  2. **Tech Stack & Skills**: Categorized skills (Frontend, Backend & Database, Tools & Workflow) with modern tag badges.
  3. **Education & Milestones**: Chronological timeline format displaying academic credentials, internship tracks, status indicators, and acquired competency pills.
  4. **Featured Projects**: Responsive CSS Grid displaying project cards with category badges, descriptions, tech stack tags, and demo links.
  5. **Contact**: Interactive styled form with field focus rings and direct contact details.
- **100% Responsive Design**:
  - Mobile-friendly navigation drawer with hamburger toggle.
  - Fluid typography and dynamic grid restructuring for mobile, tablet, and desktop viewports.
  - Logo click with smooth back-to-top scrolling.
  - Custom branded SVG favicon.

---

## 📁 File Structure

```text
01-portfolio/
│
├── assets/
│   ├── alex-hero.jpg       # Photorealistic studio portrait of Alex Morgan
│   ├── alex-hero.svg       # Vector illustration avatar asset
│   └── favicon.svg         # Modern gradient code-bracket favicon
│
├── css/
│   └── style.css           # Complete CSS3 Design System & Responsive Queries
│
├── index.html              # Semantic HTML5 single-page application
└── README.md               # Assignment documentation
```

---

## 🚀 How to Run & Preview

### Option 1: Direct File Opening
Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local Web Server
```bash
# From within the 01-portfolio directory:
npx serve .

# Or using Python 3:
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.