## Quick orientation for AI coding agents

This repo is a full-stack e‑commerce sample with a Node/Express backend (MySQL) and a React frontend. Below are the essential facts, patterns, and concrete examples that make an agent productive immediately.

### Big-picture architecture
- Backend (folder: `backend/`) is an Express API that exposes routes under `/api/*` (see `backend/server.js`).
- Database: MySQL connection pool and schema initialization live in `backend/config/database.js`. That file auto-creates the database, tables, and inserts sample data on startup.
- Frontend (folder: `frontend/`) is a Create React App project. Routing is in `frontend/src/App.js`. Context providers for auth/cart are in `frontend/src/context/`.

### Key integration points
- API base URL: frontend uses `frontend/src/services/api.js` which sets `baseURL` from `API_BASE_URL` (see `frontend/src/utils/constants.js`).
- Auth: JWT token stored in `localStorage` under `token` and attached by axios interceptors in `frontend/src/services/api.js`. A 401 triggers clearing storage and redirect to `/login`.
- File uploads: backend serves uploaded assets from `/uploads` (static middleware in `backend/server.js`). `backend/middleware/upload.js` handles uploads.

### Developer workflows (how to run / debug)
- Backend (dev):
  - cd `backend`
  - install: `npm install`
  - run dev server: `npm run dev` (uses `nodemon server.js`)
  - production: `npm start` runs `node server.js`
- Frontend:
  - cd `frontend`
  - install: `npm install`
  - start dev server: `npm start` (react-scripts)
  - build for production: `npm run build`

### Environment / secrets
- Backend expects standard `.env` values used in `backend/config/database.js` and `server.js` (e.g. `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT`). Database initialization uses these values — ensure MySQL is reachable.

### Code organization & conventions
- Routes are defined in `backend/routes/*.js` and are thin: they delegate to controller functions in `backend/controllers/*.js`.
- Controllers call model methods defined in `backend/models/*.js` (models expose methods like `findAll`, `findById`, `searchProducts`, `getCategories`). Treat models as the canonical place for SQL/DB logic.
- Errors: controllers typically log and return 5xx JSON on errors; keep that pattern when adding new endpoints.
- Frontend state uses Context API (`AuthContext`, `CartContext`). New cross-cutting state should follow the same provider pattern.

### Common tasks & concrete examples
- To add a new product API endpoint:
  - Add route in `backend/routes/products.js`.
  - Implement handler in `backend/controllers/productController.js`.
  - Add SQL logic in `backend/models/Product.js` (follow existing `findAll` / `findById` style).
- To call backend from React, use `frontend/src/services/api.js`:
  - Example: `api.get('/products')` maps to `GET /api/products` on the server.

### Debugging tips
- If DB errors occur, check `.env` and confirm MySQL is running; `backend/config/database.js` logs connection success/failure.
- Check server console for stack traces (server uses simple error middleware in `server.js`).
- For auth issues, inspect `localStorage.token` and the axios request headers set by `frontend/src/services/api.js`.

### What not to assume
- The project does not use an ORM — models implement direct SQL via `mysql2` pool. Do not introduce ORM-only code without updating model patterns.
- The DB initializer creates tables and sample data; tests or runs on the same DB may see those records.

### Files to look at for examples
- `backend/server.js` (routing, middleware)
- `backend/config/database.js` (DB init, sample data)
- `backend/routes/*.js`, `backend/controllers/*.js`, `backend/models/*.js` (add new endpoints here)
- `frontend/src/services/api.js` (axios instance + auth behavior)
- `frontend/src/context/*` (Auth/Cart patterns)

If any of these areas are unclear or you'd like more examples (e.g., a working PR that adds a new endpoint plus frontend call and test), tell me which area to expand and I will iterate.
