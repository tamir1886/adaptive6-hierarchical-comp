# Frontend – Hierarchical File Explorer

A modern React implementation of a hierarchical file explorer.  
Built with a **production-grade architecture** that emphasizes separation of concerns, clean APIs, and correct async state handling.

This project is intentionally structured to demonstrate **senior-level frontend design**, not just UI rendering.

---

# 🧱 Tech Stack & Rationale

## ⚛️ React + TypeScript
- Strong typing for tree nodes, folders, and files
- Predictable data flow and component boundaries
- Prevents UI ↔ logic coupling
- Essential for scalability and long-term maintenance

---

## ⚡ Vite
- Ultra-fast dev server and HMR
- Minimal configuration
- Excellent DX for modern React projects
- Ideal for interview and real-world projects alike

---

## 🎨 Material UI (MUI)

Why MUI?
- Production-proven component library
- Accessible, consistent UI out of the box
- Ready-made components for lists, icons, loaders, typography
- Keeps focus on architecture instead of CSS noise

---

## 🧠 Custom Controller Pattern (Core Design Choice)

### `useFileTreeController`

The most important architectural piece in this project.

Used for:
- Managing expanded / collapsed folder state
- Triggering async loading on demand
- Caching loaded nodes
- Handling retries and error recovery
- Exposing a clean, declarative API to the UI

Why?
- Keeps UI components pure and stateless
- Makes async behavior predictable
- Easily replaceable with React Query / Redux / Zustand
- Extremely testable

---

## 🔌 Adapter Layer (Data Mapping)

### `fakeFsAdapter`

A pure transformation layer between backend data and UI data.

Used for:
- Converting domain entities into tree nodes
- Normalizing inconsistent backend shapes
- Formatting file metadata (size, type)
- Attaching icons and labels

Why?
- Prevents backend details from leaking into UI
- Keeps UI logic simple
- Allows backend changes without refactoring components

---

## 🧪 Mock Backend

### `FakeFsServer`

A realistic fake API used during development.

Provides:
- Artificial network latency
- Random folder & file generation
- Simulated error cases

Why?
- Enables real async behavior testing
- Forces correct loading/error handling
- Allows development without a real backend

---

# 🖥 Features

### ✔ Hierarchical Tree
- Unlimited folder depth
- Expand / collapse folders
- Lazy loading per folder

### ✔ Async States
- Per-node loading indicators
- Error handling with retry support
- Cached results to avoid refetching

### ✔ Clean UI
- Declarative rendering
- Icons per file type
- Placeholder state when nothing is selected

### ✔ Architecture-First Design
- UI contains no business logic
- Logic layer contains no JSX
- Data layer contains no state

