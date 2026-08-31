# ⚛️ Assignment 2: React Components Practice

Welcome to **Assignment 2** of the **SkillNexis MERN Stack Internship** (Week 1). This project demonstrates the core fundamentals of modern React.js: modular component architecture, props passing, reactive state management using `useState`, and responsive glassmorphic UI design.

---

## 🎯 Task Objective & Compliance

Per the official **SkillNexis Week 1 Task Curriculum**, this project implements:
1. **5 Reusable React Components:**
   - [`Header`](file:///src/components/Header.jsx)
   - [`Footer`](file:///src/components/Footer.jsx)
   - [`Button`](file:///src/components/Button.jsx)
   - [`Card`](file:///src/components/Card.jsx)
   - [`Form`](file:///src/components/Form.jsx)
2. **Dynamic Rendering with Props and State:**
   - Reactive list rendering via `.map()`
   - Bidirectional prop passing (callbacks, configurations, children)
   - Controlled form state with validation
   - Theme switching (Dark/Light) and category filtering

---

## 🏗️ Reusable Component Architecture & Props Reference

### 1. `Header` Component (`src/components/Header.jsx`)
- **Purpose**: Responsive top navigation bar with dynamic application branding, status pill, dynamic item counter tabs, and dark/light theme toggle.
- **Props**:
  | Prop Name | Type | Description |
  | :--- | :--- | :--- |
  | `title` | `string` | Main brand title |
  | `subtitle` | `string` | Sub-label or internship metadata |
  | `badgeText` | `string` | Status badge text (e.g. `Assignment 2`) |
  | `theme` | `'dark' \| 'light'` | Active visual theme mode |
  | `onThemeToggle` | `Function` | Callback handler to toggle theme in state |
  | `navTabs` | `Array<{label, count, active, onClick}>` | Dynamic filter tabs |

---

### 2. `Footer` Component (`src/components/Footer.jsx`)
- **Purpose**: Semantic footer layout with author credentials, dynamic copyright year, program links, and smooth scroll-to-top handler.
- **Props**:
  | Prop Name | Type | Description |
  | :--- | :--- | :--- |
  | `author` | `string` | Author/developer name |
  | `year` | `number` | Dynamic current year |
  | `organization` | `string` | Internship or organization name |
  | `links` | `Array<{label, url}>` | Navigation links |
  | `statusText` | `string` | Submission status summary |

---

### 3. `Button` Component (`src/components/Button.jsx`)
- **Purpose**: Atomic, multi-variant interactive button with hover transitions, loading spinner, icons, and disabled states.
- **Props**:
  | Prop Name | Type | Options / Default |
  | :--- | :--- | :--- |
  | `children` | `ReactNode` | Inner label or content |
  | `variant` | `string` | `'primary'` (default), `'secondary'`, `'outline'`, `'success'`, `'danger'` |
  | `size` | `string` | `'sm'`, `'md'` (default), `'lg'` |
  | `onClick` | `Function` | Click event handler |
  | `isLoading` | `boolean` | Displays animated spinner when true |
  | `disabled` | `boolean` | Disables interaction |
  | `icon` | `ReactNode` | Optional leading icon symbol |

---

### 4. `Card` Component (`src/components/Card.jsx`)
- **Purpose**: Flexible content card for displaying skills, milestones, or tasks with badge tags, priority indicators, and action triggers.
- **Props**:
  | Prop Name | Type | Description |
  | :--- | :--- | :--- |
  | `id` | `number \| string` | Unique identifier for state actions |
  | `title` | `string` | Card heading |
  | `category` | `string` | Domain category (Frontend, Backend, etc.) |
  | `priority` | `string` | `'high'`, `'medium'`, `'low'` badge |
  | `description` | `string` | Card body text |
  | `tags` | `Array<string>` | Tech badges rendered dynamically |
  | `likes` | `number` | Interactive like counter |
  | `completed` | `boolean` | Completion state indicator |
  | `onLike` | `Function` | Callback `(id) => {}` to increment likes |
  | `onToggleComplete` | `Function` | Callback `(id) => {}` to toggle status |
  | `onDelete` | `Function` | Callback `(id) => {}` to remove from state |

---

### 5. `Form` Component (`src/components/Form.jsx`)
- **Purpose**: Controlled form with real-time validation, dynamic field updates, error indicators, and on-submit state dispatch.
- **Props**:
  | Prop Name | Type | Description |
  | :--- | :--- | :--- |
  | `title` | `string` | Form header title |
  | `subtitle` | `string` | Form sub-header description |
  | `onSubmit` | `Function` | Receives compiled new card object `(cardData) => {}` |
  | `categories` | `Array<string>` | Selectable category options |

---

## ⚡ State Flow & Reactivity

```
[ App (Parent State) ]
 ├── themeState ('dark' | 'light') ──> Passed to <Header onThemeToggle={...} />
 ├── cardsState (Array of objects) ──>
 │     ├── <Form onSubmit={handleAddCard} /> (Appends new items to state)
 │     ├── <FilterBar /> (Filters state array by selected category)
 │     └── <Card key={card.id} onLike={...} onToggleComplete={...} onDelete={...} />
 └── buttonCounterState (number)  ──> <Button variant="primary" onClick={...} />
```

---

## 🚀 How to Run Locally

```bash
# Navigate to Assignment 2 directory
cd 02-react-components

# Install project dependencies
npm install

# Run the Vite development server
npm run dev

# Or build and run production preview
npm run build
npm run preview
```

---

## 📱 Responsiveness & Tested Devices

- 📱 **Mobile** (320px – 480px): Stacked single-column layouts, touch-friendly buttons.
- 💻 **Tablet** (768px – 1024px): 2-column card grid, scrollable navigation tabs.
- 🖥️ **Desktop** (1200px+): Full split view with sticky form and dynamic cards grid.
