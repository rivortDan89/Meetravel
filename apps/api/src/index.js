import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import etiquetasRoutes from "./routes/etiquetas.routes.js";
import placesRoutes from "./routes/places.routes.js";
import googlePlacesRouter from "./routes/googleplaces.routes.js";

import { pool } from "./db.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Rutas
app.use("/health", healthRoutes);
app.use("/etiquetas", etiquetasRoutes);
app.use('/api/lugares', lugaresRoutes);
app.use("/google-places", googlePlacesRouter);

// Ruta de prueba BD (muy útil para depurar)
if (process.env.NODE_ENV !== "production") {
  app.get("/db-test", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT 1 AS ok");
      res.json({ ok: true, rows });
    } catch (error) {
      res.status(500).json({ ok: false, error: error.message });
    }
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
