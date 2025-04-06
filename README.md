# NotesBoard App 📝

A simple and modern note-taking application with a focus on **organization**, **color**, and **privacy**. Built using **React**, **Zustand**, and **SQLite**, it allows each user (scoped by a token) to manage personal boards and notes — including importing and exporting data as JSON.

---

## 🚀 Features

- 🗂️ Create and manage **boards**
- 📝 Add, edit, and delete **notes** with:
  - Title, category, background color
  - Rich content using a WYSIWYG editor (React Quill)
- 🔎 Filter notes by category and search by keyword
- 📤 Export & 📥 Import notes and boards as `.json`
- 🔐 Each user is scoped via a secure `x-user-token` header
- 🛡️ Backend protected via `x-app-key`
- ⚡️ Fast UI with Zustand and TailwindCSS

---

## 🛠️ Tech Stack

### Frontend
- ⚛️ React 18 + Vite
- 🧠 Zustand (state management)
- 🎨 Tailwind CSS
- ✍️ React Quill (Rich text editor)
- 🔷 TypeScript

### Backend (included)
- 🧱 Node.js + Express
- 🗃️ SQLite (with schema for boards & notes)
- 🔐 User isolation via `x-user-token` header
- 🔐 Application authentication via `x-app-key` header

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/akorti/notesboard.git
cd notesboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Create a `.env` file (both frontend & backend):

```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_SECRET_KEY=my-super-secret-app-key

# Backend (.env)
APP_SECRET_KEY=my-super-secret-app-key
```

---

## ▶️ Run the App

### 1. Start the backend

```bash
cd server
node index.js
```

> The server runs on `http://localhost:3001` and stores data in `database.sqlite`.

### 2. Start the frontend

```bash
npm run dev
```

---

## 🧪 Testing

This project uses **Vitest** and **React Testing Library**.

```bash
npm run test
```

---

## 📤 Export / 📥 Import JSON

Use the interface to export and import your data securely:

### Structure of exported JSON:

```json
{
  "boards": [
    { "id": 1, "name": "Work" }
  ],
  "notes": [
    {
      "id": 101,
      "title": "Meeting Notes",
      "content": "...",
      "color": "bg-yellow-200",
      "category": "Work",
      "boardId": 1
    }
  ]
}
```

Import automatically attaches your current `x-user-token` to the data.

---

## ⚙️ API Endpoints (Node.js Server)

| Method | Endpoint                    | Description                  |
|--------|-----------------------------|------------------------------|
| GET    | `/boards`                   | List user boards             |
| POST   | `/boards`                   | Create a new board           |
| DELETE | `/boards/:id`               | Delete a board               |
| GET    | `/boards/:id/notes`         | List notes for a board       |
| POST   | `/boards/:id/notes`         | Add a new note               |
| PUT    | `/notes/:id`                | Update a note                |
| DELETE | `/notes/:id`                | Delete a note                |
| GET    | `/export`                   | Export all user data         |
| POST   | `/import`                   | Import notes & boards (replace by ID) |

> 🔐 **All routes require headers**:
> - `x-user-token: your-user-token`
> - `x-app-key: your-app-secret`

---

## 📁 Project Structure

```
.
├── src/
│   ├── components/
│   ├── stores/
│   ├── services/
│   ├── config/
│   └── App.tsx, main.tsx, etc.
├── server/
│   └── index.js
├── vite.config.ts
└── README.md
```

---

## ✨ License

MIT © 2025 – [akorti](https://github.com/akorti)
