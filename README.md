<div align="center">
  <h1>MeeTravel</h1>
</div>

MeeTravel is a web application prototype developed as a final project (2º DAW).  
It focuses on an interactive map (Leaflet + OpenStreetMap) and accessibility-related information for places.

This repository includes a frontend (React + Vite) and a backend API (Node/Express) connected to a MySQL database.

---

## Table of Contents
* [Technologies](#technologies)
* [Project Structure](#project-structure)
* [Setup](#setup)
* [Environment Variables](#environment-variables)
* [API Routes](#api-routes)
* [Notes](#notes)

---

## Technologies

### Frontend (apps/web)
- React (Vite)
- react-router-dom
- Leaflet + react-leaflet
- @fortawesome/fontawesome-free
- phosphor-react
- CSS (no framework)

### Backend (apps/api)
- Node.js + Express
- cors, dotenv
- mysql2
- node-fetch

### Optional integration (present in API)
- Google Places (import route)

---

## Project Structure

- `apps/web` → Frontend (React + Vite)
- `apps/api` → Backend API (Express)

---

## Setup

### 1) Backend
```bash
cd apps/api
npm install
npm run dev
```

Backend default:
- http://localhost:3001

### 2) Frontend
```bash
cd apps/web
npm install
npm run dev
```

Frontend default:
- http://localhost:5173

---

## Environment Variables

### Frontend (`apps/web/.env`)
```bash
VITE_API_URL=http://localhost:3001
```

### Backend (`apps/api/.env`)
Typical variables used by the project:
```bash
PORT=3001
CORS_ORIGIN=http://localhost:5173

# MySQL (adjust to your local DB)
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...

# Optional (only needed for Google Places import)
GOOGLE_PLACES_API_KEY=...

# Optional (enables GET /db-test)
ENABLE_DB_TEST=false
```

Note: `.env` files should not be committed.

---

## API Routes

Base server (apps/api):
- `GET /` → basic info + endpoints list
- `GET /health`

Tags:
- `GET /etiquetas`
  - Optional: `GET /etiquetas?tipo=...`

Places:
- `GET /api/places`

Reviews:
- `GET /reviews/accesibilidad/:idLugar`

Google Places (optional):
- `GET /google-places/importar?lat=...&lng=...&radius=1000&type=restaurant`

Database test (optional):
- `GET /db-test` (only if `ENABLE_DB_TEST=true`)

---

## Notes

- The current UI includes static layouts/components that will be connected to the database later.
- If you change frontend `.env`, restart the Vite dev server.
