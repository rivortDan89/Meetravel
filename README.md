<div align="center">
  <h1>MeeTravel</h1>
</div>

MeeTravel es una aplicación web desarrollada como Proyecto Final (2º DAW).  
El objetivo del prototipo es ofrecer un mapa interactivo con información de accesibilidad de lugares, aportada y consultada por la comunidad.

Este repositorio incluye frontend (React + Vite) y una API backend (Node/Express) conectada a MySQL.

---

## Índice
* [Descripción](#descripción)
* [Tecnologías](#tecnologías)
* [Estructura del proyecto](#estructura-del-proyecto)
* [Instalación y ejecución](#instalación-y-ejecución)
* [Variables de entorno](#variables-de-entorno)
* [Rutas de la API](#rutas-de-la-api)
* [Notas](#notas)

---

## Descripción

MeeTravel permite:
- Visualizar lugares en un mapa (Leaflet + OpenStreetMap)
- Consultar una ficha de lugar y reseñas relacionadas con accesibilidad
- Importar lugares desde Google Places (integración opcional presente en la API)

---

## Tecnologías

### Frontend (`apps/web`)
- React (Vite)
- react-router-dom
- Leaflet + react-leaflet
- @fortawesome/fontawesome-free
- phosphor-react
- CSS (sin framework)

### Backend (`apps/api`)
- Node.js + Express
- cors, dotenv
- mysql2
- node-fetch

### Integración opcional (presente en la API)
- Google Places (ruta de importación)

---

## Estructura del proyecto

- `apps/web` → Frontend (React + Vite)
- `apps/api` → Backend API (Express)

---

## Instalación y ejecución

### 1) Backend
```bash
cd apps/api
npm install
npm run dev
```

Backend por defecto:
- http://localhost:3001

### 2) Frontend
```bash
cd apps/web
npm install
npm run dev
```

Frontend por defecto:
- http://localhost:5173

---

## Variables de entorno

### Frontend (`apps/web/.env`)
```bash
VITE_API_URL=http://localhost:3001
```

### Backend (`apps/api/.env`)
Variables típicas usadas por el proyecto:
```bash
PORT=3001
CORS_ORIGIN=http://localhost:5173

# MySQL (ajustar según tu BD local)
DB_HOST=...
DB_USER=...
DB_PASSWORD=...
DB_NAME=...

# Opcional (solo para importación de Google Places)
GOOGLE_PLACES_API_KEY=...

# Opcional (activa GET /db-test)
ENABLE_DB_TEST=false
```

Nota: no subir `.env` al repositorio.

---

## Rutas de la API

Servidor base (`apps/api`):
- `GET /` → información básica + lista de endpoints
- `GET /health`

Etiquetas:
- `GET /etiquetas`
  - Opcional: `GET /etiquetas?tipo=...`

Lugares:
- `GET /api/places`

Reseñas:
- `GET /reviews/accesibilidad/:idLugar`

Google Places (opcional):
- `GET /google-places/importar?lat=...&lng=...&radius=1000&type=restaurant`

Test de base de datos (opcional):
- `GET /db-test` (solo si `ENABLE_DB_TEST=true`)

---

## Notas

- Parte de la interfaz es estática/prototipo y se conectará a datos reales en iteraciones posteriores.
- Si cambias el `.env` del frontend, reinicia el servidor de Vite.
