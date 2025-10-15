# Music Streamin App

A simple full‑stack music streaming / admin management demo built with a React + Vite frontend and an Express + Node backend. Includes Clerk authentication, Cloudinary for file uploads, MongoDB for data storage, and Socket.IO for real‑time activity updates.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind, Clerk (auth), Zustand (state)
- Backend: Node.js, Express, Mongoose (MongoDB), Clerk (auth middleware), Cloudinary (uploads)
- Realtime: Socket.IO

## Features

- Browse songs, albums and curated sections (featured, trending, made‑for‑you)
- Admin panel to create / delete songs and albums (file upload to Cloudinary)
- User authentication with Clerk
- Real‑time activity updates via Socket.IO
- DB seeding scripts for songs and albums

## Repo layout

- `frontend/` — React + Vite app
- `backend/` — Express API and controllers

## Prerequisites

- Node.js (≥16)
- MongoDB (local or cloud)
- Cloudinary account (cloud name, API key/secret)
- Clerk account for auth (frontend + backend setup)

## Environment (backend)

Create a `.env` in `backend/` with at least:

- `PORT` — e.g. `5000`
- `MONGODB_URI` — MongoDB connection string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `CLERK_SECRET_KEY` / Clerk configuration as required by your Clerk setup
- `ADMIN_EMAIL` — email address used to authorize the admin user
- `NODE_ENV` — `development` or `production`

## Environment (frontend)

Create `.env.local` in `frontend/` for any Clerk frontend keys and Vite env variables (follow Clerk docs). The frontend axios instance will call the backend at `http://localhost:5000/api` in development.

## Install & run (development)

From repository root, open two terminals:

1) Backend

cd backend
npm install
npm run dev

2) Frontend

cd frontend
npm install
npm run dev

Open the frontend (default Vite port) e.g. http://localhost:5173 and the backend on the port set in your `.env` (default examples use 5000).

## Seed the database

To seed songs or albums (backend):

cd backend
npm run seed:songs
npm run seed:albums

## Important implementation notes

- The backend uses Clerk middleware to populate `req.auth` (so `req.auth.userId` is available). Admin routes are protected by two middlewares: `protectRoute` (requires a logged‑in user) and `requireAdmin` (ensures user's primary email matches `ADMIN_EMAIL`).
- File uploads use `express-fileupload` and temporary files under `tmp/`. Cloudinary handles actual storage.

## API (high level)

- GET `/api/songs/featured` — public
- GET `/api/songs/made-for-you` — public
- GET `/api/songs/trending` — public
- GET `/api/albums` — public
- GET `/api/albums/:id` — public

Admin (requires auth + admin):
- GET `/api/admin/check` — verify admin
- POST `/api/admin/songs` — create song (multipart form: audioFile, imageFile + fields)
- DELETE `/api/admin/songs/:id` — delete song
- POST `/api/admin/albums` — create album (multipart form: imageFile + fields)
- DELETE `/api/admin/albums/:id` — delete album

## Troubleshooting — 401 Unauthorized while creating songs/albums

Common causes:

- Browser requests not sending auth cookies to the backend. The frontend axios instance must send credentials so Clerk can validate the session. The project is configured so axios sends cookies (`withCredentials: true`). If you made custom fetch/axios calls elsewhere, ensure `credentials: 'include'` or `withCredentials: true`.
- User not signed in with Clerk in the frontend.
- `ADMIN_EMAIL` on the backend does not match the signed‑in user's primary email (causes 403, not 401).

How to debug:

- In browser DevTools → Network, inspect the admin POST request and confirm a cookie header is sent and the response status.
- Call GET `/api/admin/check` and verify whether it returns `{ admin: true }`.
- Check backend logs for `req.auth` or add temporary logging in `protectRoute`/`requireAdmin`.

## Contributing

Pull requests welcome. For large changes, open an issue first to discuss the design.
