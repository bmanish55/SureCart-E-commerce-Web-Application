# E-commerce Web Application

This repository is a sample full‑stack e‑commerce application (Node/Express backend + React frontend). The project includes authentication, product listings, cart, checkout and order flows.

This README gives simple, copy‑pasteable steps to run the project locally and a placeholder section where you can add a demo video (link or embed).

---

## Quick overview
- Backend: Node.js + Express, MySQL (uses mysql2/promise)
- Frontend: React (Create React App)
- Ports used (defaults): frontend `3000`, backend `5000`

## Project layout
- `backend/` - Express API, DB initialization, routes/controllers/models
- `frontend/` - React app (pages, components, services)

## Prerequisites
- Node.js (LTS) and npm
- MySQL server running (local or remote)

## Run the project (simple steps)
These steps assume you've unzipped the project to a folder (for example `D:\project`) and MySQL is running locally. The backend will create the database and tables automatically on startup.

1. Backend environment

   Create a file `backend/.env` with at least the following values (edit to match your MySQL password):

   ```text
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ecommerce_db
   JWT_SECRET=some_long_secret_here
   ```

2. Start backend

   Open a terminal (PowerShell or bash) and run:

   ```powershell
   cd D:\project\backend
   npm install
   npm run dev
   ```

   - The backend will attempt to create the database and tables on first run using the values in `.env`.

3. Start frontend

   In a new terminal:

   ```powershell
   cd D:\project\frontend
   npm install
   npm start
   ```

   - The React app should open at `http://localhost:3000`.

4. Verify

   - Open `http://localhost:3000`
   - Use the seeded demo accounts (if present) to log in:
     - `demo@example.com` / `password123`
     - `test@example.com` / `test123`
   - Try Products, Cart, Checkout and Orders pages.

## Environment hints
- If MySQL user cannot `CREATE DATABASE`, create `ecommerce_db` manually and ensure `.env` DB credentials can access it.
- If you change `JWT_SECRET`, any previously issued tokens will become invalid.

## Demo video 



https://github.com/user-attachments/assets/77366792-e355-419c-8e66-efe93ded4c5f



## Useful commands
- Start backend (dev): `npm run dev` (from `backend/`)
- Start backend (prod): `npm start` (from `backend/`)
- Start frontend: `npm start` (from `frontend/`)

## Troubleshooting
- `ECONNREFUSED` to MySQL: ensure MySQL is running and `.env` DB credentials are correct.
- `EADDRINUSE` on port 5000: change `PORT` in `backend/.env` or stop the process using that port.
- 401 errors: check `JWT_SECRET` and confirm frontend is passing Authorization header (the app stores token in localStorage).

## Contact / Next steps
- To add a demo video, replace the placeholder above with your YouTube URL.
- If you'd like I can add `backend/.env.example` and `frontend/.env.example` files into the repo.

---

Thank you — enjoy exploring the app!
