# 📰 Assignment 3 (Mini Project): React Blog UI (DevPulse)

Welcome to **Assignment 3 (Mini Project)** of the **SkillNexis MERN Stack Internship** (Week 1). This application implements a modern, responsive Single Page Application (SPA) blog layout rendering dynamic post cards loaded from a structured JSON dataset, complete with real-time multi-criteria search, category filters, sorting, bookmarks drawer, post reader modal with syntax highlighting, and an article publishing workflow.

---

## 🎯 Task Objective & Compliance Matrix

Per the official **SkillNexis Week 1 Task Curriculum (PDF Page 4)**:
| Curriculum Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Develop a React-based blog layout displaying post cards from a JSON file** | Master dataset loaded from [`posts.json`](./src/data/posts.json), rendered into responsive glassmorphic cards with author profiles, tags, and cover images | ✅ Complete |
| **Add search functionality** | Real-time query search matching titles, excerpts, body content, author names, and tags with quick-filter trending topic chips | ✅ Complete |
| **Add filter functionality** | Dynamic category filter pills with live post count badges and sort dropdown (Newest, Popular, Shortest Read Time) | ✅ Complete |
| **Frontend design principles & responsiveness** | Glassmorphic dark & light theme system, CSS tokens, smooth animations, and mobile-first responsive layout | ✅ Complete |
| **React component structure** | Modular atomic components with clean prop contracts and unidirectional state orchestration | ✅ Complete |

---

## 🏗️ Architecture & Component Directory

```
03-react-blog-ui/
├── index.html                  # HTML5 boilerplate, Google Fonts (Inter, Outfit, Fira Code)
├── package.json                # Project dependencies (React 19, Vite)
├── src/
│   ├── main.jsx                # Application entry point
│   ├── App.jsx                 # Master state orchestration & handlers
│   ├── index.css               # Design tokens, themes (Dark/Light), resets
│   ├── App.css                 # Layouts, cards, reader modal, animations
│   ├── data/
│   │   └── posts.json          # Standardized JSON blog dataset
│   └── components/
│       ├── Navbar.jsx          # Sticky header with branding, search, theme toggle, and CTAs
│       ├── HeroFeatured.jsx    # Spotlight banner for the top trending story
│       ├── SearchBar.jsx       # Real-time search input with clear button & trending chips
│       ├── FilterBar.jsx       # Category pills with counts and sort controls
│       ├── PostCard.jsx        # Glassmorphic card with likes, bookmarks & share
│       ├── PostModal.jsx       # Detailed reader view with progress bar, code block & comments
│       ├── CreatePostModal.jsx # Form with live preview to publish articles to state
│       ├── BookmarksDrawer.jsx # Slide-over drawer listing saved stories
│       ├── NewsletterSection.jsx # Newsletter subscription with validation feedback
│       ├── Footer.jsx          # Semantic footer with topic links and attribution
│       └── Toast.jsx           # Floating notification toast
```

---

## 🌟 Key Application Features

1. **JSON Data Feed (`posts.json`)**:
   - Structured JSON schema containing realistic engineering stories across React 19, TypeScript 5.8, Modern CSS, Node.js & Redis, Local LLMs/RAG, and Distributed Systems.
2. **Real-time Search & Filter Engine**:
   - Live query searching across titles, summaries, tags, authors, and body text.
   - Dynamic category filter pills with article count badges.
   - Sorting options: *Newest First*, *Most Popular (Likes)*, *Shortest Read Time*, *Longest Read Time*.
3. **Interactive Post Reader Modal**:
   - Top reading progress tracker bar.
   - Syntax-highlighted code blocks with one-click **"Copy Code"** button.
   - Author bio badge with interactive **"Follow Author"** toggle.
   - **Interactive Discussion Section**: Submit comments with author name and upvote comments in real-time.
   - **Recommended Articles Grid** based on category relevance.
4. **"Write Story" Article Publisher**:
   - Tabbed modal with **"Edit"** and **"Live Preview"** modes.
   - Cover art presets picker or custom URL input.
   - Instant dispatch to state with toast notification.
5. **Saved Bookmarks Drawer**:
   - Slide-over right drawer displaying saved reading list.
   - Badge counter on navbar bookmark icon.
6. **Dark & Light Mode Switcher**:
   - Instant visual theme switching with CSS custom properties.

---

## 🚀 How to Run Locally

```bash
# 1. Navigate into project directory
cd 03-react-blog-ui

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Or build production bundle
npm run build
npm run preview
```

---

## 📱 Responsiveness & Tested Devices
- 📱 **Mobile** (320px – 480px): Compact single-column card feed, scrollable categories, slide-in reader drawer.
- 💻 **Tablet** (768px – 1024px): 2-column card grid, full filter bar controls.
- 🖥️ **Desktop & Ultrawide** (1200px+): Full multi-column grid layout, large hero banner, and split-screen reader experience.
