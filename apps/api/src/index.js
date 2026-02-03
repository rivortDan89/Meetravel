import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import etiquetasRoutes from "./routes/etiquetas.routes.js";
import lugaresRoutes from "./routes/places.routes.js";
import googlePlacesRouter from "./routes/googleplaces.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";

import { pool } from "./config/db.js";

dotenv.config({ path: new URL("../.env", import.meta.url) });

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

// Rutas
app.use("/health", healthRoutes);
app.use("/etiquetas", etiquetasRoutes);
app.use('/api/places', lugaresRoutes);
app.use("/google-places", googlePlacesRouter);
app.use("/reviews", reviewsRoutes);

// Ruta de prueba BD (muy útil para depurar)
// Ruta de prueba BD (solo si ENABLE_DB_TEST=true)
if (process.env.ENABLE_DB_TEST === "true") {
  app.get("/db-test", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT 1 AS ok");
      res.json({ ok: true, rows });
    } catch (error) {
      console.error("DB-TEST ERROR:", error);
      res.status(500).json({
        ok: false,
        error: error.message,
        code: error.code,
      });
    }
  });
}


app.get("/", (req, res) => {
  res.json({
    ok: true,
    name: "meetravel-api",
    endpoints: ["/health", "/db-test", "/api/places", "/etiquetas", "/google-places",
      "/reviews/accesibilidad/:idLugar"],
  });
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
