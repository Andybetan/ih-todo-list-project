# Task Manager — Vue 3 + Supabase

A full-stack task management web app built with Vue 3, Supabase and Vercel. Originally submitted as a bootcamp final project, it has since been refactored, documented and progressively improved to meet a more professional standard.

**Live demo:** https://ih-todo-list-project.vercel.app  
**Repository:** https://github.com/Andybetan/ih-todo-list-project

---

## From bootcamp project to portfolio-ready app

This project started as a final deliverable for the Ironhack Web Development bootcamp. After the initial submission, I continued working on it independently — rebuilding an expired Supabase backend, refactoring a monolithic view into reusable components, adding real UX patterns, and improving code quality throughout.

The goal was not to rebuild it from scratch, but to take real working code and bring it progressively closer to a professional standard: better architecture, better user experience, and honest documentation of every decision made along the way.

---

## Stack

| Technology | Role |
|---|---|
| Vue 3 (Composition API) | UI framework |
| Vite | Build tool and dev server |
| Pinia | State management |
| Vue Router | Client-side routing |
| Supabase | Auth (email/password) + PostgreSQL database |
| Vercel | CI/CD and hosting |

---

## Features

- **Authentication** — Sign up, log in and log out with Supabase Auth
- **Per-user data** — Row Level Security ensures each user only sees their own tasks
- **Task CRUD** — Create, read, update (inline on double-click) and delete tasks
- **Favorites** — Pin tasks to the top; sorted automatically
- **Priority levels** — High / Normal / Low with color-coded badges
- **Automatic sorting** — Favorites first → priority → creation date
- **Filters** — View All, Pending or Completed tasks
- **Search** — Real-time text search within the active filter
- **Counters** — Total, Pending and Completed counts, always reflecting the full list
- **Contextual empty states** — Unique message and SVG icon per scenario (no tasks, no pending, no completed, no search results)
- **Toast notifications** — Non-blocking success and error feedback for every action
- **Confirm modal** — Custom modal replaces native `confirm()` for destructive actions
- **Loading states** — Spinner on initial load; buttons disabled during async operations

---

## Architecture

Refactored from a single monolithic view (~750 lines) into a component-based architecture:

```
src/
├── views/
│   └── HomeView.vue          # Orchestrator: manages state and computed data
├── components/
│   ├── AppHeader.vue         # App title (presentational, no state)
│   ├── TaskForm.vue          # New task input
│   ├── TaskFilters.vue       # Filter tabs + search input
│   ├── TaskList.vue          # List container + counters
│   ├── TaskItem.vue          # Individual task card with all actions
│   ├── TaskEmpty.vue         # Contextual empty state
│   ├── ToastNotification.vue # Global toast system (via Teleport)
│   └── ConfirmModal.vue      # Global confirm dialog (via Teleport)
├── composables/
│   ├── useToast.js           # Singleton toast state shared app-wide
│   └── useConfirm.js         # Promise-based confirm API
├── stores/
│   └── tasksStore.js         # Pinia store for task operations
└── api/
    └── tasksApi.js           # Supabase queries and client-side sorting
```

`HomeView` owns the filter/search state, computes the filtered task list and counters, and passes data down as props. Child components emit events upward and avoid side effects where possible.

---

## Technical improvements

### Phase 1 — Repo hygiene and production deploy
- Added `.gitignore`; removed `node_modules` from Git history
- Created `.env.example` to document required environment variables
- Rebuilt an expired Supabase backend from scratch (schema, indexes, RLS policies)
- Diagnosed and resolved a production failure: the root cause was infrastructure expiry, not a config issue

### Phase 2 — Component refactor
- Split a ~750-line monolithic view into 5 single-responsibility components
- Moved editing and menu state to the component level where it belongs
- Fixed a memory leak: `document` event listeners now clean up on `onUnmounted`

### Phase 3 — UX improvements
- Replaced all native `alert()` and `confirm()` with a custom toast and modal system
- Composable singletons (`useToast`, `useConfirm`) shared app-wide via `<Teleport>`
- Loading spinner on page load; buttons disabled during any in-flight async operation

### Phase 4 — Filters, search and counters
- Filter tabs (All / Pending / Completed) with real-time text search
- Counters computed from the full task list, independent of the active filter
- Contextual empty state: unique SVG icon and message per scenario

### UI polish
- Removed heavy left-border indicators from hover and favorite states
- Replaced with a subtle shadow lift on hover and a warm background + soft border for favorites

---

## Getting started

### Prerequisites

- Node.js 18+
- A Supabase project with the `todos` table (schema below)

### Installation

```bash
git clone https://github.com/Andybetan/ih-todo-list-project.git
cd ih-todo-list-project
npm install
```

### Environment variables

Create a `.env` file in the project root (use `.env.example` as reference):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> `.env` is excluded from version control. Never commit real credentials.

### Run locally

```bash
npm run dev
```

### Database schema

```sql
CREATE TABLE todos (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users NOT NULL,
  title       text NOT NULL,
  completed   boolean DEFAULT false,
  favorite    boolean DEFAULT false,
  priority    text DEFAULT 'normal',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Each user can only access their own tasks
CREATE POLICY "select_own" ON todos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "insert_own" ON todos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own" ON todos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "delete_own" ON todos FOR DELETE USING (auth.uid() = user_id);
```

---

## Security

- Row Level Security is enabled on the `todos` table — the database itself enforces per-user isolation
- The Supabase anon key is designed to be client-side safe; RLS policies are the actual security layer
- No real credentials are committed to this repository

---

## What I learned

- Vue 3 Composition API, `<script setup>` and the mental model of reactive state
- When to use props, emits, composables and a Pinia store — and why the distinction matters
- Supabase: Auth flows, Row Level Security and writing database policies
- How Vite exposes environment variables to the client (`VITE_` prefix) and why production builds differ
- Debugging a live production failure: distinguishing a config issue from infrastructure expiry
- UX patterns worth caring about: non-blocking notifications, loading states, contextual empty states

---

## Possible next steps

- Dark mode
- Due dates and reminders
- Drag-and-drop reordering
- Mobile layout refinements

---

## License

MIT — © 2026 Andrés Beltrán Betancourt
