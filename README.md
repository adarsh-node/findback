# FindBack

FindBack is a production-minded lost and found platform. This repository currently contains the milestone-one application foundation only; reporting, matching, claims, authentication, database integration, notifications, chat, and administration are intentionally deferred.

## Architecture

```
findback/
├── client/              # React + Vite single-page application
│   └── src/             # UI entry point, router shell, and Tailwind styles
├── server/              # Express API
│   └── src/
│       ├── app.js       # Express app and HTTP middleware/routes
│       └── server.js    # Process startup and environment configuration
├── .gitignore
└── package.json         # Root development commands
```

The frontend uses React, Vite, React Router, and Tailwind CSS v4 through the Vite plugin. The Vite scripts use its native config loader, which is compatible with Tailwind's native build dependency on Windows. The server uses Express, dotenv, and Mongoose. It connects to MongoDB before accepting HTTP requests, and `GET /api/health` reports a safe database connection state without exposing connection information. Redux Toolkit, JWT, Cloudinary, Socket.IO, and geospatial capabilities will be introduced only when their related product milestones begin.

## Prerequisites

- Node.js 24 or later
- npm 11 or later

## Development

From the repository root:

```bash
npm run dev
```

This starts the Vite client (normally `http://localhost:5173`) and Express API (`http://localhost:5000`).

Or run each service separately:

```bash
npm run dev:client
npm run dev:server
```

## Available commands

```bash
npm run dev          # Start both services
npm run build        # Production-build the client
npm run start        # Start the API without file watching
```

## Health check

When the API is running, request `http://localhost:5000/api/health`. It responds with the API service status.

## Authentication API

Authentication uses bcrypt-compatible password hashing and an HTTP-only JWT cookie. Set the values shown in `server/.env.example` in a local `server/.env`; do not commit that file.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account and start an authenticated session |
| `POST` | `/api/auth/login` | Start an authenticated session |
| `POST` | `/api/auth/logout` | Clear the authenticated session cookie |
| `GET` | `/api/auth/me` | Return the authenticated user's safe profile |
