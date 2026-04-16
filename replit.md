# Task Manager

A full-stack Task Manager application with a React frontend and Express.js backend.

## Architecture

- **Frontend**: React 18 + Vite, running on port 5000
- **Backend**: Express.js REST API, running on port 3001 (proxied via Vite's dev server)
- **Storage**: In-memory (tasks stored in server memory; resets on restart)

## Project Structure

```
/
├── server/
│   └── index.js       # Express API server (port 3001)
├── src/
│   ├── App.jsx        # Main React component
│   ├── App.css        # Component styles
│   ├── main.jsx       # React entry point
│   └── index.css      # Global styles
├── index.html         # HTML entry point
├── vite.config.js     # Vite config (proxy /api → localhost:3001, host 0.0.0.0)
└── package.json       # Scripts and dependencies
```

## API Endpoints

- `GET /api/tasks` — list all tasks (supports ?status=, ?priority= filters)
- `GET /api/tasks/stats` — task counts by status and priority
- `GET /api/tasks/:id` — get a single task
- `POST /api/tasks` — create a task
- `PUT /api/tasks/:id` — update a task
- `DELETE /api/tasks/:id` — delete a task

## Running

```bash
npm run dev     # Starts both frontend (port 5000) and backend (port 3001)
```

## Features

- Create, edit, and delete tasks
- Filter by status (To Do / In Progress / Done) and priority (Low / Medium / High)
- Click a task's status badge to cycle through statuses
- Stats bar showing totals at a glance
- Dark theme UI
